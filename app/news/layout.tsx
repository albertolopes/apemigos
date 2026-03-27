import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notícias e Atualizações | Apemigos',
  description:
    'Fique por dentro das últimas notícias, reportagens e comunicados da Apemigos. Acompanhe novidades sobre Esclerose Múltipla e doenças raras.',
  openGraph: {
    title: 'Notícias e Atualizações | Apemigos',
    description: 'Fique por dentro das últimas notícias da ONG Apemigos.',
    url: 'https://apemigosbrasil.org.br/news',
    type: 'website',
    images: [
      {
        url: 'https://i.imgur.com/khWgFyK.jpeg',
        width: 1200,
        height: 630,
        alt: 'Notícias Apemigos',
      },
    ],
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
