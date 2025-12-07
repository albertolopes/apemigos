'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LongDescription } from './LongDescription';
import { newsService, NewsContentResponse } from '@services';

export default function New({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [item, setItem] = useState<NewsContentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        // Busca o conteúdo usando slug via endpoint /conteudo/slug/{slug}
        const response: NewsContentResponse =
          await newsService.getNewsContentBySlug(slug);

        setItem(response);
      } catch (err) {
        console.error('Erro ao carregar notícia:', err);
        setError('Erro ao carregar a notícia. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [slug, router]);

  if (isLoading) {
    return (
      <div className="text-center py-20 text-slate-500">
        Carregando notícia...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">⚠️ {error}</div>;
  }

  if (!item) {
    return (
      <div className="text-center py-20 text-slate-500">
        Notícia não encontrada.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="w-full h-[400px] relative">
        <img
          src={item.noticia.image}
          alt={item.noticia.title}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      </div>
      <div className="max-w-7xl mx-auto mt-[-120px] relative bg-white px-8 sm:px-20">
        <h1 className="text-center py-8 font-site">{item.noticia.title}</h1>
        <p className="text-slate-500 py-6 max-w-3xl text-lg mx-auto text-center">
          {item.noticia.shortDescription}
        </p>
        <div className="relative h-[400px]">
          <img
            src={item.noticia.image}
            alt={item.noticia.title}
            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
          />
        </div>
        <LongDescription html={item.longDescription} />
      </div>
    </div>
  );
}
