import { Metadata } from 'next';
import { newsService, NewsContentResponse } from '@services';

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Evita buscar metadados se o slug for claramente inválido ou placeholder
  if (!slug || slug === 'undefined' || slug.includes('favicon')) {
    return { title: 'Notícia | Apemigos' };
  }

  try {
    const item: NewsContentResponse = await newsService.getNewsContentBySlug(
      slug
    );

    if (!item || !item.noticia) {
      return {
        title: 'Notícia | Apemigos',
      };
    }

    const title = `${item.noticia.title} | Apemigos`;
    const description = item.noticia.shortDescription;
    const imageUrl =
      item.noticia.image || 'https://apemigosbrasil.org.br/images/logo.png';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        url: `https://apemigosbrasil.org.br/news/${slug}`,
        images: [
          {
            url: imageUrl,
            alt: item.noticia.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (err) {
    // Silencia o erro no log para slugs não encontrados durante a geração de metadados
    return {
      title: 'Notícias | Apemigos',
    };
  }
}

export default function NewsDetailsLayout({ children }: Props) {
  return <>{children}</>;
}
