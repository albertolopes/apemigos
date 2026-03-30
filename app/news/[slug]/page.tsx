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
          return;
        }
        console.error('Erro ao carregar notícia:', err);
        setError('Erro ao carregar a notícia. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

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

  // Esquema de Dados Estruturados (JSON-LD) para o Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.noticia.title,
    image: [item.noticia.image],
    datePublished: item.noticia.date,
    dateModified: item.noticia.date,
    author: [
      {
        '@type': 'Organization',
        name: 'Apemigos Brasil',
        url: 'https://apemigosbrasil.org.br',
      },
    ],
    description: item.noticia.shortDescription,
  };

  return (
    <div className="relative">
      {/* Script para o Google ler os metadados estruturados */}
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
          {/* Título Principal SEO H1 - Cor Laranja */}
          <h1 className="text-center py-6 font-site text-2xl md:text-4xl text-orange-500 leading-tight">
            {item.noticia.title}
          </h1>

          {/* Resumo/Descrição Curta - Cor Slate-600 */}
          <p className="text-slate-600 py-4 max-w-3xl text-base md:text-lg mx-auto text-center font-normal leading-relaxed border-b border-slate-100 mb-6">
            {item.noticia.shortDescription}
          </p>

          <LongDescription html={item.longDescription} />
        </article>
      </div>
    </div>
  );
}
