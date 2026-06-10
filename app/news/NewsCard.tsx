import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { formatDate } from '@app/utils/date-formatter';
import { NewsItem } from '@services';

export const NewsCard = React.forwardRef<HTMLDivElement, { item: NewsItem }>(
  ({ item }, ref) => {
    const newsUrl = item.slug ? `/news/${item.slug}` : `/news/${item.id}`;

    return (
      <Link href={newsUrl} className="group block h-full">
        {/* O ref é aplicado a este div, que é o container visual do card */}
        <div
          ref={ref}
          className="relative border flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:border-orange-200"
        >
          {/* Container da imagem com overflow visível para a data */}
          <div className="h-[240px] relative w-full bg-gray-200">
            <div className="absolute inset-0 overflow-hidden">
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
            </div>
            {/* Badge da data: posicionado de forma absoluta em relação ao container pai */}
            <span className="bg-orange-500 text-white px-4 py-1 text-sm absolute bottom-[-15px] left-4 z-20 shadow-md">
              {formatDate(new Date(item.date))}
            </span>
          </div>

          <div className="bg-white pt-8 px-6 pb-6 flex flex-col flex-grow relative z-10">
            <h2 className="font-site text-slate-600 text-xl mb-4 line-clamp-2 min-h-[3.5rem] group-hover:text-orange-600 transition-colors">
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
);

NewsCard.displayName = 'NewsCard';
