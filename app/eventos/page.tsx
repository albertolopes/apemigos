'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Evento, eventosService } from '@services';
import { EventImage } from './EventImage';
import { EventStatusBadge } from './EventStatusBadge';
import {
  formatDate,
  formatDateTime,
  getEventoDataPrincipal,
  getEventoImagem,
  getEventoLocal,
  getEventoResumo,
  getEventoTitulo,
  summarize,
} from './eventos-utils';

const ITEMS_PER_PAGE = 10;

export default function EventosPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialPage = Math.max(
    1,
    parseInt(String(searchParams.get('page') || '1'), 10) || 1
  );

  const [page, setPage] = useState(initialPage);
  const [items, setItems] = useState<Evento[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    const nextPage = Math.max(
      1,
      parseInt(String(searchParams.get('page') || '1'), 10) || 1
    );
    if (nextPage !== page) setPage(nextPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    eventosService
      .getEventos(page - 1, ITEMS_PER_PAGE)
      .then((response) => {
        setItems(response.content || []);
        setTotalPages(response.totalPages || 1);
      })
      .catch((err) => setError(err.message))
      .finally(() => {
        setIsLoading(false);
        isFetchingRef.current = false;
      });
  }, [page]);

  function goToPage(nextPage: number) {
    const normalized = Math.max(1, Math.min(totalPages || 1, nextPage));
    setPage(normalized);
    router.push(`/eventos?page=${normalized}`);
  }

  return (
    <main className="bg-white">
      <section className="bg-slate-100">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10">
          <h1 className="font-site text-slate-800">Eventos</h1>
          <p className="mt-4 max-w-3xl text-sm text-slate-600">
            Confira os eventos publicados pela Apemigos e acompanhe os prazos de
            inscrição.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-10">
        {error && (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="py-16 text-center text-sm text-slate-500">
            Carregando eventos...
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="py-16 text-center text-sm text-slate-500">
            Nenhum evento disponível no momento.
          </div>
        )}

        {!isLoading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {items.map((evento) => {
              const titulo = getEventoTitulo(evento);
              const periodoInscricao =
                evento.inicioInscricoes || evento.fimInscricoes
                  ? `${formatDate(evento.inicioInscricoes) || 'Aberto'} ate ${
                      formatDate(evento.fimInscricoes) || 'encerramento'
                    }`
                  : '';

              return (
                <article
                  key={evento.id}
                  className="flex h-full flex-col border border-slate-200 bg-white shadow-sm transition hover:border-orange-200 hover:shadow-md"
                >
                  <EventImage
                    src={getEventoImagem(evento)}
                    alt={titulo}
                    className="h-56"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <EventStatusBadge open={evento.inscricoesAbertas} />
                    <h2 className="mt-4 font-site text-xl text-slate-800">
                      {titulo}
                    </h2>
                    <p className="mt-3 flex-1 text-sm text-slate-600">
                      {summarize(getEventoResumo(evento))}
                    </p>
                    <dl className="mt-5 space-y-2 text-sm text-slate-600">
                      <div>
                        <dt className="font-semibold text-slate-800">Local</dt>
                        <dd>{getEventoLocal(evento)}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-800">Data</dt>
                        <dd>
                          {formatDateTime(getEventoDataPrincipal(evento)) ||
                            'Data a confirmar'}
                        </dd>
                      </div>
                      {periodoInscricao && (
                        <div>
                          <dt className="font-semibold text-slate-800">
                            Inscrições
                          </dt>
                          <dd>{periodoInscricao}</dd>
                        </div>
                      )}
                    </dl>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href={`/eventos/${evento.id}`}
                        className="border border-slate-300 px-4 py-2 font-site text-sm text-slate-700 transition hover:border-orange-500 hover:text-orange-600"
                      >
                        Ver detalhes
                      </Link>
                      {evento.inscricoesAbertas && (
                        <Link
                          href={`/eventos/${evento.id}/inscricao`}
                          className="btn-main"
                        >
                          Inscrever-se
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!isLoading && !error && totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="bg-slate-200 px-4 py-2 text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-slate-600">
              Página {page} de {totalPages}
            </span>
            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="bg-slate-200 px-4 py-2 text-sm disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
