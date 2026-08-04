import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contato | Apemigos',
  description:
    'Entre em contato com a Apemigos para acolhimento, duvidas, parcerias, voluntariado e informacoes sobre esclerose multipla e doencas raras.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
