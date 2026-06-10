'use client';
import Link from 'next/link';

export default function DonateBanner() {
  return (
    <section className="w-full py-8">
      <div className="border-t-4 border-orange-500 bg-white px-6 py-8 shadow-sm sm:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="font-site text-sm uppercase tracking-[0.2em] text-orange-500">
              Doacao
            </p>
            <h3 className="mt-2 font-site text-3xl text-slate-700">
              Apoie a Apemigos
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Sua contribuição ajuda a manter acolhimento, informação, campanhas
              e ações educativas para pessoas com esclerose múltipla e doenças
              raras.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/doe" className="btn-main text-center">
              Ir para doações
            </Link>
            <Link
              href="/contact"
              className="border border-orange-500 px-6 py-3 text-center font-site text-sm text-orange-500 hover:bg-orange-50"
            >
              Fale conosco
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
