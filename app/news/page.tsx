'use client';

// app/news/page.tsx
import Image from 'next/image';
import { formatDate } from '@app/utils/date-formatter';
import testIds from '@app/utils/test-ids';
import { useState } from 'react';

interface NewsItem {
  _id: string;
  image: string;
  title: string;
  date: string | { $date: string };
  shortDescription: string;
  slug: string;
}

// Notícias adaptadas para ONG de Esclerose Múltipla
const items: NewsItem[] = [
  {
    _id: '1',
    image: 'https://picsum.photos/600/400?random=1',
    title: 'Campanha de Conscientização sobre Esclerose Múltipla',
    date: new Date('2025-09-01').toISOString(),
    shortDescription:
      'Estamos promovendo uma campanha para aumentar a conscientização sobre os desafios da esclerose múltipla.',
    slug: 'campanha-consciencia',
  },
  {
    _id: '2',
    image: 'https://picsum.photos/600/400?random=2',
    title: 'Novos Programas de Apoio a Pacientes',
    date: new Date('2025-09-05').toISOString(),
    shortDescription:
      'Conheça os novos programas de suporte que oferecemos para pessoas com esclerose múltipla e suas famílias.',
    slug: 'programas-apoio',
  },
  {
    _id: '3',
    image: 'https://picsum.photos/600/400?random=3',
    title: 'Evento de Sensibilização e Arrecadação de Fundos',
    date: { $date: new Date('2025-09-10').toISOString() },
    shortDescription:
      'Participe do nosso evento especial para aprender mais sobre a esclerose múltipla e ajudar na arrecadação de fundos.',
    slug: 'evento-arrecadacao',
  },
  {
    _id: '4',
    image: 'https://picsum.photos/600/400?random=4',
    title: 'Evento de Sensibilização e Arrecadação de Fundos',
    date: { $date: new Date('2025-09-10').toISOString() },
    shortDescription:
      'Participe do nosso evento especial para aprender mais sobre a esclerose múltipla e ajudar na arrecadação de fundos.',
    slug: 'evento-arrecadacao',
  },
  {
    _id: '5',
    image: 'https://picsum.photos/600/400?random=5',
    title: 'Evento de Sensibilização e Arrecadação de Fundos',
    date: { $date: new Date('2025-09-10').toISOString() },
    shortDescription:
      'Participe do nosso evento especial para aprender mais sobre a esclerose múltipla e ajudar na arrecadação de fundos.',
    slug: 'evento-arrecadacao',
  },
  {
    _id: '6',
    image: 'https://picsum.photos/600/400?random=6',
    title: 'Evento de Sensibilização e Arrecadação de Fundos',
    date: { $date: new Date('2025-09-10').toISOString() },
    shortDescription:
      'Participe do nosso evento especial para aprender mais sobre a esclerose múltipla e ajudar na arrecadação de fundos.',
    slug: 'evento-arrecadacao',
  },
  {
    _id: '7',
    image: 'https://picsum.photos/600/400?random=7',
    title: 'Evento de Sensibilização e Arrecadação de Fundos',
    date: { $date: new Date('2025-09-10').toISOString() },
    shortDescription:
      'Participe do nosso evento especial para aprender mais sobre a esclerose múltipla e ajudar na arrecadação de fundos.',
    slug: 'evento-arrecadacao',
  },
  {
    _id: '8',
    image: 'https://picsum.photos/600/400?random=8',
    title: 'Evento de Sensibilização e Arrecadação de Fundos',
    date: { $date: new Date('2025-09-10').toISOString() },
    shortDescription:
      'Participe do nosso evento especial para aprender mais sobre a esclerose múltipla e ajudar na arrecadação de fundos.',
    slug: 'evento-arrecadacao',
  },
  {
    _id: '9',
    image: 'https://picsum.photos/600/400?random=9',
    title: 'Evento de Sensibilização e Arrecadação de Fundos',
    date: { $date: new Date('2025-09-10').toISOString() },
    shortDescription:
      'Participe do nosso evento especial para aprender mais sobre a esclerose múltipla e ajudar na arrecadação de fundos.',
    slug: 'evento-arrecadacao',
  },
  {
    _id: '10',
    image: 'https://picsum.photos/600/400?random=10',
    title: 'Evento de Sensibilização e Arrecadação de Fundos',
    date: { $date: new Date('2025-09-10').toISOString() },
    shortDescription:
      'Participe do nosso evento especial para aprender mais sobre a esclerose múltipla e ajudar na arrecadação de fundos.',
    slug: 'evento-arrecadacao',
  },
  {
    _id: '11',
    image: 'https://picsum.photos/600/400?random=11',
    title: 'Evento de Sensibilização e Arrecadação de Fundos',
    date: { $date: new Date('2025-09-10').toISOString() },
    shortDescription:
      'Participe do nosso evento especial para aprender mais sobre a esclerose múltipla e ajudar na arrecadação de fundos.',
    slug: 'evento-arrecadacao',
  },
];

const ITEMS_PER_PAGE = 9;

export default function NewsPage() {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const paginatedItems = items.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

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
      <div className="max-w-7xl mx-auto mt-[-120px] relative bg-white px-8 sm:px-20">
        <h1
          className="text-center py-8 text-orange-500 font-site"
          data-testid={testIds.NEWS_PAGE.HEADER}
        >
          Notícias e Atualizações
        </h1>
        <p className="text-slate-500 pt-6 max-w-3xl text-sm text-center mx-auto">
          Fique por dentro das iniciativas, eventos e projetos que promovemos
          para apoiar pessoas com esclerose múltipla e aumentar a
          conscientização.
        </p>

        {/* Lista de notícias */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-7 grid-flow-row mt-10"
          data-testid={testIds.NEWS_PAGE.NEWS_LIST}
        >
          {paginatedItems.map((item) => (
            <div
              key={item._id}
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
                <span className="bg-orange-500 text-white px-6 py-2 absolute bottom-[-20px]">
                  {formatDate(
                    new Date(
                      typeof item.date === 'string'
                        ? item.date
                        : item.date.$date
                    )
                  )}
                </span>
              </div>

              <div className="bg-white relative mt-10 px-8 pb-10">
                <h2 className="mb-10 font-site">{item.title}</h2>
                <p className="text-slate-500 text-sm mb-6">
                  {item.shortDescription}
                </p>
                <a
                  data-testid={testIds.NEWS_PAGE.NEWS_ITEM_CTA}
                  href={`/news/${item.slug}`}
                  className="text-slate-500 py-6 font-site"
                >
                  Saiba Mais
                </a>
              </div>
            </div>
          ))}
        </div>
        {/* Paginação */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-slate-200 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-slate-200 rounded disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
