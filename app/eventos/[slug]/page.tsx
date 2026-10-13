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
  const dataInicio = formatDateTime(evento.dataInicio || evento.dataEvento);
  const dataFim = formatDateTime(evento.dataFim);
  const inicioInscricoes = formatDateTime(evento.inicioInscricoes);
  const fimInscricoes = formatDateTime(evento.fimInscricoes);
  const local = getEventoLocal(evento);

  return (
    <main className="bg-white">
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[380px_1fr] lg:items-start">
        <div className="lg:sticky lg:top-8">
          <EventImage
            src={imagem}
            alt={`Flyer do evento ${titulo}`}
            className="h-[520px] w-full border border-slate-200 bg-slate-50"
            imageClassName="object-contain p-3"
          />
        </div>

        <div>
          <EventStatusBadge open={evento.inscricoesAbertas} />
          <h1 className="mt-5 font-site text-slate-800">{titulo}</h1>

          <dl className="mt-6 grid grid-cols-1 gap-4 text-sm text-slate-700 sm:grid-cols-2">
            <div className="border border-slate-200 bg-slate-50 p-4">
              <dt className="font-semibold text-slate-900">Data início</dt>
              <dd className="mt-1">{dataInicio || '-'}</dd>
            </div>
            <div className="border border-slate-200 bg-slate-50 p-4">
              <dt className="font-semibold text-slate-900">Local</dt>
              <dd className="mt-1">{local}</dd>
            </div>
            {dataFim && (
              <div className="border border-slate-200 bg-slate-50 p-4">
                <dt className="font-semibold text-slate-900">Data fim</dt>
                <dd className="mt-1">{dataFim}</dd>
              </div>
            )}
            {fimInscricoes && (
              <div className="border border-slate-200 bg-slate-50 p-4">
                <dt className="font-semibold text-slate-900">Inscrições até</dt>
                <dd className="mt-1">{fimInscricoes}</dd>
              </div>
            )}
            {evento.limiteInscricoes !== undefined &&
              evento.limiteInscricoes !== null && (
                <div className="border border-slate-200 bg-slate-50 p-4">
                  <dt className="font-semibold text-slate-900">Vagas</dt>
                  <dd className="mt-1">{evento.limiteInscricoes}</dd>
                </div>
              )}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            {evento.inscricoesAbertas && (
              <Link href={`${eventoUrl}/inscricao`} className="btn-main">
                Inscrever-se
              </Link>
            )}
            <Link
              href="/eventos"
              className="border border-slate-300 px-5 py-3 font-site text-sm text-slate-700 transition hover:border-orange-500 hover:text-orange-600"
            >
              Voltar
            </Link>
          </div>

          {!evento.inscricoesAbertas && (
            <div className="mt-6 border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Inscrições encerradas ou indisponíveis para este evento.
            </div>
          )}

          <section className="mt-10 border-t border-slate-200 pt-8">
            <h2 className="font-site text-2xl text-slate-800">
              Sobre o evento
            </h2>
            <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-700">
              {getEventoDescricao(evento)}
            </p>
          </section>

          {(inicioInscricoes || fimInscricoes) && (
            <section className="mt-10 border-t border-slate-200 pt-8">
              <h2 className="font-site text-2xl text-slate-800">Inscrições</h2>
              <dl className="mt-4 grid grid-cols-1 gap-4 text-sm text-slate-700 sm:grid-cols-2">
                {inicioInscricoes && (
                  <div>
                    <dt className="font-semibold text-slate-900">
                      Início das inscrições
                    </dt>
                    <dd>{inicioInscricoes}</dd>
                  </div>
                )}
                {fimInscricoes && (
                  <div>
                    <dt className="font-semibold text-slate-900">
                      Fim das inscrições
                    </dt>
                    <dd>{fimInscricoes}</dd>
                  </div>
                )}
              </dl>
            </section>
          )}

          <EventSharePanel title={titulo} slug={slug} />
        </div>
      </section>
    </main>
  );
}
