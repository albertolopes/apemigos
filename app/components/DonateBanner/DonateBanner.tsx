'use client';
import Link from 'next/link';

export default function DonateBanner() {
  return (
    <section className="w-full py-8">
      <div className="border-y-4 border-orange-500 bg-white px-6 py-8 shadow-sm sm:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h3 className="font-site text-3xl text-orange-500">
              Apoie a Apemigos
            </h3>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Criamos uma página de doação mais direta, no padrão visual do
              projeto, com Pix, chave de apoio e contexto objetivo sobre o
              impacto da contribuição.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/doe" className="btn-main">
              Ir para doações
            </Link>
            <Link
              href="/contact"
              className="border border-slate-300 px-5 py-3 text-sm text-slate-700 transition hover:border-orange-500 hover:text-orange-500"
            >
              Fale conosco
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
