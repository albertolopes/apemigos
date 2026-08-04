import Image from 'next/image';
import { LongDescription } from './LongDescription';
import { newsService } from '@services';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

const baseUrl = 'https://apemigosbrasil.org.br';
const fallbackImageUrl = `${baseUrl}/images/logo.png`;

export default async function New({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // No servidor, o cache() unifica esta chamada com a do layout (generateMetadata)
  const item = await newsService.getNewsContentBySlug(slug).catch(() => null);

  if (!item || !item.noticia) {
    notFound();
  }

  const newsUrl = `${baseUrl}/news/${slug}`;
  const imageUrl = item.noticia.image || fallbackImageUrl;

  // Esquema de Dados Estruturados (JSON-LD) para o Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': newsUrl,
    },
    url: newsUrl,
    headline: item.noticia.title,
    image: [imageUrl],
    datePublished: item.noticia.date,
    dateModified: item.noticia.updatedAt || item.noticia.date,
    author: [
      {
        '@type': 'Organization',
        name: 'Apemigos Brasil',
        url: 'https://apemigosbrasil.org.br',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Apemigos Brasil',
      logo: {
        '@type': 'ImageObject',
        url: fallbackImageUrl,
      },
    },
    description: item.noticia.shortDescription,
  };

  return (
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="w-full h-[400px] relative bg-gray-100">
        {item.noticia.image ? (
          <Image
            src={item.noticia.image}
            alt={item.noticia.title}
            fill
            style={{ objectFit: 'cover' }}
            unoptimized
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            Sem imagem
          </div>
        )}
      </div>
      <div className="max-w-7xl mx-auto mt-[-120px] relative bg-white px-8 sm:px-20 pb-20 rounded-t-3xl shadow-sm">
        <article className="pt-12">
          <h1 className="text-center py-6 font-site text-2xl md:text-4xl text-orange-600 leading-tight">
            {item.noticia.title}
          </h1>

          <p className="text-slate-600 py-4 max-w-3xl text-base md:text-lg mx-auto text-center font-normal leading-relaxed border-b border-slate-100 mb-6">
            {item.noticia.shortDescription}
          </p>

          <LongDescription html={item.longDescription} />
        </article>
      </div>
    </div>
  );
}
