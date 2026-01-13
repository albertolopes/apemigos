import { NextResponse } from 'next/server';

// Rota server-side que realiza login de serviço usando a chave guardada no
// ambiente do servidor (process.env.SERVICE_KEY ou NEXT_PUBLIC_SERVICE_KEY).
// Retorna o JSON recebido do backend e seta um cookie HttpOnly com o token.

export async function POST(request: Request) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const serviceKey =
    process.env.SERVICE_KEY ||
    process.env.NEXT_PUBLIC_SERVICE_KEY ||
    /* fallback local para facilitar testes */
    'apemigos-service-key-2025-secure-version';

  if (!serviceKey) {
    return NextResponse.json(
      { message: 'SERVICE_KEY não configurada no servidor' },
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

    const safeResp = { serviceLogin: true, expiresIn: maxAge };

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
