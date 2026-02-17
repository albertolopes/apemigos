import axios from 'axios';
import { authService } from './auth-service';

const api = axios.create({
  baseURL: '/api/proxy',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

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
    const serviceKey = process.env.NEXT_PUBLIC_SERVICE_KEY;
    if (serviceKey) {
      if (!config.headers) config.headers = {} as any;
      config.headers['X-Service-Token'] = serviceKey;
    }

    if (config.url?.includes('/api/auth/login')) {
      return config;
    }

    try {
      const token = await authService.getValidToken();

      if (token) {
        if (!config.headers) config.headers = {} as any;
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // A falha na obtenção do token já é tratada no authService
      // A requisição prosseguirá sem o token de autorização
    }

    if (
      config.data &&
      typeof FormData !== 'undefined' &&
      config.data instanceof FormData
    ) {
      if (config.headers) {
        delete config.headers['Content-Type'];
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
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Trata 401 (Unauthorized) e 403 (Forbidden) como possíveis tokens expirados
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      if (isRefreshing) {
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
        const newToken = await authService.refreshToken();
        processQueue(null, newToken);
        
        // Atualiza o header com o novo token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Retenta a requisição original
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        authService.logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
