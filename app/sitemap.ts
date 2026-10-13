import { MetadataRoute } from 'next';
import { Evento, eventosService, NewsItem, newsService } from '@services';

export const revalidate = 3600;

const baseUrl = 'https://apemigosbrasil.org.br';
const newsPageSize = 100;

function getValidDate(...values: Array<string | undefined>) {
  for (const value of values) {
    if (!value) continue;

    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  return undefined;
}

async function getAllNews() {
  const firstPage = await newsService.getNews(0, newsPageSize);
  const items: NewsItem[] = [...firstPage.content];

  for (let page = 1; page < firstPage.totalPages; page++) {
    const response = await newsService.getNews(page, newsPageSize);
    items.push(...response.content);
  }

  return items;
}

async function getAllEventos() {
  const firstPage = await eventosService.getEventos(0, newsPageSize);
  const items: Evento[] = [...firstPage.content];

  for (let page = 1; page < firstPage.totalPages; page++) {
    const response = await eventosService.getEventos(page, newsPageSize);
    items.push(...response.content);
  }

  return items;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    {
      url: baseUrl,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/doe`,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/alto-custo`,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    },
  ];

  let newsRoutes: MetadataRoute.Sitemap = [];
  let eventRoutes: MetadataRoute.Sitemap = [];

  try {
    const news = await getAllNews();

    newsRoutes = news
      .filter((item) => item.slug)
      .map((item) => ({
        url: `${baseUrl}/news/${encodeURIComponent(item.slug)}`,
        lastModified: getValidDate(item.updatedAt, item.createdAt, item.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
  } catch (error) {
    console.error('Falha ao gerar sitemap para notícias:', error);
  }

  try {
    const eventos = await getAllEventos();

    eventRoutes = eventos
      .filter((item) => item.slug)
      .map((item) => ({
        url: `${baseUrl}/eventos/${encodeURIComponent(item.slug || '')}`,
        lastModified: getValidDate(item.dataInicio, item.dataEvento),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
  } catch (error) {
    console.error('Falha ao gerar sitemap para eventos:', error);
  }

  return [...staticRoutes, ...newsRoutes, ...eventRoutes];
}
