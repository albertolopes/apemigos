import api from '../api-service';
import { ProjectItem } from './interfaces/project-item.interface';
import { ProjectResponse } from './interfaces/project-response.interface';

export class ProjectsService {
  /**
   * Busca projetos paginados
   */
  async getProjects(
    page: number = 0,
    size: number = 10
  ): Promise<ProjectResponse> {
    try {
      const response = await api.get('/api/projetos', {
        params: { page, size },
        headers: { Accept: 'application/json' },
      });

      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar projetos:', error);
      throw new Error(
        error.response?.data?.message || 'Erro ao carregar projetos'
      );
    }
  }

  /**
   * Busca um projeto específico por ID
   */
  async getProjectById(id: number): Promise<ProjectItem> {
    try {
      const response = await api.get(`/api/projetos/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao buscar projeto ${id}:`, error);
      throw new Error(
        error.response?.data?.message || 'Erro ao carregar projeto'
      );
    }
  }

  /**
   * Busca um projeto por slug
   */
  async getProjectBySlug(slug: string): Promise<ProjectItem> {
    try {
      const response = await api.get(`/api/projetos/slug/${slug}`);
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao buscar projeto por slug ${slug}:`, error);
      throw new Error(
        error.response?.data?.message || 'Erro ao carregar projeto'
      );
    }
  }
}

export const projectsService = new ProjectsService();
