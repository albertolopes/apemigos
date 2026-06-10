import './globals.css';
import Footer from '@app/components/Layout/Footer';
import Header from '@app/components/Layout/Header';
import { Metadata } from 'next';
import Script from 'next/script';

/**
 * Using force dynamic so changes in business assets (e.g. services) are immediately reflected.
 * If you prefer having it reflected only after redeploy (not recommended) please remove it
 * **/
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Apemigos | Associação de Pessoas com Esclerose Múltipla',
  description:
    'A Apemigos oferece suporte, informação e acolhimento para pessoas com Esclerose Múltipla e doenças raras no Distrito Federal. Juntos somos mais fortes.',
  keywords: [
    'Esclerose Múltipla',
    'Doenças Raras',
    'ONG',
    'Brasília',
    'DF',
    'Saúde',
    'Apoio',
    'Apemigos',
    'Neurologia',
    'Pacientes',
  ],
  authors: [{ name: 'Apemigos' }],
  creator: 'Apemigos',
  publisher: 'Apemigos',
  metadataBase: new URL('https://apemigosbrasil.org.br'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Apemigos | Associação de Pessoas com Esclerose Múltipla',
    description:
      'Apoio, informação e direitos para pessoas com Esclerose Múltipla e doenças raras no DF.',
    url: 'https://apemigosbrasil.org.br',
    siteName: 'Apemigos',
    images: [
      {
        url: '/images/logo.png', // Idealmente uma imagem maior (1200x630) para social, mas o logo serve como fallback
        width: 800,
        height: 600,
        alt: 'Logo Apemigos',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apemigos | Associação de Pessoas com Esclerose Múltipla',
    description:
      'Apoio, informação e direitos para pessoas com Esclerose Múltipla e doenças raras no DF.',
    images: ['/images/logo.png'],
  },
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
  verification: {
    google: 'grFN89mmOqNZsnYJ4DDcBBmebApPRNG8ywncvVV07VE',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="text-orange-500 bg-white">
        <Header />
        <main className="bg-white min-h-[600px]">{children}</main>
        <div className="mt-6 sm:mt-10">
          <Footer />
        </div>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-R82SF643GQ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-R82SF643GQ');
          `}
        </Script>
      </body>
    </html>
  );
}
