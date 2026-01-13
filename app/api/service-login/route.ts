import { NextResponse } from 'next/server';

// In development, try loading .env for convenience
if (process.env.NODE_ENV !== 'production' && !process.env.NEXT_PUBLIC_API_URL) {
  try {
    require('dotenv').config();
    console.log('service-login: loaded .env via dotenv (dev)');
  } catch (e) {
    // ignore
  }
}

// Required envs (no hard-coded fallbacks)
const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
const SERVICE_KEY =
  process.env.SERVICE_KEY ?? process.env.NEXT_PUBLIC_SERVICE_KEY ?? undefined;
const ALLOWED_ORIGINS: string[] = (process.env.NEXT_ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const API_ORIGIN = (() => {
  try {
    return API_URL ? new URL(API_URL).origin : '';
  } catch (e) {
    return '';
  }
})();

// Dev/debug logs (do not print secrets)
if (
  process.env.NODE_ENV !== 'production' ||
  process.env.DEBUG_PROXY === 'true'
) {
  console.log('service-login: API_URL present?', !!API_URL);
  console.log('service-login: API_ORIGIN=', API_ORIGIN);
  console.log('service-login: ALLOWED_ORIGINS=', ALLOWED_ORIGINS);
  console.log('service-login: SERVICE_KEY present?', !!SERVICE_KEY);
}

function normalizeOrigin(o: string) {
  if (!o) return '';
  try {
    // keep protocol if present, but normalize trailing slash and lowercase
    return o.trim().replace(/\/$/, '').toLowerCase();
  } catch (e) {
    return o.trim().replace(/\/$/, '').toLowerCase();
  }
}

function originHostOnly(o: string) {
  if (!o) return '';
  // remove protocol if present
  return o.replace(/^https?:\/\//i, '').replace(/\/$/, '').toLowerCase();
}

function isOriginAllowed(incomingOrigin: string) {
  if (!incomingOrigin) return false;
  const normIncoming = normalizeOrigin(incomingOrigin);
  const hostIncoming = originHostOnly(incomingOrigin);

  const normalizedAllowed = ALLOWED_ORIGINS.map((a) => normalizeOrigin(a));
  const hostAllowed = ALLOWED_ORIGINS.map((a) => originHostOnly(a));

  // direct match
  if (normalizedAllowed.includes(normIncoming)) return true;
  // match by host only (ignore protocol)
  if (hostAllowed.includes(hostIncoming)) return true;
  return false;
}

function validateEnv(): NextResponse | null {
  if (!API_URL) {
    console.error(
      'service-login: NEXT_PUBLIC_API_URL or API_URL is not configured'
    );
    return NextResponse.json(
      { message: 'NEXT_PUBLIC_API_URL or API_URL not configured' },
      { status: 500 }
    );
  }
  if (!SERVICE_KEY) {
    console.error('service-login: SERVICE_KEY is not configured');
    return NextResponse.json(
      { message: 'SERVICE_KEY not configured' },
      { status: 500 }
    );
  }
  if (!ALLOWED_ORIGINS || ALLOWED_ORIGINS.length === 0) {
    console.error('service-login: NEXT_ALLOWED_ORIGINS is not configured');
    return NextResponse.json(
      { message: 'NEXT_ALLOWED_ORIGINS not configured' },
      { status: 500 }
    );
  }
  return null;
}

export async function POST(request: Request) {
  const envErr = validateEnv();
  if (envErr) return envErr;

  const isProd = process.env.NODE_ENV === 'production';

  // Determine caller origin and validate against allowed origins
  const incomingOrigin = request.headers.get('origin') || '';
  if (incomingOrigin && !isOriginAllowed(incomingOrigin)) {
    if (process.env.NODE_ENV === 'production') {
      // Log more details to help debug misconfiguration in prod
      console.warn('service-login: rejected origin', incomingOrigin);
      console.warn('service-login: allowed (normalized)=',
        ALLOWED_ORIGINS.map(normalizeOrigin));
      console.warn('service-login: allowed (hosts)=',
        ALLOWED_ORIGINS.map(originHostOnly));
      console.warn('service-login: incoming (normalized)=', normalizeOrigin(incomingOrigin));
      console.warn('service-login: incoming (host)=', originHostOnly(incomingOrigin));
      return NextResponse.json(
        { message: 'Origin not allowed' },
        { status: 403 }
      );
    } else {
      console.warn(
        'service-login: origin not in whitelist but allowing in development:',
        incomingOrigin
      );
    }
  }

  const callerOrigin = incomingOrigin || ALLOWED_ORIGINS[0] || API_ORIGIN || '';

  try {
    // If APEMIGOS_AUTH cookie already present, return it
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/APEMIGOS_AUTH=([^;\s]+)/);
    if (match && match[1]) {
      const existingToken = match[1];
      console.log('service-login: token recovered from cookie');
      const safeResp: any = {
        serviceLogin: true,
        expiresIn: null,
        token: existingToken,
      };

      return NextResponse.json(safeResp, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': callerOrigin,
          'Access-Control-Allow-Credentials': 'true',
        },
      });
    }

    // Call backend auth/login server-side
    const resp = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // Use API_ORIGIN so backend CORS acceptance matches requests coming from proxy
        Origin: API_ORIGIN,
        'X-Service-Token': SERVICE_KEY as string,
      },
      // send only serviceKey to match backend example
      body: JSON.stringify({ serviceKey: SERVICE_KEY }),
    });

    const text = await resp.text();

    // Dev-only debug: log snippet of backend response when not ok
    const debug =
      process.env.NODE_ENV !== 'production' ||
      process.env.DEBUG_PROXY === 'true';
    if (!resp.ok && debug) {
      try {
        console.warn(
          'service-login: backend returned',
          resp.status,
          'snippet:',
          text.slice(0, 400)
        );
      } catch (e) {
        // ignore
      }
    }

    if (!resp.ok) {
      try {
        const parsed = text
          ? JSON.parse(text)
          : { message: text || 'Service login error' };

        // In debug, expose a small snippet header so client can inspect backend message
        if (debug) {
          const snippetHeader = encodeURIComponent((text || '').slice(0, 400));
          return new NextResponse(JSON.stringify(parsed), {
            status: resp.status,
            headers: {
              'Content-Type': 'application/json',
              'x-backend-snippet': snippetHeader,
              'Access-Control-Expose-Headers': 'x-backend-snippet',
            },
          });
        }

        return NextResponse.json(parsed, { status: resp.status });
      } catch (e) {
        if (debug) {
          const snippetHeader = encodeURIComponent((text || '').slice(0, 400));
          return new NextResponse(
            JSON.stringify({ message: text || 'Service login error' }),
            {
              status: resp.status,
              headers: {
                'Content-Type': 'application/json',
                'x-backend-snippet': snippetHeader,
                'Access-Control-Expose-Headers': 'x-backend-snippet',
              },
            }
          );
        }

        return NextResponse.json(
          { message: text || 'Service login error' },
          { status: resp.status }
        );
      }
    }

    const data = JSON.parse(text);
    const token = data.token;
    const expiresIn = data.expiresIn ?? 3600;

    if (!token) {
      return NextResponse.json(
        { message: 'Token not received from backend' },
        { status: 500 }
      );
    }

    const maxAge = Number.isFinite(Number(expiresIn))
      ? Number(expiresIn)
      : 3600;

    const secureFlag = isProd ? '; Secure' : '';
    const cookie = `APEMIGOS_AUTH=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${secureFlag}`;

    // Determine if caller provided the service key in Authorization header
    const callerAuth = request.headers.get('authorization') || '';
    const callerProvidesServiceKey =
      callerAuth.trim() === `Bearer ${SERVICE_KEY}`;

    const safeResp: any = { serviceLogin: true, expiresIn: maxAge };
    if (callerProvidesServiceKey) {
      safeResp.token = token;
    }

    return NextResponse.json(safeResp, {
      status: 200,
      headers: {
        'Set-Cookie': cookie,
        'Access-Control-Allow-Origin': callerOrigin,
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  } catch (err: any) {
    console.error('Erro na rota /api/service-login:', err);
    return NextResponse.json(
      { message: err.message || 'Internal error' },
      { status: 500 }
    );
  }
}
