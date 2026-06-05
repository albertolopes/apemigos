import Image from 'next/image';
import Link from 'next/link';
import DonatePixPanel from '@app/components/DonatePixPanel/DonatePixPanel';

const donationHighlights = [
  {
    title: 'Acolhimento contínuo',
    description:
      'Fortaleça a rede de apoio para pacientes e familiares com orientação, escuta e encaminhamento.',
  },
  {
    title: 'Informação qualificada',
    description:
      'Ajude a manter conteúdos, campanhas e ações educativas sobre esclerose múltipla e doenças raras.',
  },
  {
    title: 'Mobilização por direitos',
    description:
      'Apoie iniciativas que ampliam visibilidade, inclusão e acesso a cuidados adequados.',
  },
];

const donationWays = [
  'Pix com QR dinâmico ou chave direta da associação.',
  'Doações pontuais para apoiar ações e campanhas.',
  'Contato direto para apoio institucional, parcerias e contribuições recorrentes.',
];

export default function DonatePage() {
  return (
    <div className="relative pb-16">
      <div className="relative h-[320px] w-full sm:h-[460px]">
        <Image
          src="https://i.imgur.com/khWgFyK.jpeg"
          alt="Pessoa recebendo apoio em ação da Apemigos"
          fill
          style={{ objectFit: 'cover' }}
          unoptimized
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-x-0 bottom-10 mx-auto max-w-6xl px-6 text-white sm:px-10">
          <p className="font-site text-sm uppercase tracking-[0.3em] text-orange-300">
            Doações
          </p>
          <h1 className="mt-4 max-w-4xl font-site text-4xl leading-tight sm:text-6xl">
            Uma página direta para apoiar a Apemigos
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-100 sm:text-lg">
            Doe de forma simples e ajude a manter acolhimento, informação e
            mobilização em defesa de pessoas com esclerose múltipla e doenças
            raras.
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-[-12px] max-w-6xl px-6 sm:mt-[-24px] sm:px-10">
        <section className="border-t-4 border-orange-500 bg-white px-6 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:px-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_320px] lg:items-start">
            <div>
              <h2 className="font-site text-3xl text-orange-500">
                Sua contribuição mantém a rede ativa
              </h2>
              <p className="mt-4 text-sm text-slate-500 sm:text-base">
                A referência da ABEM mostra bem o essencial de uma página de
                doação: explicar a causa, facilitar a contribuição e reduzir
                ruído. Aqui, a página segue o padrão visual da Apemigos e
                concentra só o que importa para converter com clareza.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 bg-slate-50 p-5">
              <p className="font-site text-xl text-slate-700">
                Precisa falar antes?
              </p>
              <p className="mt-3 text-sm text-slate-500">
                Para doações recorrentes, apoio institucional ou parcerias, fale
                com a associação diretamente.
              </p>
              <Link href="/contact" className="btn-main mt-5 inline-block">
                Entrar em contato
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-6 md:grid-cols-3">
          {donationHighlights.map((item) => (
            <article key={item.title} className="bg-white p-6 shadow-sm">
              <h2 className="font-site text-2xl text-orange-500">
                {item.title}
              </h2>
              <p className="mt-4 text-sm text-slate-500">{item.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-16">
          <DonatePixPanel />
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="bg-white px-6 py-8 shadow-sm sm:px-10">
            <h2 className="font-site text-3xl text-orange-500">
              Formas de apoiar
            </h2>
            <div className="mt-6 space-y-4 text-sm text-slate-500 sm:text-base">
              {donationWays.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 p-8 text-white shadow-sm">
            <p className="font-site text-2xl">Transparência e proximidade</p>
            <p className="mt-4 text-sm text-slate-200">
              Se quiser entender melhor as frentes da associação antes de doar,
              veja quem é a Apemigos e entre em contato com a equipe.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/about"
                className="border border-white px-5 py-3 text-sm transition hover:bg-white hover:text-slate-800"
              >
                Conhecer a Apemigos
              </Link>
              <Link
                href="/contact"
                className="bg-orange-500 px-5 py-3 text-sm transition hover:bg-orange-600"
              >
                Falar com a equipe
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
