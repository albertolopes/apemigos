import api from '../api-service';
import {
  CriarInscricaoPayload,
  FormularioEvento,
  InscricaoEvento,
} from './interfaces/formulario-evento.interface';
import { Evento, EventosResponse } from './interfaces/evento.interface';

function extractErrorMessage(data: any, fallback: string) {
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (data.message) return data.message;
  if (data.error) return data.error;

  if (Array.isArray(data.errors)) {
    return data.errors
      .map((item: any) => {
        if (typeof item === 'string') return item;
        return item.message || item.defaultMessage || JSON.stringify(item);
      })
      .join('\n');
  }

  return fallback;
}

export class EventosService {
  async getEventos(
    page: number = 0,
    size: number = 10
  ): Promise<EventosResponse> {
    try {
      const response = await api.get('/api/public/eventos', {
        params: { page, size },
        headers: { Accept: 'application/json' },
      });

      if (Array.isArray(response.data)) {
        return {
          content: response.data,
          totalElements: response.data.length,
          totalPages: 1,
          number: page,
          size,
          empty: response.data.length === 0,
        };
      }

      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar eventos:', error);
      throw new Error(
        extractErrorMessage(error.response?.data, 'Erro ao carregar eventos')
      );
    }
  }

  async getEvento(identifier: string | number): Promise<Evento> {
    try {
      const response = await api.get(`/api/public/eventos/${identifier}`);
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao buscar evento ${identifier}:`, error);
      throw new Error(
        extractErrorMessage(error.response?.data, 'Evento não encontrado')
      );
    }
  }

  async getEventoById(id: string | number): Promise<Evento> {
    return this.getEvento(id);
  }

  async getEventoBySlug(slug: string): Promise<Evento> {
    try {
      const response = await api.get(`/api/public/eventos/slug/${slug}`);
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao buscar evento por slug ${slug}:`, error);
      throw new Error(
        extractErrorMessage(error.response?.data, 'Evento não encontrado')
      );
    }
  }

  async getFormulario(identifier: string | number): Promise<FormularioEvento> {
    try {
      const response = await api.get(
        `/api/public/eventos/${identifier}/formulario`
      );
      return response.data;
    } catch (error: any) {
      console.error(
        `Erro ao buscar formulário do evento ${identifier}:`,
        error
      );
      throw new Error(
        extractErrorMessage(error.response?.data, 'Erro ao carregar formulário')
      );
    }
  }

  async getFormularioBySlug(slug: string): Promise<FormularioEvento> {
    try {
      const response = await api.get(
        `/api/public/eventos/slug/${slug}/formulario`
      );
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao buscar formulário do evento ${slug}:`, error);
      throw new Error(
        extractErrorMessage(error.response?.data, 'Erro ao carregar formulário')
      );
    }
  }

  async criarInscricao(
    identifier: string | number,
    payload: CriarInscricaoPayload
  ): Promise<InscricaoEvento> {
    try {
      const response = await api.post(
        `/api/public/eventos/${identifier}/inscricoes`,
        payload
      );
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao criar inscrição no evento ${identifier}:`, error);
      throw new Error(
        extractErrorMessage(error.response?.data, 'Erro ao realizar inscrição')
      );
    }
  }
}

export const eventosService = new EventosService();
