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

async function forward(request: Request, params: { path: string[] }) {
  const envErr = validateEnv();
  if (envErr) return envErr;

  const path = params.path ? params.path.join('/') : '';
  const incomingUrl = new URL(request.url);
  const search = incomingUrl.search || '';
  const target = `${(API_URL as string).replace(/\/+$/, '')}/${path}${search}`;

  // Validate origin
  const incomingOrigin = request.headers.get('origin') || '';
  if (incomingOrigin && !ALLOWED_ORIGINS.includes(incomingOrigin)) {
    console.warn(
      'proxy: rejected request from disallowed origin',
      incomingOrigin
    );
    return NextResponse.json(
      { message: 'Origin not allowed' },
      { status: 403 }
    );
  }

  const headers: Record<string, string> = {};

  // Origin: forward the client origin exactly when present, otherwise use API origin
  headers['Origin'] = incomingOrigin || API_ORIGIN;

  // Authorization: forward if present
  const authorization = request.headers.get('authorization');
  if (authorization) headers['Authorization'] = authorization;

  // Content-Type / Accept (forward if present)
  const contentType = request.headers.get('content-type');
  if (contentType) headers['Content-Type'] = contentType;
  const accept = request.headers.get('accept');
  if (accept) headers['Accept'] = accept;
  const acceptLang = request.headers.get('accept-language');
  if (acceptLang) headers['Accept-Language'] = acceptLang;

  // Cookie: forward if present (allows session auth if backend expects cookies)
  const cookie = request.headers.get('cookie');
  if (cookie) headers['Cookie'] = cookie;

  // Inject server-side X-Service-Token (must be present exactly as server key)
  headers['X-Service-Token'] = SERVER_KEY as string;

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

  const resp = await fetch(target, {
    method: request.method,
    headers,
    body: body as any,
    credentials: 'include',
  });

  const respBody = await resp.arrayBuffer();

  const resHeaders: Record<string, string> = {};
  resp.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') return;
    resHeaders[key] = value;
  });

  const response = new NextResponse(Buffer.from(respBody), {
    status: resp.status,
    headers: resHeaders,
  });

  const setCookie = resp.headers.get('set-cookie');
  if (setCookie) response.headers.set('Set-Cookie', setCookie);

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
  const resolved = await params;
  return forward(request, { path: resolved?.path || [] });
}
export async function POST(request: Request, { params }: any) {
  const resolved = await params;
  return forward(request, { path: resolved?.path || [] });
}
export async function PUT(request: Request, { params }: any) {
  const resolved = await params;
  return forward(request, { path: resolved?.path || [] });
}
export async function PATCH(request: Request, { params }: any) {
  const resolved = await params;
  return forward(request, { path: resolved?.path || [] });
}
export async function DELETE(request: Request, { params }: any) {
  const resolved = await params;
  return forward(request, { path: resolved?.path || [] });
}
export async function OPTIONS(request: Request, { params }: any) {
  const resolved = await params;
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
