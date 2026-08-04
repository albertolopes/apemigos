import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:px-10">
      <p className="font-site text-sm uppercase tracking-[0.25em] text-orange-500">
        Pagina nao encontrada
      </p>
      <h1 className="mt-4 font-site text-4xl leading-tight text-slate-700 sm:text-6xl">
        Nao encontramos esse conteudo
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-500">
        A pagina pode ter mudado de endereco ou nao estar mais disponivel.
        Continue navegando pelas areas ativas da Apemigos.
      </p>
      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/" className="btn-main inline-block">
          Ir para inicio
        </Link>
        <Link
          href="/news"
          className="inline-block border border-orange-500 px-6 py-3 font-site text-orange-500 transition-colors hover:bg-orange-50"
        >
          Ver noticias
        </Link>
        <Link
          href="/contact"
          className="inline-block border border-slate-300 px-6 py-3 font-site text-slate-600 transition-colors hover:bg-slate-50"
        >
          Falar com a Apemigos
        </Link>
      </div>
    </div>
  );
}
