'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatDate } from '@app/utils/date-formatter';
import testIds from '@app/utils/test-ids';
import { useState, useEffect, useRef } from 'react';
import { newsService, NewsItem, NewsResponse } from '@services';

const ITEMS_PER_PAGE = 9;

async function getNewsPageData(page: number) {
  try {
    const response: NewsResponse = await newsService.getNews(
      page - 1,
      ITEMS_PER_PAGE
    );

    return {
      total: response.totalElements,
      pageItems: response.content,
      currentPage: page,
      totalPages: response.totalPages,
    };
  } catch (err) {
    console.error('Erro ao buscar notícias:', err);
    throw new Error('Falha ao carregar notícias');
  }
}

export default function NewsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPage = (() => {
    const p = parseInt(String(searchParams.get('page') || '1'), 10);
    return isNaN(p) || p < 1 ? 1 : p;
  })();

  const [page, setPage] = useState(initialPage);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //  ADICIONADO: Controle de chamadas duplicadas
  const isFetchingRef = useRef(false);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Sincroniza quando a query string muda (ex.: back/forward)
  useEffect(() => {
    const p = parseInt(String(searchParams.get('page') || '1'), 10);
    const normalized = isNaN(p) || p < 1 ? 1 : p;
    if (normalized !== page) {
      setPage(normalized);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    // 🔥 ADICIONADO: Previne chamadas duplicadas
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    getNewsPageData(page)
      .then(({ total, pageItems }) => {
        setTotalItems(total);
        setItems(pageItems);
      })
      .catch((err) => setError(err.message))
      .finally(() => {
        setIsLoading(false);
        isFetchingRef.current = false; // 🔥 ADICIONADO: Libera para próxima chamada
      });
  }, [page]);

  function goToPage(n: number) {
    const normalized = Math.max(1, Math.min(totalPages || 1, n));
    // Atualiza URL para deep-link e histórico
    router.push(`/news?page=${normalized}`);
    setPage(normalized);
  }

  return (
    <div className="relative">
      {/* Banner */}
      <div className="w-full h-[400px] relative">
        <Image
          src="https://picsum.photos/1920/492?random=10"
          alt="banner ONG Esclerose Múltipla"
          fill
          style={{ objectFit: 'cover' }}
          unoptimized
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
        <p className="text-slate-600 pt-6 max-w-3xl text-center mx-auto">
          Fique por dentro das últimas notícias, reportagens e comunicados.
          Acompanhe coberturas de eventos, novidades de projetos e ações da ONG.
          Informações atualizadas para manter a comunidade bem informada.
        </p>

        {/* Erro */}
        {error && (
          <div className="text-red-500 text-center mt-6">⚠️ {error}</div>
        )}

        {/* Carregando */}
        {isLoading && (
          <div className="text-center mt-10 text-slate-400">Carregando...</div>
        )}

        {/* Lista de notícias */}
        {!isLoading && !error && (
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-7 grid-flow-row mt-10"
            data-testid={testIds.NEWS_PAGE.NEWS_LIST}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="relative border"
                data-testid={testIds.NEWS_PAGE.NEWS_ITEM_CONTAINER}
              >
                <div className="h-[320px] relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                  <span className="bg-orange-500 text-white px-6 py-2 absolute bottom-[-20px] left-4">
                    {formatDate(new Date(item.date))}
                  </span>
                </div>

                <div className="bg-white relative mt-10 px-8 pb-10">
                  <h2 className="mb-10 font-site">{item.title}</h2>
                  <p className="text-slate-600 text-sm mb-6">
                    {item.shortDescription}
                  </p>
                  <Link
                    data-testid={testIds.NEWS_PAGE.NEWS_ITEM_CTA}
                    href={item.slug ? `/news/${item.slug}` : `/news/${item.id}`}
                    className="text-slate-600 py-6 font-site"
                  >
                    Saiba Mais
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginação */}
        {!isLoading && !error && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-slate-200 rounded disabled:opacity-50 hover:bg-slate-300 transition-colors"
            >
              Anterior
            </button>
            <span>
              Página {page} de {totalPages || 1}
            </span>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages || totalPages === 0}
              className="px-4 py-2 bg-slate-200 rounded disabled:opacity-50 hover:bg-slate-300 transition-colors"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
