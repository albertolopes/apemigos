import api from '../api-service';
import { NewsItem } from './interfaces/news-item.interface';
import { NewsResponse } from './interfaces/news-response.interface';
import { NewsContentResponse } from './interfaces/news-content.interface';

export class NewsService {
  /**
   * Busca notícias paginadas
   */
  async getNews(page: number = 0, size: number = 10): Promise<NewsResponse> {
    try {
      const response = await api.get('/api/noticias', {
        params: { page, size },
        headers: { Accept: 'application/json' },
      });

      return response.data;
    } catch (error: any) {
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
      console.error(`Erro ao buscar notícia por slug ${slug}:`, error);
      throw new Error(
        error.response?.data?.message || 'Erro ao carregar notícia'
      );
    }
  }

  /**
   * Busca o conteúdo completo de uma notícia específica
   */
  async getNewsContent(newsId: number): Promise<NewsContentResponse> {
    try {
      const response = await api.get(`/api/noticias/conteudo/${newsId}`, {
        headers: { Accept: 'application/json' },
      });

      return response.data;
    } catch (error: any) {
      console.error(`Erro ao buscar conteúdo da notícia ${newsId}:`, error);
      throw new Error(
        error.response?.data?.message || 'Erro ao carregar conteúdo da notícia'
      );
    }
  }
}

// Instância singleton para uso na aplicação
export const newsService = new NewsService();
