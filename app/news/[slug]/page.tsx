import Image from 'next/image';
import { LongDescription } from './LongDescription';
import { newsService, NewsContentResponse } from '@services';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

async function getNewsData(slug: string) {
  try {
    const response: NewsContentResponse =
      await newsService.getNewsContentBySlug(slug);
    return response;
  } catch (err) {
    console.error('Erro ao carregar notícia no servidor:', err);
    return null;
  }
}

export default async function New({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getNewsData(slug);

  if (!item) {
    notFound();
  }

  return (
    <div className="relative">
      <div className="w-full h-[400px] relative">
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
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            Sem imagem
          </div>
        )}
      </div>
      <div className="max-w-7xl mx-auto mt-[-120px] relative bg-white px-8 sm:px-20">
        <h1 className="text-center py-8 font-site text-3xl md:text-4xl text-orange-500 leading-tight">
          {item.noticia.title}
        </h1>
        <p className="text-slate-500 py-6 max-w-3xl text-lg mx-auto text-center font-medium">
          {item.noticia.shortDescription}
        </p>
        <LongDescription html={item.longDescription} />
      </div>
    </div>
  );
}
