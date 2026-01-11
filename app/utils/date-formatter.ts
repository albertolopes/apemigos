const LOCALE = 'pt-BR';

export function formatDate(date: Date): string {
  return Intl.DateTimeFormat(LOCALE, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}
