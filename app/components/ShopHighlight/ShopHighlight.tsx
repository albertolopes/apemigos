import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ShopHighlight() {
  return (
    <section className="py-16 border-t border-slate-100">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Lado Esquerdo: Imagem/Visual */}
        <div className="w-full lg:w-1/2 relative group">
          <div className="relative h-[400px] overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"
              alt="Produtos Loja Apemigos"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-orange-900/40 to-transparent" />
          </div>
          {/* Elemento flutuante de badge */}
          <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl hidden md:block border border-orange-50">
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 p-3 rounded-full text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-orange-500 font-bold text-lg leading-none">
                  Loja
                </p>
                <p className="text-slate-500 text-xs">Solidária</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Conteúdo */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="inline-block w-fit px-4 py-1.5 bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-widest rounded-full">
            Novidade
          </div>
          <h2 className="text-3xl md:text-4xl font-site text-slate-900 leading-tight">
            Compra Solidária na{' '}
            <span className="text-orange-500 font-bold">Loja Apemigos</span>
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Ao comprar um item em nossa loja, você não está apenas adquirindo um
            produto de qualidade, mas está contribuindo diretamente para o
            acolhimento de novos pacientes, realização de palestras educativas e
            manutenção do nosso suporte jurídico e psicológico.{' '}
            <span className="block mt-4 font-bold text-slate-800 italic">
              Juntos somos mais fortes!
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href="/shop"
              className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold text-center hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 hover:-translate-y-1"
            >
              Visitar Loja
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
