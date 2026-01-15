import { NextResponse } from 'next/server';

if (process.env.NODE_ENV !== 'production' && !process.env.NEXT_PUBLIC_API_URL) {
  try {
    require('dotenv').config();
    console.log('proxy: loaded .env via dotenv (dev)');
  } catch (e) {
    // ignore
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
let SERVER_KEY =
  process.env.SERVICE_KEY ?? process.env.NEXT_PUBLIC_SERVICE_KEY ?? null;
const ALLOWED_ORIGINS: string[] = (process.env.NEXT_ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

if (
  process.env.NODE_ENV !== 'production' ||
  process.env.DEBUG_PROXY === 'true'
) {
  console.log('proxy: API_URL present?', !!API_URL);
  console.log('proxy: ALLOWED_ORIGINS=', ALLOWED_ORIGINS);
  console.log('proxy: SERVER_KEY present?', !!SERVER_KEY);
}

function validateEnv(): NextResponse | null {
  if (!API_URL) {
    console.error('proxy: NEXT_PUBLIC_API_URL is not configured');
    return NextResponse.json(
      { message: 'NEXT_PUBLIC_API_URL not configured' },
      { status: 500 }
    );
  }

  if (!SERVER_KEY) {
    console.error('proxy: SERVICE_KEY is not configured');
    return NextResponse.json(
      { message: 'SERVICE_KEY not configured' },
      { status: 500 }
    );
  }

  if (!ALLOWED_ORIGINS || ALLOWED_ORIGINS.length === 0) {
    console.error('proxy: NEXT_ALLOWED_ORIGINS is not configured');
    return NextResponse.json(
      { message: 'NEXT_ALLOWED_ORIGINS not configured' },
      { status: 500 }
    );
  }

  return null;
}

const API_ORIGIN = (() => {
  try {
    return API_URL ? new URL(API_URL).origin : '';
  } catch (e) {
    return '';
  }
})();

function parseCookieValue(
  cookieHeader: string | null,
  name: string
): string | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(';').map((p) => p.trim());
  for (const p of parts) {
    if (p.startsWith(name + '=')) {
      return decodeURIComponent(p.substring(name.length + 1));
    }
  }
  return null;
}

async function forward(request: Request, params: { path: string[] }) {
  const envErr = validateEnv();
  if (envErr) return envErr;

  const path = params.path ? params.path.join('/') : '';
  const incomingUrl = new URL(request.url);
  const search = incomingUrl.search || '';
  const target = `${(API_URL as string).replace(/\/+$/, '')}/${path}${search}`;

  // Determine incoming origin (browser sent) and proxy origin (host that called this function)
  const incomingOrigin = request.headers.get('origin') || '';
  const proxyOrigin = incomingUrl.origin; // e.g. http://localhost:3000

  // Effective origin we will send to backend (prefer client origin, fallback to proxy origin)
  const effectiveOrigin = incomingOrigin || proxyOrigin;

  // Validate effective origin against allowed list
  if (effectiveOrigin && !ALLOWED_ORIGINS.includes(effectiveOrigin)) {
    console.warn(
      'proxy: rejected request from disallowed origin',
      effectiveOrigin
    );
    return NextResponse.json(
      { message: 'Origin not allowed' },
      { status: 403 }
    );
  }

  const headers: Record<string, string> = {};

  // Forward the effective origin exactly (important for backend CORS checks)
  headers['Origin'] = effectiveOrigin || API_ORIGIN;

  // Authorization: forward if present; else try to extract from cookie APEMIGOS_AUTH
  const authorization = request.headers.get('authorization');
  const cookieHeader = request.headers.get('cookie');
  let finalAuth = authorization || null;
  if (!finalAuth) {
    const cookieToken = parseCookieValue(cookieHeader, 'APEMIGOS_AUTH');
    if (cookieToken) {
      finalAuth = `Bearer ${cookieToken}`;
    }
  }
  if (finalAuth) headers['Authorization'] = finalAuth;

  // Content-Type / Accept (forward if present)
  const contentType = request.headers.get('content-type');
  if (contentType) headers['Content-Type'] = contentType;
  const accept = request.headers.get('accept');
  if (accept) headers['Accept'] = accept;
  const acceptLang = request.headers.get('accept-language');
  if (acceptLang) headers['Accept-Language'] = acceptLang;

  // Forward cookie (so backend can also read it if needed)
  if (cookieHeader) headers['Cookie'] = cookieHeader;

  // Inject server-side X-Service-Token (must be present exactly as server key)
  headers['X-Service-Token'] = SERVER_KEY as string;

  // Debug: show minimal headers being sent (mask sensitive values)
  const debugHeaders = (() => {
    if (
      process.env.NODE_ENV === 'production' &&
      process.env.DEBUG_PROXY !== 'true'
    )
      return null;
    const copy: Record<string, string> = {};
    Object.keys(headers).forEach((k) => {
      if (k.toLowerCase() === 'x-service-token') {
        const v = headers[k];
        if (v && v.length > 8) {
          copy[k] = `${v.slice(0, 4)}...${v.slice(-4)}`;
        } else {
          copy[k] = '***';
        }
      } else if (k.toLowerCase() === 'authorization') {
        const v = headers[k];
        if (v && v.startsWith('Bearer ')) {
          copy[k] = 'Bearer *****';
        } else if (v) {
          copy[k] = '*****';
        }
      } else {
        copy[k] = headers[k];
      }
    });
    return copy;
  })();

  if (debugHeaders) {
    console.log('proxy: headers summary being sent to backend:', debugHeaders);
  }

  // Prepare body
  let body: ArrayBuffer | null = null;
  if (
    request.method !== 'GET' &&
    request.method !== 'HEAD' &&
    request.method !== 'OPTIONS'
  ) {
    try {
      body = await request.arrayBuffer();
    } catch (e) {
      // ignore
    }
  }

  let resp = await fetch(target, {
    method: request.method,
    headers,
    body: body as any,
    credentials: 'include',
  });

  let respBody = await resp.arrayBuffer();

  // If backend rejected due to invalid/expired token (401/403), attempt
  // a server-side service login using SERVER_KEY to obtain a fresh token
  // and retry the original request once. This keeps token management on
  // the server and prevents exposing credentials in the client.
  let setCookieFromLogin: string | null = null;
  if ((resp.status === 401 || resp.status === 403) && SERVER_KEY) {
    try {
      const loginUrl =
        (API_URL as string).replace(/\/+$/, '') + '/api/auth/login';
      const loginResp = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceKey: SERVER_KEY }),
      });

      if (loginResp.ok) {
        const loginData = (await loginResp.json().catch(() => null)) as any;
        const token =
          (loginData &&
            (loginData.token || loginData.accessToken || loginData.payload)) ||
          null;
        const expiresIn =
          loginData && (loginData.expiresIn || loginData.expires || null);

        if (token) {
          // set cookie (HttpOnly) with reasonable defaults; secure in production
          const secure =
            process.env.NODE_ENV === 'production' ? '; Secure' : '';
          const maxAge =
            typeof expiresIn === 'number'
              ? `; Max-Age=${expiresIn}`
              : `; Max-Age=3600`;
          setCookieFromLogin =
            'APEMIGOS_AUTH=' +
            encodeURIComponent(token) +
            '; Path=/; HttpOnly; SameSite=Lax' +
            secure +
            maxAge;

          // retry original request with new bearer token
          headers['Authorization'] = 'Bearer ' + token;
          resp = await fetch(target, {
            method: request.method,
            headers,
            body: body as any,
            credentials: 'include',
          });
          respBody = await resp.arrayBuffer();
        }
      }
    } catch (e) {
      // ignore login failures — we'll return the original error to client
      console.warn('proxy: failed automatic service login', e);
    }
  }

  const resHeaders: Record<string, string> = {};
  resp.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') return;
    resHeaders[key] = value;
  });

  const isNoContentStatus =
    resp.status === 204 || resp.status === 205 || resp.status === 304;
  const hasBody = !isNoContentStatus && respBody && respBody.byteLength > 0;

  if (!hasBody) {
    delete resHeaders['content-length'];
    delete resHeaders['transfer-encoding'];
    delete resHeaders['content-type'];
  }

  const response = new NextResponse(hasBody ? Buffer.from(respBody) : null, {
    status: resp.status,
    headers: resHeaders,
  });

  const setCookie = resp.headers.get('set-cookie');
  if (setCookie) response.headers.append('Set-Cookie', setCookie);
  if (setCookieFromLogin)
    response.headers.append('Set-Cookie', setCookieFromLogin);

  // Expose a small snippet for debugging in dev only
  const debug =
    process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROXY === 'true';
  if (debug) {
    try {
      const snippet = Buffer.from(respBody).toString('utf8').slice(0, 400);
      response.headers.set(
        'x-proxy-backend-snippet',
        encodeURIComponent(snippet)
      );
      response.headers.set('x-proxy-target', target);
      response.headers.set(
        'Access-Control-Expose-Headers',
        'x-proxy-backend-snippet,x-proxy-target'
      );
    } catch (e) {
      // ignore
    }
  }

  return response;
}

export async function GET(request: Request, { params }: any) {
  await params;
  return forward(request, { path: (await params)?.path || [] });
}
export async function POST(request: Request, { params }: any) {
  await params;
  return forward(request, { path: (await params)?.path || [] });
}
export async function PUT(request: Request, { params }: any) {
  await params;
  return forward(request, { path: (await params)?.path || [] });
}
export async function PATCH(request: Request, { params }: any) {
  await params;
  return forward(request, { path: (await params)?.path || [] });
}
export async function DELETE(request: Request, { params }: any) {
  await params;
  return forward(request, { path: (await params)?.path || [] });
}
export async function OPTIONS(request: Request) {
  const corsHeaders: Record<string, string> = {};
  corsHeaders['Access-Control-Allow-Origin'] =
    request.headers.get('origin') || '*';
  corsHeaders['Access-Control-Allow-Credentials'] = 'true';
  corsHeaders['Access-Control-Allow-Methods'] =
    'GET, POST, PUT, PATCH, DELETE, OPTIONS';
  corsHeaders['Access-Control-Allow-Headers'] =
    'Authorization, Content-Type, X-Service-Token';

  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
