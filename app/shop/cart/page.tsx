'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MOCK_PRODUCTS } from '../constants';

export default function CartPage() {
  // Inicializando a sacola com alguns itens mockados para visualização
  const [cartItems, setCartItems] = useState([
    { ...MOCK_PRODUCTS[0], quantity: 1 },
    { ...MOCK_PRODUCTS[1], quantity: 2 },
  ]);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = cartItems.length > 0 ? 15.0 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header da Sacola */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 py-10">
          <h1 className="text-3xl font-site font-bold text-slate-900">
            Minha Sacola
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            {cartItems.length}{' '}
            {cartItems.length === 1 ? 'item adicionado' : 'itens adicionados'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 py-12">
        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Lista de Itens */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 items-center"
                >
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="flex-grow text-center sm:text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-site font-bold text-slate-900 mt-1">
                      {item.name}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-1">
                      {item.description}
                    </p>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="mt-4 text-xs font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors mx-auto sm:ml-0"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Remover
                    </button>
                  </div>

                  <div className="flex flex-col items-center sm:items-end gap-4">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-3 py-1 hover:bg-slate-50 text-slate-500"
                      >
                        {' '}
                        -{' '}
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-3 py-1 hover:bg-slate-50 text-slate-500"
                      >
                        {' '}
                        +{' '}
                      </button>
                    </div>
                    <span className="text-xl font-site font-bold text-slate-900">
                      R${' '}
                      {(item.price * item.quantity)
                        .toFixed(2)
                        .replace('.', ',')}
                    </span>
                  </div>
                </div>
              ))}

              <Link
                href="/shop"
                className="text-orange-500 font-bold text-sm flex items-center gap-2 hover:underline mt-4"
              >
                ← Continuar Comprando
              </Link>
            </div>

            {/* Resumo do Pedido */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
                <h2 className="text-xl font-site font-bold text-slate-900 mb-6">
                  Resumo do Pedido
                </h2>

                <div className="flex flex-col gap-4 mb-8">
                  <div className="flex justify-between text-slate-500 text-sm">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">
                      R$ {subtotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-sm">
                    <span>Frete</span>
                    <span className="text-green-600 font-bold">
                      R$ {shipping.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="h-px bg-slate-100 my-2" />
                  <div className="flex justify-between text-slate-900">
                    <span className="font-bold">Total</span>
                    <span className="text-2xl font-site font-bold text-orange-500">
                      R$ {total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-orange-500 transition-all shadow-lg shadow-slate-200 hover:shadow-orange-200 uppercase tracking-widest text-xs mb-4">
                  Finalizar Compra
                </button>

                <div className="flex items-center gap-2 justify-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Ambiente 100% Seguro
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Estado Vazio */
          <div className="bg-white p-20 rounded-3xl shadow-sm border border-slate-100 text-center flex flex-col items-center gap-6">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
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
              <h2 className="text-2xl font-site font-bold text-slate-900">
                Sua sacola está vazia
              </h2>
              <p className="text-slate-500 mt-2">
                Você ainda não adicionou nenhum produto à sua sacola.
              </p>
            </div>
            <Link
              href="/shop"
              className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 mt-4"
            >
              Ir para a Loja
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
