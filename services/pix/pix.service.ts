import api from '../api-service';

export type PixStaticResponse = {
  payload?: string;
  qrCodeBase64?: string;
  txid?: string;
};

export class PixService {
  async createStatic(amount?: number): Promise<PixStaticResponse> {
    try {
      const body = amount !== undefined ? { amount } : {};
      // explicit responseType to ensure axios decodes JSON
      const response = await api.post('/api/pix/static', body, {
        headers: { Accept: 'application/json' },
        responseType: 'json',
      });

      // return the backend payload as-is
      return response.data as PixStaticResponse;
    } catch (error: any) {
      // surface useful debug information
      console.error(
        'Erro ao criar PIX estático:',
        error?.response?.status,
        error?.response?.data || error.message
      );
      // rethrow so caller can decide fallback behavior
      throw error;
    }
  }
}

export const pixService = new PixService();
