import { MetadataRoute } from 'next';
import { newsService } from '@services';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://apemigosbrasil.org.br';

    const staticRoutes = [
        '',
        '/news',
        '/projects',
        '/sobre-nos',
        '/contato',
        '/doe',
        '/associados/cadastro',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 1.0,
    }));

    // Notícias dinâmicas
    let newsRoutes: MetadataRoute.Sitemap = [];
    try {
        const newsResponse = await newsService.getNews(0, 100);
        newsRoutes = newsResponse.content.map((item) => ({
            url: `${baseUrl}/news/${item.slug || item.id}`,
            lastModified: new Date(item.date),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }));
    } catch (error) {
        console.error('Falha ao gerar sitemap para notícias:', error);
    }
    return [...staticRoutes, ...newsRoutes];
}
