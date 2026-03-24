'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LongDescription } from './LongDescription';
import { newsService, NewsContentResponse } from '@services';
import axios from 'axios';

export default function New({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [item, setItem] = useState<NewsContentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const response: NewsContentResponse =
          await newsService.getNewsContentBySlug(slug, controller.signal);

        setItem(response);
      } catch (err) {
        if (axios.isCancel(err)) {
          // A requisição foi cancelada, não é um erro real
          return;
        }
        console.error('Erro ao carregar notícia:', err);
        setError('Erro ao carregar a notícia. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    // Função de limpeza que será chamada quando o componente for desmontado
    // ou antes de o efeito ser executado novamente.
    return () => {
      controller.abort();
    };
  }, [slug, router]);

  if (isLoading) {
    return (
      <div className="text-center py-20 text-slate-600">
        Carregando notícia...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">⚠️ {error}</div>;
  }

  if (!item) {
    return (
      <div className="text-center py-20 text-slate-600">
        Notícia não encontrada.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="w-full h-[400px] relative">
        <Image
          src={item.noticia.image}
          alt={item.noticia.title}
          fill
          style={{ objectFit: 'cover' }}
          unoptimized
        />
      </div>
      <div className="max-w-7xl mx-auto mt-[-120px] relative bg-white px-8 sm:px-20">
        <h1 className="text-center py-8 font-site">{item.noticia.title}</h1>
        <p className="text-slate-600 py-6 max-w-3xl text-lg mx-auto text-center">
          {item.noticia.shortDescription}
        </p>
        <LongDescription html={item.longDescription} />
      </div>
    </div>
  );
}
