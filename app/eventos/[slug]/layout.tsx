import { Metadata } from 'next';
import {
  getEventoDescricao,
  getEventoImagem,
  getEventoResumo,
  getEventoTitulo,
} from '../eventos-utils';
import { Evento } from '@services';

async function getEventoMetadata(slug: string): Promise<Evento | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;

  try {
    const response = await fetch(
      `${apiUrl.replace(/\/+$/, '')}/api/public/eventos/slug/${slug}`,
      {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      }
    );

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const evento = await getEventoMetadata(slug);

  if (!evento) {
    return {
      title: 'Evento não encontrado | Apemigos',
      robots: { index: false, follow: false },
    };
  }

  const titulo = getEventoTitulo(evento);
  const descricao = getEventoResumo(evento) || getEventoDescricao(evento);
  const imagem = getEventoImagem(evento);
  const canonical = `/eventos/${slug}`;

  return {
    title: `${titulo} | Apemigos`,
    description: descricao,
    alternates: { canonical },
    openGraph: {
      title: titulo,
      description: descricao,
      url: canonical,
      images: imagem ? [{ url: imagem, alt: titulo }] : undefined,
    },
  };
}

export default function EventoSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
