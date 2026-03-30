'use client';

import React, { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MOCK_PRODUCTS } from '../constants';

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    notFound();
  }

  const productImages = product.images || [product.image];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb & Cart Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 py-6 flex justify-between items-center">
        <nav className="flex text-sm text-slate-500 gap-2 items-center">
          <Link href="/" className="hover:text-orange-500 transition-colors">
            Início
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-orange-500 transition-colors">
            Loja
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-[150px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        <Link href="/shop/cart" className="text-slate-600 hover:text-orange-500 transition-colors relative p-2">
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
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 pb-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Galeria de Imagens */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
              <Image
                src={productImages[activeImage]}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {productImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImage === idx
                        ? 'border-orange-500 ring-4 ring-orange-50'
                        : 'border-transparent hover:border-slate-200'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8">
            <div>
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-site font-bold text-slate-900 mb-4 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-site font-bold text-orange-500">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-slate-400 text-sm">
                  | em até 3x sem juros
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg italic border-l-4 border-orange-200 pl-4">
                {product.description}
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-widest">
                Detalhes do Produto
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {product.fullDescription}
              </p>

              {product.specs && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.specs.map((spec, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-xs text-slate-500"
                    >
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                      {spec}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Ações de Compra */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden h-14">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 hover:bg-slate-50 transition-colors text-slate-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span className="w-12 text-center font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-4 hover:bg-slate-50 transition-colors text-slate-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>

                <button className="flex-grow bg-slate-900 text-white h-14 rounded-xl font-bold hover:bg-orange-500 transition-all shadow-lg shadow-slate-200 hover:shadow-orange-200 uppercase tracking-widest text-xs">
                  Adicionar ao Carrinho
                </button>
              </div>

              <button className="w-full bg-orange-500 text-white h-14 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 uppercase tracking-widest text-xs">
                Comprar Agora
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest mt-4">
              🛡️ Compra segura & entrega garantida para todo o Brasil
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
