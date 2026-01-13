import { NextResponse } from 'next/server';

// Rota server-side que realiza login de serviço usando a chave guardada no
// ambiente do servidor (NEXT_PUBLIC_SERVICE_KEY) e API apontada por
// NEXT_PUBLIC_API_URL. Não usar fallbacks para produção.

export async function POST(request: Request) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const serviceKey = process.env.NEXT_PUBLIC_SERVICE_KEY;

  // Logs booleanos para confirmar presença das vars sem expor valores
  console.log('service-login: NEXT_PUBLIC_API_URL presente?', !!apiUrl);
  console.log('service-login: NEXT_PUBLIC_SERVICE_KEY presente?', !!serviceKey);

  if (!apiUrl) {
    return NextResponse.json(
      { message: 'NEXT_PUBLIC_API_URL não configurada no servidor' },
      { status: 500 }
    );
  }

  if (!serviceKey) {
    return NextResponse.json(
      { message: 'NEXT_PUBLIC_SERVICE_KEY não configurada no servidor' },
      { status: 500 }
    );
  }

  try {
    const resp = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
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

    const cookie = `APEMIGOS_AUTH=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}; Secure`;

    // Determine if caller is authorized to receive token in body
    const callerAuth =
      request.headers.get('authorization') ||
      request.headers.get('Authorization') ||
      '';
    const callerProvidesServiceKey =
      callerAuth.trim() === `Bearer ${serviceKey}`;

    const safeResp: any = { serviceLogin: true, expiresIn: maxAge };
    if (callerProvidesServiceKey) {
      safeResp.token = token;
    }

    return NextResponse.json(safeResp, {
      status: 200,
      headers: {
        'Set-Cookie': cookie,
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
