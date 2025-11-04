'use client';

import Image from 'next/image';
import { formatDate } from '@app/utils/date-formatter';
import testIds from '@app/utils/test-ids';
import { useState, useEffect } from 'react';

// ✅ Interface ajustada para lidar com o formato MongoDB
interface NewsItem {
  _id: string | { $oid: string };
  image: string;
  title: string;
  date: string | { $date: string };
  shortDescription: string;
  slug: string;
}

const ITEMS_PER_PAGE = 9;

const API_URL =
  'https://gist.githubusercontent.com/albertolopes/0af1599909d672b1ccd3a8ff327868bb/raw/noticias.json';

async function fetchAllCampaigns(): Promise<NewsItem[]> {
  try {
    const res = await fetch(API_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Erro ao buscar dados: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Erro ao buscar campanhas:', err);
    return [];
  }
}

// 🔹 Paginação local
export async function getNewsPageData(page: number) {
  const allData = await fetchAllCampaigns();

  // 🔸 Ordena do mais recente para o mais antigo
  const sortedData = allData.sort((a: any, b: any) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // mais recente primeiro
  });

  const total = sortedData.length;

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  const pageItems = sortedData.slice(start, end);

  return {
    total,
    pageItems,
    currentPage: page,
    totalPages: Math.ceil(total / ITEMS_PER_PAGE),
  };
}

export default function NewsPage() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  useEffect(() => {
    setIsLoading(true);
    getNewsPageData(page)
      .then(({ total, pageItems }) => {
        setTotalItems(total);
        setItems(pageItems);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [page]);

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
        <p className="text-slate-500 pt-6 max-w-3xl text-sm text-center mx-auto">
          Fique por dentro das iniciativas, eventos e projetos que promovemos
          para apoiar pessoas com esclerose múltipla e aumentar a
          conscientização.
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
            {items.map((item) => {
              // ✅ Extração segura dos valores
              const id =
                typeof item._id === 'string' ? item._id : item._id?.$oid;
              const date =
                typeof item.date === 'string' ? item.date : item.date?.$date;

              return (
                <div
                  key={id}
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
                      {formatDate(new Date(date))}
                    </span>
                  </div>

                  <div className="bg-white relative mt-10 px-8 pb-10">
                    <h2 className="mb-10 font-site">{item.title}</h2>
                    <p className="text-slate-500 text-sm mb-6">
                      {item.shortDescription}
                    </p>
                    <a
                      data-testid={testIds.NEWS_PAGE.NEWS_ITEM_CTA}
                      href={`/news/${id}`} // ✅ usa o ID já tratado
                      className="text-slate-500 py-6 font-site"
                    >
                      Saiba Mais
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Paginação */}
        {!isLoading && !error && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-slate-200 rounded disabled:opacity-50 hover:bg-slate-300 transition-colors"
            >
              Anterior
            </button>
            <span>
              Página {page} de {totalPages || 1}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
