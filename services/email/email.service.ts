import api from '../api-service';

export type SendEmailPayload = {
  to: string;
  subject: string;
  body: string;
};

export type SendEmailResult = {
  status: number;
  data?: any;
};

export class EmailService {
  async sendEmail(payload: SendEmailPayload): Promise<SendEmailResult> {
    try {
      const response = await api.post('/api/email', payload, {
        headers: { 'Content-Type': 'application/json', Accept: '*/*' },
      });

      return { status: response.status, data: response.data };
    } catch (error: any) {
      console.error('Erro ao enviar email:', error);
      const message =
        error.response?.data ||
        error.response?.statusText ||
        error.message ||
        'Erro ao enviar email';
      throw new Error(message);
    }
  }
}

export const emailService = new EmailService();
