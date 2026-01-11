import axios from 'axios';
import { authService } from './auth-service';
import { getPublicEnv } from '../app/utils/env';

const api = axios.create({
  baseURL: getPublicEnv('API_URL', 'http://localhost:8080'),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Flag para evitar loops de requisição
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  async (config) => {
    // Não tenta adicionar token para a rota de login para evitar loop
    if (config.url?.includes('/api/auth/login')) {
      return config;
    }

    try {
      // Obtém token válido (renova automaticamente se expirado)
      const token = await authService.getValidToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Token adicionado à requisição:', config.url);
      }
    } catch (error) {
      console.error('❌ Erro ao obter token para requisição:', error);
      // Não quebra a requisição, apenas segue sem token
      // A API retornará 401 se o endpoint exigir autenticação
    }

    // Se o body for FormData, remover Content-Type para que o browser
    // ou axios definam o header 'multipart/form-data; boundary=...'
    if (
      config.data &&
      typeof FormData !== 'undefined' &&
      config.data instanceof FormData
    ) {
      if (config.headers) {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ Resposta recebida:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error('❌ Erro na resposta:', {
      url: originalRequest?.url,
      status: error.response?.status,
      message: error.message,
    });

    // Se for erro 401 (Unauthorized) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Se já está refrescando, adiciona à fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('🔄 Token expirado/inválido. Tentando renovar...');

        // Tenta gerar um novo token
        const newToken = await authService.refreshToken();

        // Processa a fila de requisições pendentes
        processQueue(null, newToken);

        // Retry da requisição original com novo token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('❌ Falha ao renovar token:', refreshError);

        // Processa a fila com erro
        processQueue(refreshError, null);

        // Limpa o token inválido do storage
        authService.logout();

        // Não redireciona automaticamente para login pois é token de serviço
        // A aplicação pode decidir o que fazer (mostrar erro, tentar novamente, etc.)
        console.log('🔒 Token de serviço inválido - necessário intervenção');
      } finally {
        isRefreshing = false;
      }
    }

    // Outros erros (403, 404, 500, etc.)
    if (error.response?.status >= 500) {
      console.error('🚨 Erro do servidor:', error.response.status);
    }

    return Promise.reject(error);
  }
);

export default api;
