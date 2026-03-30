'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MOCK_PRODUCTS } from './constants';

export default function ShopPage() {
  const [cartCount, setCartCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Todos');

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita navegar ao clicar no botão de carrinho
    setCartCount((prev) => prev + 1);
  };

  const categories = ['Todos', 'Vestuário', 'Acessórios', 'Papelaria'];

  const filteredProducts =
    activeCategory === 'Todos'
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <div className="relative min-h-screen bg-slate-50/30">
      {/* Banner */}
      <div className="w-full h-[320px] relative">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop"
          alt="Loja Apemigos"
          fill
          style={{ objectFit: 'cover' }}
          className="brightness-[0.7]"
          unoptimized
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
          <h1 className="text-4xl md:text-5xl font-site font-bold mb-4 drop-shadow-lg text-center">
            Loja Apemigo
          </h1>
          <p className="max-w-2xl text-center text-lg drop-shadow-md font-medium">
            Adquira nossos produtos e ajude a financiar os projetos da Apemigos.
            Todo o lucro é revertido para o apoio à comunidade de EM.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 py-12 relative mt-[-40px]">
        {/* Barra Superior da Loja */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full border text-sm font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-100'
                    : 'text-slate-500 border-slate-200 hover:border-orange-500 hover:text-orange-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <Link href="/shop/cart" className="relative cursor-pointer group">
              <div className="p-2 text-slate-600 group-hover:text-orange-500 transition-colors relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
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
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.slug}`}
              className="group flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-orange-100 transition-all duration-300"
            >
              <div className="relative h-[320px] w-full overflow-hidden bg-slate-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-orange-500 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider shadow-sm border border-orange-50">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-site text-slate-800 mb-2 group-hover:text-orange-500 transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-slate-500 text-xs line-clamp-2 mb-6 flex-grow leading-relaxed">
                  {product.description}
                </p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                      Preço
                    </span>
                    <span className="text-xl font-site font-bold text-slate-900">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <button
                    onClick={addToCart}
                    className="p-3 rounded-xl bg-slate-900 text-white hover:bg-orange-500 transition-all shadow-lg shadow-slate-200 hover:shadow-orange-200"
                    title="Adicionar ao carrinho"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Seção Informativa de Apoio */}
        <div className="mt-20 bg-gradient-to-br from-orange-500 to-orange-600 p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center gap-8 text-white shadow-2xl shadow-orange-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative w-24 h-24 flex-shrink-0 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
            <svg
              className="w-12 h-12 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-center md:text-left relative z-10">
            <h2 className="text-2xl font-site font-bold mb-3">
              Compra Solidária
            </h2>
            <p className="text-orange-50 text-sm md:text-base leading-relaxed max-w-3xl">
              Ao comprar um item em nossa loja, você não está apenas adquirindo
              um produto de qualidade, mas está contribuindo diretamente para o
              acolhimento de novos pacientes, realização de palestras educativas
              e manutenção do nosso suporte jurídico e psicológico.
              <span className="block mt-2 font-bold text-white">
                Juntos somos mais fortes!
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
