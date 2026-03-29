import Image from 'next/image';
import testIds from '@app/utils/test-ids';
import { Suspense } from 'react';
import { newsService, NewsResponse } from '@services';
import NewsClient from './NewsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalida a cada hora

async function getInitialNews(keyword?: string) {
  try {
    const response: NewsResponse = await newsService.getNews(
      0,
      12,
      keyword?.trim() || undefined
    );
    return response;
  } catch (err) {
    console.error('Erro ao buscar notícias iniciais:', err);
    return {
      content: [],
      totalPages: 0,
      totalElements: 0,
      size: 12,
      number: 0,
    };
  }
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ keyword?: string }>;
}) {
  const { keyword } = await searchParams;
  const initialData = await getInitialNews(keyword);

  return (
    <div className="relative">
      {/* Banner */}
      <div className="w-full h-[320px] relative">
        <Image
          src="https://i.imgur.com/khWgFyK.jpeg"
          alt="banner ONG Esclerose Múltipla"
          fill
          style={{ objectFit: 'cover' }}
          unoptimized
          priority
        />
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto mt-[-120px] relative bg-white px-8 sm:px-20 pb-20">
        <h1
          className="text-center py-8 text-orange-500 font-site text-3xl"
          data-testid={testIds.NEWS_PAGE.HEADER}
        >
          Notícias e Atualizações
        </h1>
        <p className="pt-6 max-w-3xl text-slate-500 text-sm text-center mx-auto">
          Fique por dentro das últimas notícias, reportagens e comunicados.
          Acompanhe coberturas de eventos, novidades de projetos e ações da ONG.
          Informações atualizadas para manter a comunidade bem informada.
        </p>

        <Suspense
          fallback={
            <div className="text-center py-10">Carregando notícias...</div>
          }
        >
          <NewsClient
            initialItems={initialData.content}
            initialHasMore={0 < initialData.totalPages - 1}
            initialKeyword={keyword || ''}
          />
        </Suspense>
      </div>
    </div>
  );
}
