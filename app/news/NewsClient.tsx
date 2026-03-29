'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { newsService, NewsItem, NewsResponse } from '@services';
import { NewsCard } from './NewsCard';

interface NewsClientProps {
  initialItems: NewsItem[];
  initialHasMore: boolean;
  initialKeyword: string;
}

const ITEMS_PER_PAGE = 12;

export default function NewsClient({
  initialItems,
  initialHasMore,
  initialKeyword,
}: NewsClientProps) {
  const [items, setItems] = useState<NewsItem[]>(initialItems);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Controle de busca
  const [keyword, setKeyword] = useState(initialKeyword);
  const [submittedKeyword, setSubmittedKeyword] = useState(initialKeyword);

  // Refs para controle
  const observer = useRef<IntersectionObserver | null>(null);
  const isFetchingRef = useRef(false);

  // Função para buscar dados
  const fetchNews = useCallback(async (pageNum: number, searchKw: string) => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response: NewsResponse = await newsService.getNews(
        pageNum - 1, // API usa 0-based index
        ITEMS_PER_PAGE,
        searchKw.trim() || undefined
      );

      setItems((prev) => {
        return pageNum === 1
          ? response.content
          : [...prev, ...response.content];
      });

      setHasMore(pageNum < response.totalPages);
    } catch (err: any) {
      console.error('Erro ao buscar notícias:', err);
      setError('Falha ao carregar notícias. Tente novamente.');
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Efeito para resetar e buscar quando a keyword muda (nova busca)
  useEffect(() => {
    // Se a keyword submetida for diferente da inicial ou se já houve navegação, busca novamente
    if (submittedKeyword !== initialKeyword || page > 1) {
      setPage(1);
      setHasMore(true);
      fetchNews(1, submittedKeyword);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedKeyword, fetchNews]);

  // Efeito para carregar mais páginas quando 'page' muda (scroll infinito)
  useEffect(() => {
    if (page > 1) {
      fetchNews(page, submittedKeyword);
    }
  }, [page, submittedKeyword, fetchNews]);

  // Callback para o IntersectionObserver (elemento sentinela)
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

  // Handler para o formulário de busca
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
    <>
      {/* Search */}
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

      {/* Lista de notícias */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-7 grid-flow-row">
        {items.map((item, index) => {
          if (items.length === index + 1) {
            return (
              <div ref={lastNewsElementRef} key={item.id}>
                <NewsCard item={item} />
              </div>
            );
          } else {
            return (
              <div key={item.id}>
                <NewsCard item={item} />
              </div>
            );
          }
        })}
      </div>

      {/* Loading Indicator & Error */}
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
    </>
  );
}
