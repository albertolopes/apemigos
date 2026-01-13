import { NextResponse } from 'next/server';

// Load .env in development for convenience
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config();
  } catch (e) {
    // ignore
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
const SERVER_SERVICE_KEY = process.env.SERVICE_KEY; // server-only secret
const PUBLIC_SERVICE_KEY = process.env.NEXT_PUBLIC_SERVICE_KEY; // public value expected in body
const ALLOWED_ORIGINS: string[] = (process.env.NEXT_ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function tryParseJson(s: string) {
  try {
    return JSON.parse(s);
  } catch (e) {
    return null;
  }
}

function normalizeOrigin(o: string) {
  if (!o) return '';
  return o.trim().replace(/\/$/, '').toLowerCase();
}

function originHostOnly(o: string) {
  if (!o) return '';
  return o
    .replace(/^https?:\/\//i, '')
    .replace(/\/$/, '')
    .toLowerCase();
}

function isOriginAllowed(incomingOrigin: string) {
  if (!incomingOrigin) return false;
  const normIncoming = normalizeOrigin(incomingOrigin);
  const hostIncoming = originHostOnly(incomingOrigin);
  const normalizedAllowed = ALLOWED_ORIGINS.map(normalizeOrigin);
  const hostAllowed = ALLOWED_ORIGINS.map(originHostOnly);
  if (normalizedAllowed.includes(normIncoming)) return true;
  if (hostAllowed.includes(hostIncoming)) return true;
  return false;
}

function maskSecret(s?: string) {
  if (!s) return undefined;
  if (s.length <= 8) return s[0] + '***';
  return s.slice(0, 6) + '...';
}

function validateEnv(): NextResponse | null {
  if (!API_URL) {
    console.error('service-login: API_URL not configured');
    return NextResponse.json(
      { message: 'API_URL not configured' },
      { status: 500 }
    );
  }
  if (!PUBLIC_SERVICE_KEY && !SERVER_SERVICE_KEY) {
    console.error('service-login: service keys not configured');
    return NextResponse.json(
      { message: 'Service key not configured' },
      { status: 500 }
    );
  }
  if (!ALLOWED_ORIGINS || ALLOWED_ORIGINS.length === 0) {
    console.warn(
      'service-login: no NEXT_ALLOWED_ORIGINS configured - origin checks disabled'
    );
  }
  return null;
}

export async function POST(request: Request) {
  const envErr = validateEnv();
  if (envErr) return envErr;

  const incomingOrigin = request.headers.get('origin') || '';
  if (
    incomingOrigin &&
    ALLOWED_ORIGINS.length > 0 &&
    !isOriginAllowed(incomingOrigin)
  ) {
    console.warn('service-login: rejected origin', incomingOrigin);
    return NextResponse.json(
      { message: 'Origin not allowed' },
      { status: 403 }
    );
  }

  try {
    // If cookie already present, return quickly
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/APEMIGOS_AUTH=([^;\s]+)/);
    if (match && match[1]) {
      return NextResponse.json(
        { serviceLogin: true, token: match[1] },
        { status: 200 }
      );
    }

    // Determine which public key to send in the body: favor what client sent, else NEXT_PUBLIC_SERVICE_KEY
    let bodyJson: any = {};
    try {
      const payload = await request.json();
      if (payload && payload.serviceKey) {
        bodyJson.serviceKey = payload.serviceKey;
      }
    } catch (e) {
      // ignore parse errors - we'll use env public key
    }
    if (!bodyJson.serviceKey) {
      if (PUBLIC_SERVICE_KEY) bodyJson.serviceKey = PUBLIC_SERVICE_KEY;
    }

    // Build headers for server->server call
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    // include server-side X-Service-Token if available (this is secret and lives on the server)
    if (SERVER_SERVICE_KEY) headers['X-Service-Token'] = SERVER_SERVICE_KEY;

    // Debug log (masked) - safe in dev
    if (
      process.env.NODE_ENV !== 'production' ||
      process.env.DEBUG_PROXY === 'true'
    ) {
      console.log(
        'service-login: calling backend',
        API_URL + '/api/auth/login'
      );
      console.log('service-login: headers', {
        ...headers,
        'X-Service-Token': maskSecret(headers['X-Service-Token']),
      });
      console.log(
        'service-login: body.serviceKey',
        maskSecret(bodyJson.serviceKey)
      );
    }

    const resp = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify(bodyJson),
    });

    const text = await resp.text();
    if (!resp.ok) {
      // return snippet for debug in dev
      const parsed = tryParseJson(text) || {
        message: text || 'Service login error',
      };
      if (
        process.env.NODE_ENV !== 'production' ||
        process.env.DEBUG_PROXY === 'true'
      ) {
        const snippet = (text || '').slice(0, 400);
        return new NextResponse(JSON.stringify(parsed), {
          status: resp.status,
          headers: {
            'Content-Type': 'application/json',
            'x-backend-snippet': encodeURIComponent(snippet),
            'Access-Control-Expose-Headers': 'x-backend-snippet',
          },
        });
      }
      return NextResponse.json(parsed, { status: resp.status });
    }

    const data = tryParseJson(text) || {};
    const token = data.token;
    if (!token) {
      return NextResponse.json(
        { message: 'Token not received from backend' },
        { status: 500 }
      );
    }

    const expiresIn = Number.isFinite(Number(data.expiresIn))
      ? Number(data.expiresIn)
      : 3600;
    const isProd = process.env.NODE_ENV === 'production';
    const secureFlag = isProd ? '; Secure' : '';
    const cookie = `APEMIGOS_AUTH=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${expiresIn}${secureFlag}`;

    // If caller provided the actual service key in Authorization header (less common), include token in response
    const callerAuth = request.headers.get('authorization') || '';
    const callerProvidedServiceKey =
      callerAuth.trim() === `Bearer ${SERVER_SERVICE_KEY}` ||
      callerAuth.trim() === `Bearer ${PUBLIC_SERVICE_KEY}`;

    const respBody: any = { serviceLogin: true, expiresIn };
    if (callerProvidedServiceKey) respBody.token = token;

    return new NextResponse(JSON.stringify(respBody), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookie,
        'Access-Control-Allow-Origin': incomingOrigin || '*',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  } catch (err: any) {
    console.error(
      'service-login: unexpected error',
      err && err.stack ? err.stack : err
    );
    return NextResponse.json(
      { message: err?.message || 'Internal error' },
      { status: 500 }
    );
  }
}
