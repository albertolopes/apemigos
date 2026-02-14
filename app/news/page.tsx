'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { formatDate } from '@app/utils/date-formatter';
import testIds from '@app/utils/test-ids';
import { useState, useEffect, useRef, useCallback } from 'react';
import { newsService, NewsItem, NewsResponse } from '@services';

const ITEMS_PER_PAGE = 12;

export default function NewsPage() {
  const searchParams = useSearchParams();

  // Keyword inicial da URL
  const initialKeyword = searchParams.get('keyword') || '';

  const [items, setItems] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
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

      setItems(prev => {
        // Se for a primeira página, substitui. Se não, concatena.
        return pageNum === 1 ? response.content : [...prev, ...response.content];
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
    setPage(1);
    setHasMore(true);
    setItems([]); // Limpa lista visualmente para nova busca
    fetchNews(1, submittedKeyword);
  }, [submittedKeyword, fetchNews]);

  // Efeito para carregar mais páginas quando 'page' muda (scroll infinito)
  useEffect(() => {
    if (page > 1) {
      fetchNews(page, submittedKeyword);
    }
  }, [page, submittedKeyword, fetchNews]);

  // Callback para o IntersectionObserver (elemento sentinela)
  const lastNewsElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  // Handler para o formulário de busca
  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Atualiza a URL sem recarregar
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
      {/* Banner */}
      <div className="w-full h-[320px] relative">
        <Image
          src="https://i.imgur.com/khWgFyK.jpeg"
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
        <div className="mt-8 flex justify-center mb-10">
          <form onSubmit={handleSearchSubmit} className="w-full max-w-md flex gap-2">
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
            // Se for o último elemento, anexa a ref para o observer
            if (items.length === index + 1) {
              return (
                <div
                  ref={lastNewsElementRef}
                  key={item.id}
                  className="relative border flex flex-col"
                >
                  <NewsCardContent item={item} />
                </div>
              );
            } else {
              return (
                <div key={item.id} className="relative border flex flex-col">
                  <NewsCardContent item={item} />
                </div>
              );
            }
          })}
        </div>

        {/* Loading Indicator & Error */}
        <div className="mt-10 text-center">
          {isLoading && <p className="text-slate-500">Carregando mais notícias...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!hasMore && items.length > 0 && (
            <p className="text-slate-400 text-sm mt-4">Você chegou ao fim da lista.</p>
          )}
          {!isLoading && !error && items.length === 0 && (
            <p className="text-slate-500">Nenhuma notícia encontrada.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para o card de notícia
function NewsCardContent({ item }: { item: NewsItem }) {
  return (
    <>
      <div className="h-[240px] relative w-full">
        <Image
          src={item.image}
          alt={item.title}
          fill
          style={{ objectFit: 'cover' }}
          unoptimized
        />
        <span className="bg-orange-500 text-white px-4 py-1 text-sm absolute bottom-[-15px] left-4 z-10">
          {formatDate(new Date(item.date))}
        </span>
      </div>

      <div className="bg-white pt-8 px-6 pb-6 flex flex-col flex-grow">
        <h2 className="font-site text-xl mb-4 line-clamp-2 min-h-[3.5rem]">
          {item.title}
        </h2>
        <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-grow">
          {item.shortDescription}
        </p>
        <Link
          href={item.slug ? `/news/${item.slug}` : `/news/${item.id}`}
          className="text-orange-500 font-site hover:underline mt-auto inline-block"
        >
          Saiba Mais
        </Link>
      </div>
    </>
  );
}
