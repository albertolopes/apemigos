import axios from 'axios';
import { getPublicEnv } from '../app/utils/env';
// Evita import circular com api-service.ts usando axios direto
// Tenta usar a variável direta NEXT_PUBLIC_API_URL (definida no Render), com fallback para getPublicEnv e localhost
const DEFAULT_BASE_URL = 'http://localhost:8080';
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (getPublicEnv('API_URL', DEFAULT_BASE_URL) as string) ||
  DEFAULT_BASE_URL;

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
  // Chaves e nomes de storage agora vêm de variáveis de ambiente (ver README/.env.local)
  // Usa process.env.NEXT_PUBLIC_* primariamente (para compatibilidade com Render),
  // e getPublicEnv como fallback.
  private readonly STORAGE_KEY =
    process.env.NEXT_PUBLIC_SERVICE_STORAGE_KEY ??
    (getPublicEnv('SERVICE_STORAGE_KEY') as string) ??
    'service_token';

  private readonly TOKEN_EXPIRY_KEY =
    process.env.NEXT_PUBLIC_TOKEN_EXPIRY_KEY ??
    (getPublicEnv('TOKEN_EXPIRY_KEY') as string) ??
    'token_expiry';

  private readonly SERVICE_KEY =
    process.env.NEXT_PUBLIC_SERVICE_KEY ??
    (getPublicEnv('SERVICE_KEY') as string) ??
    'apemigos-service-key-2025-secure-version';

  /**
   * Verifica se o token existe e não expirou
   */
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

  /**
   * Gera um novo token de serviço
   */
  private async generateServiceToken(): Promise<string> {
    try {
      const credentials: ServiceLoginRequest = {
        serviceKey: this.SERVICE_KEY,
        userLogin: false,
        serviceLogin: true,
        valid: true,
      };

      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          timeout: 15000,
        }
      );

      const loginData: LoginResponse = response.data;

      if (!loginData.token) {
        throw new Error('Token não recebido na resposta');
      }

      // Salva token e tempo de expiração
      this.saveToken(loginData.token, loginData.expiresIn);

      return loginData.token;
    } catch (error: any) {
      const authError: AuthError = {
        message:
          error.response?.data?.message || 'Erro ao gerar token de serviço',
        status: error.response?.status || 500,
        code: error.response?.data?.code,
      };

      console.error('Erro na geração do token:', authError);
      throw authError;
    }
  }

  /**
   * Salva token e tempo de expiração no storage
   */
  private saveToken(token: string, expiresIn?: number): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, token);

        // Calcula o timestamp de expiração (padrão: 1 hora se não informado)
        const defaultExpiry = 60 * 60 * 1000; // 1 hora em ms
        const expiryTime =
          Date.now() + (expiresIn ? expiresIn * 1000 : defaultExpiry);

        localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());

        console.log(
          'Token salvo. Expira em:',
          new Date(expiryTime).toLocaleString()
        );
      } catch (storageError) {
        console.error('Erro ao salvar token no storage:', storageError);
      }
    }
  }

  async getValidToken(): Promise<string> {
    // Se o token atual é válido, retorna ele
    if (this.isTokenValid()) {
      const currentToken = localStorage.getItem(this.STORAGE_KEY);
      console.log('Token atual ainda válido');
      return currentToken!;
    }

    console.log('Token expirado ou não encontrado. Gerando novo...');

    // Gera novo token
    const newToken = await this.generateServiceToken();
    return newToken;
  }

  async refreshToken(): Promise<string> {
    console.log('Forçando renovação do token...');
    return await this.generateServiceToken();
  }

  /**
   * Remove token do storage
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
      console.log('Token removido do storage');
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
