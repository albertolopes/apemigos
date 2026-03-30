'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { newsService, NewsItem } from '@services';
import { formatDate } from '@app/utils/date-formatter';

export default function RecentNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentNews() {
      try {
        const response = await newsService.getNews(0, 3);
        setNews(response.content);
      } catch (error) {
        console.error('Erro ao buscar notícias recentes:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecentNews();
  }, []);

  if (isLoading) return null;
  if (news.length === 0) return null;

  return (
    <section className="py-12 border-t border-slate-100">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-site text-orange-500">
            Últimas Notícias
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Fique por dentro das novidades
          </p>
        </div>
        <Link
          href="/news"
          className="text-orange-500 text-sm font-semibold hover:underline"
        >
          Ver todas →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {news.map((item) => (
          <Link
            key={item.id}
            href={item.slug ? `/news/${item.slug}` : `/news/${item.id}`}
            className="group flex flex-col h-full bg-white border border-slate-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-48 w-full overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                  N/A
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className="bg-orange-500 text-white text-[10px] px-2 py-1 font-bold uppercase tracking-wider">
                  {formatDate(new Date(item.date))}
                </span>
              </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-site text-lg leading-snug mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                {item.title}
              </h3>
              <p className="text-slate-600 text-xs line-clamp-2 mb-4 flex-grow">
                {item.shortDescription}
              </p>
              <span className="text-orange-500 text-[11px] font-bold uppercase tracking-widest group-hover:underline">
                Leia mais
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
