import { Evento } from '@services';

export function getEventoTitulo(evento: Evento) {
  return evento.titulo || evento.title || 'Evento';
}

export function getEventoDescricao(evento: Evento) {
  return evento.descricao || evento.description || '';
}

export function getEventoResumo(evento: Evento) {
  return (
    evento.descricaoResumida ||
    evento.shortDescription ||
    evento.resumo ||
    getEventoDescricao(evento)
  );
}

export function getEventoImagem(evento: Evento) {
  return (
    evento.imagem || evento.image || evento.cover || '/images/placeholder.jpg'
  );
}

export function getEventoLocal(evento: Evento) {
  return evento.local || evento.location || 'Local a confirmar';
}

export function getEventoDataPrincipal(evento: Evento) {
  return evento.dataEvento || evento.dataInicio || '';
}

export function formatDateTime(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function summarize(text: string, maxLength = 160) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

export function sortByOrder<T extends { ordem?: number; label?: string }>(
  items: T[] = []
) {
  return [...items].sort((a, b) => {
    const orderA = a.ordem ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.ordem ?? Number.MAX_SAFE_INTEGER;

    if (orderA !== orderB) return orderA - orderB;
    return String(a.label || '').localeCompare(String(b.label || ''));
  });
}
