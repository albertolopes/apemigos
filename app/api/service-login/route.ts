import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const isProd = process.env.NODE_ENV === 'production';

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    (!isProd ? 'http://localhost:8080' : undefined);

  const serviceKey =
    process.env.NEXT_PUBLIC_SERVICE_KEY ||
    (!isProd ? 'apemigos-service-key-2025-secure-version' : undefined);

  // determine caller origin (use incoming Origin header or sensible default)
  const incomingOrigin = request.headers.get('origin');
  const defaultLocalOrigin = 'http://localhost:3000';
  const productionDefaultOrigin = 'https://apemigos.vercel.app';
  const callerOrigin =
    incomingOrigin || (!isProd ? defaultLocalOrigin : productionDefaultOrigin);

  console.log('service-login: NODE_ENV=', process.env.NODE_ENV);
  console.log('service-login: using apiUrl=', !!apiUrl);
  console.log(
    'service-login: NEXT_PUBLIC_SERVICE_KEY presente?',
    !!process.env.NEXT_PUBLIC_SERVICE_KEY
  );
  console.log(
    'service-login: using fallback key?',
    !!(serviceKey && !process.env.NEXT_PUBLIC_SERVICE_KEY)
  );
  console.log('service-login: callerOrigin=', callerOrigin);

  if (!apiUrl) {
    return NextResponse.json(
      {
        message:
          'NEXT_PUBLIC_API_URL ou API_URL não configurada. Defina NEXT_PUBLIC_API_URL em produção (ou API_URL/localmente) e reinicie a aplicação.',
      },
      { status: 500 }
    );
  }

  if (!serviceKey) {
    return NextResponse.json(
      {
        message:
          'NEXT_PUBLIC_SERVICE_KEY não configurada. Defina a variável de ambiente NEXT_PUBLIC_SERVICE_KEY e reinicie a aplicação.',
      },
      { status: 500 }
    );
  }

  try {
    // First: if the request already includes the APEMIGOS_AUTH cookie, return it
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

    const resp = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // forward origin of caller to backend auth request
        Origin: callerOrigin,
      },
      body: JSON.stringify({
        serviceKey,
        userLogin: false,
        serviceLogin: true,
        valid: true,
      }),
    });

    const text = await resp.text();

    if (!resp.ok) {
      // tenta parsear JSON de erro
      try {
        const parsed = text
          ? JSON.parse(text)
          : { message: text || 'Erro no login de serviço' };
        return NextResponse.json(parsed, { status: resp.status });
      } catch (e) {
        return NextResponse.json(
          { message: text || 'Erro no login de serviço' },
          { status: resp.status }
        );
      }
    }

    const data = JSON.parse(text);
    const token = data.token;
    const expiresIn = data.expiresIn ?? 3600;

    if (!token) {
      return NextResponse.json(
        { message: 'Token não recebido do backend' },
        { status: 500 }
      );
    }

    const maxAge = Number.isFinite(Number(expiresIn))
      ? Number(expiresIn)
      : 3600;

    // Only set Secure flag for production (otherwise cookie won't be set over http localhost)
    const secureFlag = isProd ? '; Secure' : '';
    const cookie = `APEMIGOS_AUTH=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${secureFlag}`;

    // Determine if caller is authorized to receive token in body
    const callerAuth = request.headers.get('authorization') || '';
    const callerProvidesServiceKey =
      callerAuth.trim() === `Bearer ${process.env.NEXT_PUBLIC_SERVICE_KEY}`;

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
      { message: err.message || 'Erro interno' },
      { status: 500 }
    );
  }
}
