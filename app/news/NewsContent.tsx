'use client';

import Image from 'next/image';
import testIds from '@app/utils/test-ids';
import { useState, useEffect, useRef, useCallback } from 'react';
import { newsService, NewsItem, NewsResponse } from '@services';
import { NewsCard } from './NewsCard';

interface Props {
  initialHasMore: boolean;
  initialItems: NewsItem[];
  initialKeyword?: string;
}

const ITEMS_PER_PAGE = 12;

export function NewsContent({
  initialHasMore,
  initialItems,
  initialKeyword = '',
}: Props) {
  const [items, setItems] = useState<NewsItem[]>(initialItems);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [keyword, setKeyword] = useState(initialKeyword);
  const [submittedKeyword, setSubmittedKeyword] = useState(initialKeyword);

  const observer = useRef<IntersectionObserver | null>(null);
  const isFetchingRef = useRef(false);
  const didHydrateRef = useRef(false);

  const fetchNews = useCallback(async (pageNum: number, searchKw: string) => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response: NewsResponse = await newsService.getNews(
        pageNum - 1,
        ITEMS_PER_PAGE,
        searchKw.trim() || undefined
      );

      setItems((prev) =>
        pageNum === 1 ? response.content : [...prev, ...response.content]
      );
      setHasMore(pageNum < response.totalPages);
    } catch (err: any) {
      console.error('Erro ao buscar notícias:', err);
      setError('Falha ao carregar notícias. Tente novamente.');
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!didHydrateRef.current) {
      didHydrateRef.current = true;
      return;
    }

    setPage(1);
    setHasMore(true);
    setItems([]);
    fetchNews(1, submittedKeyword);
  }, [submittedKeyword, fetchNews]);

  useEffect(() => {
    if (page > 1) {
      fetchNews(page, submittedKeyword);
    }
  }, [page, submittedKeyword, fetchNews]);

  const lastNewsElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();

    const url = new URL(window.location.href);
    if (keyword.trim()) {
      url.searchParams.set('keyword', keyword.trim());
    } else {
      url.searchParams.delete('keyword');
    }
    window.history.pushState({}, '', url.toString());

    setSubmittedKeyword(keyword);
  }

  return (
    <div className="relative">
      <div className="w-full h-[320px] relative">
        <Image
          src="https://i.imgur.com/khWgFyK.jpeg"
          alt="banner ONG Esclerose Múltipla"
          fill
          style={{ objectFit: 'cover' }}
          unoptimized
        />
      </div>

      <div className="max-w-7xl mx-auto mt-[-120px] relative bg-white px-8 sm:px-20 pb-20">
        <div className="max-w-4xl border-t-4 border-orange-500 bg-white p-8 shadow-sm sm:p-12">
          <p className="font-site text-sm uppercase tracking-[0.25em] text-orange-500">
            Notícias
          </p>
          <h1
            className="mt-4 font-site text-5xl leading-tight text-slate-700 sm:text-7xl"
            data-testid={testIds.NEWS_PAGE.HEADER}
          >
            Notícias e Atualizações
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-500">
            Fique por dentro das últimas notícias, reportagens e comunicados.
            Acompanhe coberturas de eventos, novidades de projetos e ações da
            ONG. Informações atualizadas para manter a comunidade bem informada.
          </p>
        </div>

        <div className="mt-8 flex justify-center mb-10">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-md flex gap-2"
          >
            <div className="relative w-full">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Buscar por palavra-chave"
                className="w-full pr-10 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => {
                    setKeyword('');
                    setSubmittedKeyword('');
                    const url = new URL(window.location.href);
                    url.searchParams.delete('keyword');
                    window.history.pushState({}, '', url.toString());
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
            >
              Buscar
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-7 grid-flow-row">
          {items.map((item, index) =>
            items.length === index + 1 ? (
              <NewsCard ref={lastNewsElementRef} key={item.id} item={item} />
            ) : (
              <NewsCard key={item.id} item={item} />
            )
          )}
        </div>

        <div className="mt-10 text-center">
          {isLoading && (
            <p className="text-slate-500">Carregando mais notícias...</p>
          )}
          {error && <p className="text-red-500">{error}</p>}
          {!hasMore && items.length > 0 && (
            <p className="text-slate-400 text-sm mt-4">
              Você chegou ao fim da lista.
            </p>
          )}
          {!isLoading && !error && items.length === 0 && (
            <p className="text-slate-500">Nenhuma notícia encontrada.</p>
          )}
        </div>
      </div>
    </div>
  );
}
