import { Metadata } from 'next';
import {
  getEventoDescricao,
  getEventoImagem,
  getEventoResumo,
  getEventoTitulo,
} from '../eventos-utils';
import { Evento } from '@services';

const siteUrl = 'https://apemigosbrasil.org.br';

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
      title: 'Evento | Apemigos',
      description:
        'Confira os eventos publicados pela Apemigos e acompanhe as informações de inscrição.',
      alternates: { canonical: `/eventos/${slug}` },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  }

  const titulo = getEventoTitulo(evento);
  const descricao = getEventoResumo(evento) || getEventoDescricao(evento);
  const imagem = getEventoImagem(evento);
  const canonicalPath = `/eventos/${slug}`;
  const canonical = `${siteUrl}${canonicalPath}`;

  return {
    title: `${titulo} | Apemigos`,
    description: descricao,
    alternates: { canonical: canonicalPath },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: titulo,
      description: descricao,
      url: canonical,
      siteName: 'Apemigos',
      locale: 'pt_BR',
      type: 'article',
      images: imagem ? [{ url: imagem, alt: titulo }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: descricao,
      images: imagem ? [imagem] : undefined,
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
