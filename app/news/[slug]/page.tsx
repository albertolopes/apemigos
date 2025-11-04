'use client';

import { use, useEffect, useState } from 'react';
import { LongDescription } from './LongDescription';

interface Noticia {
  title: string;
  shortDescription: string;
  image: string;
  longDescription: string;
}

export default function New({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [item, setItem] = useState<Noticia | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `https://gist.githubusercontent.com/albertolopes/0af1599909d672b1ccd3a8ff327868bb/raw/noticia-${slug}.json`
        );
        if (!res.ok) throw new Error('Erro ao carregar notícia');
        const data = await res.json();
        setItem(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [slug]);

  if (!item) {
    return (
      <div className="text-center py-20 text-slate-500">
        Carregando notícia...
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="w-full h-[400px] relative">
        <img
          src={item.image}
          alt={item.title}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      </div>
      <div className="max-w-7xl mx-auto mt-[-120px] relative bg-white px-8 sm:px-20">
        <h1 className="text-center py-8 font-site">{item.title}</h1>
        <p className="text-slate-500 py-6 max-w-3xl text-lg mx-auto text-center">
          {item.shortDescription}
        </p>
        <div className="relative h-[400px]">
          <img
            src={item.image}
            alt={item.title}
            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
          />
        </div>
        <LongDescription html={item.longDescription} />
      </div>
    </div>
  );
}
