import api from '../api-service';

export type AssociadoCreateResult = {
  status: number;
  data?: any;
};

export class AssociadosService {
  /**
   * Cria um novo associado enviando multipart/form-data
   */
  async createAssociado(formData: FormData): Promise<AssociadoCreateResult> {
    try {
      const response = await api.post('/api/associados', formData, {
        headers: {
          Accept: 'application/json',
          // Content-Type intentionally omitted for FormData so browser sets boundary
        },
        timeout: 120000,
      });

      return { status: response.status, data: response.data };
    } catch (error: any) {
      console.error('Erro ao criar associado:', error);
      const message =
        error.response?.data || error.response?.statusText || error.message ||
        'Erro ao criar associado';
      throw new Error(message);
    }
  }
}

export const associadosService = new AssociadosService();
