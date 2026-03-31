import api from '../api-service';
import axios from 'axios';
import { cache } from 'react'; // Importar cache do React
import { NewsItem } from './interfaces/news-item.interface';
import { NewsResponse } from './interfaces/news-response.interface';
import { NewsContentResponse } from './interfaces/news-content.interface';

export class NewsService {
  /**
   * Busca notícias paginadas.
   * Envolvido em cache para evitar chamadas duplicadas no mesmo ciclo de request SSR.
   */
  getNews = cache(
    async (
      page: number = 0,
      size: number = 10,
      keyword?: string
    ): Promise<NewsResponse> => {
      try {
        if (keyword && String(keyword).trim()) {
          const response = await api.get('/api/noticias/search', {
            params: { page, size, keyword: String(keyword).trim() },
            headers: { Accept: 'application/json' },
          });

          return response.data;
        }

        const response = await api.get('/api/noticias', {
          params: { page, size },
          headers: { Accept: 'application/json' },
        });

        return response.data;
      } catch (error: any) {
        if (axios.isCancel(error)) {
          throw error;
        }
        console.error('Erro ao buscar notícias:', error);
        throw new Error(
          error.response?.data?.message || 'Erro ao carregar notícias'
        );
      }
    }
  );

  /**
   * Busca uma notícia específica por ID
   */
  getNewsById = cache(async (id: number): Promise<NewsItem> => {
    try {
      const response = await api.get(`/api/noticias/${id}`);
      return response.data;
    } catch (error: any) {
      if (axios.isCancel(error)) {
        throw error;
      }
      console.error(`Erro ao buscar notícia ${id}:`, error);
      throw new Error(
        error.response?.data?.message || 'Erro ao carregar notícia'
      );
    }
  });

  /**
   * Busca notícias por slug
   */
  getNewsBySlug = cache(async (slug: string): Promise<NewsItem> => {
    try {
      const response = await api.get(`/api/noticias/slug/${slug}`);
      return response.data;
    } catch (error: any) {
      if (axios.isCancel(error)) {
        throw error;
      }
      console.error(`Erro ao buscar notícia por slug ${slug}:`, error);
      throw new Error(
        error.response?.data?.message || 'Erro ao carregar notícia'
      );
    }
  });

  /**
   * Busca o conteúdo completo de uma notícia específica
   */
  getNewsContent = cache(
    async (
      newsId: string | number,
      signal?: AbortSignal
    ): Promise<NewsContentResponse> => {
      try {
        const response = await api.get(`/api/noticias/conteudo/${newsId}`, {
          headers: { Accept: 'application/json' },
          signal,
        });

        return response.data;
      } catch (error: any) {
        if (axios.isCancel(error)) {
          throw error;
        }
        console.error(`Erro ao buscar conteúdo da notícia ${newsId}:`, error);
        throw new Error(
          error.response?.data?.message ||
            'Erro ao carregar conteúdo da notícia'
        );
      }
    }
  );

  /**
   * Busca o conteúdo completo de uma notícia por slug
   */
  getNewsContentBySlug = cache(
    async (
      slug: string,
      signal?: AbortSignal
    ): Promise<NewsContentResponse> => {
      try {
        const response = await api.get(`/api/noticias/conteudo/slug/${slug}`, {
          headers: { Accept: 'application/json' },
          signal,
        });

        return response.data;
      } catch (error: any) {
        if (axios.isCancel(error)) {
          throw error;
        }
        // Silenciamos o log de erro aqui para não sujar o console do servidor em caso de metadados falharem
        throw new Error(
          error.response?.data?.message ||
            'Erro ao carregar conteúdo da notícia'
        );
      }
    }
  );
}

// Instância singleton para uso na aplicação
export const newsService = new NewsService();
