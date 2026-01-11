'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { formatDate } from '@app/utils/date-formatter';
import testIds from '@app/utils/test-ids';
import { useState, useEffect, useRef } from 'react';
import { newsService, NewsItem, NewsResponse } from '@services';

const ITEMS_PER_PAGE = 12;

async function getNewsPageData(page: number, keyword?: string) {
  try {
    // newsService.getNews expects page (0-based), size, and optionally keyword
    const response: NewsResponse = await newsService.getNews(
      page - 1,
      ITEMS_PER_PAGE,
      keyword && keyword.trim() ? keyword.trim() : undefined
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

  // keyword taken from querystring (optional)
  const initialKeyword = (() => String(searchParams.get('keyword') || '').trim())();

  const initialPage = (() => {
    const p = parseInt(String(searchParams.get('page') || '1'), 10);
    return isNaN(p) || p < 1 ? 1 : p;
  })();

  const [page, setPage] = useState(initialPage);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [keyword, setKeyword] = useState<string>(initialKeyword);
  // submittedKeyword controls when a search is actually performed (only on submit or URL load)
  const [submittedKeyword, setSubmittedKeyword] = useState<string>(initialKeyword);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //  ADICIONADO: Controle de chamadas duplicadas
  const isFetchingRef = useRef(false);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Atualiza a URL no browser sem forçar navegação do Next.js (evita recarregamento de página)
  const updateUrlWithoutNavigation = (pageNum: number, kw?: string, replace = false) => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      url.pathname = '/news';
      url.searchParams.set('page', String(pageNum));
      if (kw && String(kw).trim()) url.searchParams.set('keyword', String(kw).trim());
      else url.searchParams.delete('keyword');
      if (replace) window.history.replaceState({}, '', url.toString());
      else window.history.pushState({}, '', url.toString());
    } catch (e) {
      console.warn('Não foi possível atualizar a URL sem navegação', e);
    }
  };

  // Sincroniza quando a query string muda (ex.: back/forward)
  useEffect(() => {
    const p = parseInt(String(searchParams.get('page') || '1'), 10);
    const normalized = isNaN(p) || p < 1 ? 1 : p;
    if (normalized !== page) {
      setPage(normalized);
    }
    // sync keyword from querystring into both input and submittedKeyword (URL load -> perform search)
    const k = String(searchParams.get('keyword') || '').trim();
    if (k !== keyword) setKeyword(k);
    if (k !== submittedKeyword) setSubmittedKeyword(k);

    // também sincroniza quando o usuário usa voltar/avançar (popstate)
    const onPop = () => {
      try {
        const sp = new URL(window.location.href).searchParams;
        const p2 = parseInt(String(sp.get('page') || '1'), 10);
        const normalized2 = isNaN(p2) || p2 < 1 ? 1 : p2;
        const k2 = String(sp.get('keyword') || '').trim();
        setPage(normalized2);
        setKeyword(k2);
        setSubmittedKeyword(k2);
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener('popstate', onPop);

    return () => {
      window.removeEventListener('popstate', onPop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    // 🔥 ADICIONADO: Previne chamadas duplicadas
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    // only fetch using the submittedKeyword (search triggered by submit or URL)
    getNewsPageData(page, submittedKeyword)
      .then(({ total, pageItems }) => {
        setTotalItems(total);
        setItems(pageItems);
      })
      .catch((err) => setError(err.message))
      .finally(() => {
        setIsLoading(false);
        isFetchingRef.current = false; // 🔥 ADICIONADO: Libera para próxima chamada
      });
  }, [page, submittedKeyword]);

  function goToPage(n: number) {
    const normalized = Math.max(1, Math.min(totalPages || 1, n));
    // Atualiza estado e URL sem navegação completa
    setPage(normalized);
    updateUrlWithoutNavigation(normalized, submittedKeyword, false);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    // set submittedKeyword (triggers effect) and update URL
    const k = keyword && keyword.trim() ? keyword.trim() : '';
    setSubmittedKeyword(k);
    setPage(1);
    // atualiza apenas a URL no histórico (sem recarregar a página)
    updateUrlWithoutNavigation(1, k, false);
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

        {/* Search */}
        <div className="mt-8 flex justify-center">
          <form onSubmit={handleSearchSubmit} className="w-full max-w-md">
            <div className="flex gap-2 items-start">
              <div className="relative w-full">
                <input
                  id="newsKeyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Buscar por palavra-chave"
                  className="w-full pr-12 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-3 focus:ring-orange-500"
                  aria-label="Buscar notícias"
                />
                {(keyword || submittedKeyword) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!keyword && !submittedKeyword) return;
                      setKeyword('');
                      setSubmittedKeyword('');
                      updateUrlWithoutNavigation(1, '', false);
                      setPage(1);
                      // focus the input after clearing
                      const el = document.getElementById('newsKeyword') as HTMLInputElement | null;
                      if (el) el.focus();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-base leading-none z-20 bg-transparent border-0"
                    aria-label="Limpar busca"
                    title="Limpar"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                >
                  Buscar
                </button>
              </div>
            </div>
          </form>
        </div>

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
