import Link from 'next/link';
import { Evento, eventosService } from '@services';
import { EventImage } from '../EventImage';
import { EventStatusBadge } from '../EventStatusBadge';
import { EventSharePanel } from './EventSharePanel';
import {
  formatDateTime,
  getEventoDescricao,
  getEventoImagem,
  getEventoLocal,
  getEventoTitulo,
} from '../eventos-utils';

async function getEvento(slug: string): Promise<Evento | null> {
  try {
    return await eventosService.getEventoBySlug(slug);
  } catch (error) {
    return null;
  }
}

export default async function EventoDetalhePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const evento = await getEvento(slug);

  if (!evento) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="font-site text-slate-800">Evento não encontrado</h1>
        <p className="mt-4 text-sm text-slate-600">
          Não foi possível carregar este evento.
        </p>
        <Link href="/eventos" className="mt-8 inline-block text-orange-600">
          Voltar para eventos
        </Link>
      </main>
    );
  }

  const titulo = getEventoTitulo(evento);
  const eventoUrl = `/eventos/${slug}`;
  const imagem = getEventoImagem(evento);

  return (
    <main className="bg-white">
      <EventImage src={imagem} alt={titulo} className="h-[360px] w-full" />
      <section className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
        <EventStatusBadge open={evento.inscricoesAbertas} />
        <h1 className="mt-5 font-site text-slate-800">{titulo}</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr] lg:items-start">
          <EventImage
            src={imagem}
            alt={`Imagem do evento ${titulo}`}
            className="h-64 w-full"
          />
          <p className="whitespace-pre-line text-base leading-8 text-slate-700">
            {getEventoDescricao(evento)}
          </p>
        </div>

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
        <EventSharePanel title={titulo} slug={slug} />
      </section>
    </main>
  );
}
