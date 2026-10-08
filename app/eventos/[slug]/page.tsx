'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Evento, eventosService } from '@services';
import { EventImage } from '../EventImage';
import { EventStatusBadge } from '../EventStatusBadge';
import {
  formatDateTime,
  getEventoDescricao,
  getEventoImagem,
  getEventoLocal,
  getEventoTitulo,
} from '../eventos-utils';

export default function EventoDetalhePage() {
  const params = useParams<{ slug: string }>();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    eventosService
      .getEventoBySlug(params.slug)
      .then(setEvento)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [params.slug]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20 text-center text-sm text-slate-500">
        Carregando evento...
      </main>
    );
  }

  if (error || !evento) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="font-site text-slate-800">Evento não encontrado</h1>
        <p className="mt-4 text-sm text-slate-600">
          {error || 'Não foi possível carregar este evento.'}
        </p>
        <Link href="/eventos" className="mt-8 inline-block text-orange-600">
          Voltar para eventos
        </Link>
      </main>
    );
  }

  const titulo = getEventoTitulo(evento);
  const eventoUrl = `/eventos/${params.slug}`;

  return (
    <main className="bg-white">
      <EventImage
        src={getEventoImagem(evento)}
        alt={titulo}
        className="h-[360px] w-full"
      />
      <section className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
        <EventStatusBadge open={evento.inscricoesAbertas} />
        <h1 className="mt-5 font-site text-slate-800">{titulo}</h1>
        <p className="mt-6 whitespace-pre-line text-base leading-8 text-slate-700">
          {getEventoDescricao(evento)}
        </p>

        <dl className="mt-10 grid grid-cols-1 gap-5 border-y border-slate-200 py-8 text-sm text-slate-700 sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-slate-900">Local</dt>
            <dd>{getEventoLocal(evento)}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Data início</dt>
            <dd>
              {formatDateTime(evento.dataInicio || evento.dataEvento) || '-'}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Data fim</dt>
            <dd>{formatDateTime(evento.dataFim) || '-'}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">
              Início das inscrições
            </dt>
            <dd>{formatDateTime(evento.inicioInscricoes) || '-'}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Fim das inscrições</dt>
            <dd>{formatDateTime(evento.fimInscricoes) || '-'}</dd>
          </div>
          {evento.limiteInscricoes !== undefined &&
            evento.limiteInscricoes !== null && (
              <div>
                <dt className="font-semibold text-slate-900">
                  Limite de inscrições
                </dt>
                <dd>{evento.limiteInscricoes}</dd>
              </div>
            )}
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/eventos"
            className="border border-slate-300 px-5 py-3 font-site text-sm text-slate-700 transition hover:border-orange-500 hover:text-orange-600"
          >
            Voltar
          </Link>
          {evento.inscricoesAbertas && (
            <Link href={`${eventoUrl}/inscricao`} className="btn-main">
              Inscrever-se
            </Link>
          )}
        </div>
        {!evento.inscricoesAbertas && (
          <div className="mt-6 border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Inscrições encerradas ou indisponíveis para este evento.
          </div>
        )}
      </section>
    </main>
  );
}
