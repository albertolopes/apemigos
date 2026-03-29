import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@app/utils/date-formatter';
import testIds from '@app/utils/test-ids';
import { Suspense } from 'react';
import { newsService, NewsItem, NewsResponse } from '@services';
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

export function NewsCard({ item }: { item: NewsItem }) {
  const newsUrl = item.slug ? `/news/${item.slug}` : `/news/${item.id}`;

  return (
    <Link href={newsUrl} className="group block h-full">
      <div className="relative border flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:border-orange-200">
        <div className="h-[240px] relative w-full bg-gray-200 overflow-hidden">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xl">
              N/A
            </div>
          )}
          <span className="bg-orange-500 text-white px-4 py-1 text-sm absolute bottom-[-15px] left-4 z-10">
            {formatDate(new Date(item.date))}
          </span>
        </div>

        <div className="bg-white pt-8 px-6 pb-6 flex flex-col flex-grow">
          <h2 className="font-site text-xl mb-4 line-clamp-2 min-h-[3.5rem] group-hover:text-orange-600 transition-colors">
            {item.title}
          </h2>
          <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-grow">
            {item.shortDescription}
          </p>
          <span className="text-orange-500 font-site hover:underline mt-auto inline-block">
            Saiba Mais
          </span>
        </div>
      </div>
    </Link>
  );
}
