import { getPublicEnv } from '../app/utils/env';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || (getPublicEnv('API_URL') as string);

if (!BASE_URL && process.env.NODE_ENV !== 'production') {
  console.warn(
    'AuthService: API base URL not configured (NEXT_PUBLIC_API_URL / API_URL)'
  );
}

export interface ServiceLoginRequest {
  serviceKey: string;
  userLogin?: boolean;
  serviceLogin?: boolean;
  valid?: boolean;
}

export interface LoginResponse {
  token: string;
  expiresIn?: number;
  type: 'user' | 'service';
}

export interface AuthError {
  message: string;
  status: number;
  code?: string;
}

export class AuthService {
  private readonly STORAGE_KEY =
    process.env.NEXT_PUBLIC_SERVICE_STORAGE_KEY ??
    (getPublicEnv('SERVICE_STORAGE_KEY') as string) ??
    'service_token';

  private readonly TOKEN_EXPIRY_KEY =
    process.env.NEXT_PUBLIC_TOKEN_EXPIRY_KEY ??
    (getPublicEnv('TOKEN_EXPIRY_KEY') as string) ??
    'token_expiry';

  private readonly SERVICE_KEY =
    process.env.SERVICE_KEY ??
    process.env.NEXT_PUBLIC_SERVICE_KEY ??
    (getPublicEnv('SERVICE_KEY') as string) ??
    'apemigos-service-key-2025-secure-version';

  private isTokenValid(): boolean {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem(this.STORAGE_KEY);
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);

    if (!token || !expiry) {
      return false;
    }

    const now = Date.now();
    const expiryTime = parseInt(expiry, 10);
    const withMargin = expiryTime - 5 * 60 * 1000;

    return now < withMargin;
  }

  private getTokenFromCookie(): string | null {
    try {
      if (typeof document === 'undefined' || !document.cookie) return null;
      const match = document.cookie.match(/APEMIGOS_AUTH=([^;\s]+)/);
      if (match && match[1]) return decodeURIComponent(match[1]);
      return null;
    } catch (e) {
      console.warn('Erro lendo cookie APEMIGOS_AUTH:', e);
      return null;
    }
  }

  private async generateServiceToken(): Promise<string> {
    try {
      const isServer = typeof window === 'undefined';
      const loginUrl = isServer
        ? `${BASE_URL.replace(/\/+$/, '')}/api/auth/login`
        : '/api/service-login';

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

      if (isServer) {
        // No servidor, é importante enviar um Origin válido se o backend possuir restrições de CORS
        // Também enviamos a SERVICE_KEY no header X-Service-Token para autenticação server-to-server
        const origin =
          process.env.NEXT_ALLOWED_ORIGINS?.split(',')[0] ||
          'https://apemigosbrasil.org.br';
        headers['Origin'] = origin;

        if (process.env.SERVICE_KEY) {
          headers['X-Service-Token'] = process.env.SERVICE_KEY;
        }
      }

      const res = await fetch(loginUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ serviceKey: this.SERVICE_KEY }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Erro ao autenticar serviço: ${res.status} ${txt}`);
      }

      const loginData: LoginResponse = await res.json();

      if (!loginData.token) {
        // Tenta recuperar do cookie como fallback
        const cookieToken = this.getTokenFromCookie();
        if (cookieToken) {
          this.saveToken(cookieToken, undefined);
          return cookieToken;
        }
        throw new Error(
          'Token não recebido na resposta nem encontrado no cookie'
        );
      }

      this.saveToken(loginData.token, loginData.expiresIn);

      return loginData.token;
    } catch (error: any) {
      const authError: AuthError = {
        message:
          error.response?.data?.message ||
          error.message ||
          'Erro ao gerar token de serviço',
        status: error.response?.status || 500,
        code: error.response?.data?.code,
      };
      throw authError;
    }
  }

  private saveToken(token: string, expiresIn?: number): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, token);

        const defaultExpiry = 60 * 60 * 1000;
        const expiryTime =
          Date.now() + (expiresIn ? expiresIn * 1000 : defaultExpiry);

        localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
      } catch (storageError) {
        console.error('Erro ao salvar token no storage:', storageError);
      }
    }
  }

  async getValidToken(): Promise<string> {
    if (this.isTokenValid()) {
      const currentToken = localStorage.getItem(this.STORAGE_KEY);
      return currentToken!;
    }

    try {
      const cookieToken = this.getTokenFromCookie();
      if (cookieToken) {
        if (typeof window !== 'undefined') {
          this.saveToken(cookieToken, undefined);
        }
        return cookieToken;
      }
    } catch (e) {}

    return await this.generateServiceToken();
  }

  async refreshToken(): Promise<string> {
    return await this.generateServiceToken();
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    }
  }

  getTokenStatus(): { isValid: boolean; expiresAt?: Date; hasToken: boolean } {
    if (typeof window === 'undefined') {
      return { isValid: false, hasToken: false };
    }

    const token = localStorage.getItem(this.STORAGE_KEY);
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);

    if (!token) {
      return { isValid: false, hasToken: false };
    }

    const isValid = this.isTokenValid();
    const expiresAt = expiry ? new Date(parseInt(expiry, 10)) : undefined;

    return { isValid, expiresAt, hasToken: true };
  }
}

export const authService = new AuthService();
