import api from '../api-service';
import axios from 'axios'; // Importa o módulo principal do axios
import { NewsItem } from './interfaces/news-item.interface';
import { NewsResponse } from './interfaces/news-response.interface';
import { NewsContentResponse } from './interfaces/news-content.interface';

export class NewsService {
  /**
   * Busca notícias paginadas. Se `keyword` for fornecido, usa o endpoint
   * /api/noticias/search?keyword=... (backend espera keyword opcional).
   */
  async getNews(
    page: number = 0,
    size: number = 10,
    keyword?: string
  ): Promise<NewsResponse> {
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
        // Não loga como erro, pois é uma operação normal
        throw error;
      }
      console.error('Erro ao buscar notícias:', error);
      throw new Error(
        error.response?.data?.message || 'Erro ao carregar notícias'
      );
    }
  }

  /**
   * Busca uma notícia específica por ID
   */
  async getNewsById(id: number): Promise<NewsItem> {
    try {
      const response = await api.get(`/api/noticias/${id}`);
      return response.data;
    } catch (error: any) {
      if (axios.isCancel(error)) {
        // Não loga como erro
        throw error;
      }
      console.error(`Erro ao buscar notícia ${id}:`, error);
      throw new Error(
        error.response?.data?.message || 'Erro ao carregar notícia'
      );
    }
  }

  /**
   * Busca notícias por slug
   */
  async getNewsBySlug(slug: string): Promise<NewsItem> {
    try {
      const response = await api.get(`/api/noticias/slug/${slug}`);
      return response.data;
    } catch (error: any) {
      if (axios.isCancel(error)) {
        // Não loga como erro
        throw error;
      }
      console.error(`Erro ao buscar notícia por slug ${slug}:`, error);
      throw new Error(
        error.response?.data?.message || 'Erro ao carregar notícia'
      );
    }
  }

  /**
   * Busca o conteúdo completo de uma notícia específica
   */
  async getNewsContent(
    newsId: string | number,
    signal?: AbortSignal
  ): Promise<NewsContentResponse> {
    try {
      const response = await api.get(`/api/noticias/conteudo/${newsId}`, {
        headers: { Accept: 'application/json' },
        signal,
      });

      return response.data;
    } catch (error: any) {
      if (axios.isCancel(error)) {
        // Não loga como erro
        throw error;
      }
      console.error(`Erro ao buscar conteúdo da notícia ${newsId}:`, error);
      throw new Error(
        error.response?.data?.message || 'Erro ao carregar conteúdo da notícia'
      );
    }
  }

  /**
   * Busca o conteúdo completo de uma notícia por slug
   */
  async getNewsContentBySlug(
    slug: string,
    signal?: AbortSignal
  ): Promise<NewsContentResponse> {
    try {
      const response = await api.get(`/api/noticias/conteudo/slug/${slug}`, {
        headers: { Accept: 'application/json' },
        signal,
      });

      return response.data;
    } catch (error: any) {
      if (axios.isCancel(error)) {
        // Não loga como erro, pois é uma operação normal
        throw error;
      }
      throw new Error(
        error.response?.data?.message || 'Erro ao carregar conteúdo da notícia'
      );
    }
  }
}

// Instância singleton para uso na aplicação
export const newsService = new NewsService();
