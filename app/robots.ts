import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Protege áreas sensíveis
    },
    sitemap: 'https://apemigosbrasil.org.br/sitemap.xml',
  };
}
