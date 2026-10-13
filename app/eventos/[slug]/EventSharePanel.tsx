'use client';

import { useEffect, useMemo, useState } from 'react';

const siteUrl = 'https://apemigosbrasil.org.br';

export function EventSharePanel({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const fallbackUrl = `${siteUrl}/eventos/${slug}`;
  const [eventUrl, setEventUrl] = useState(fallbackUrl);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setEventUrl(window.location.href);
  }, []);

  const qrCodeUrl = useMemo(
    () =>
      `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=16&data=${encodeURIComponent(
        eventUrl
      )}`,
    [eventUrl]
  );

  async function shareEvent() {
    const shareData = {
      title,
      text: `Confira este evento da Apemigos: ${title}`,
      url: eventUrl,
    };

    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await copyEventUrl();
  }

  async function copyEventUrl() {
    await navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  return (
    <aside className="mt-10 border border-slate-200 bg-slate-50 p-5">
      <div className="grid gap-6 md:grid-cols-[180px_1fr] md:items-center">
        <img
          src={qrCodeUrl}
          alt={`QR code para compartilhar o evento ${title}`}
          className="h-44 w-44 bg-white p-2"
          loading="lazy"
        />
        <div>
          <h2 className="font-site text-xl text-slate-800">
            Compartilhe o evento
          </h2>
          <p className="mt-2 break-all text-sm text-slate-600">{eventUrl}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={shareEvent} className="btn-main">
              Compartilhar evento
            </button>
            <button
              type="button"
              onClick={copyEventUrl}
              className="border border-slate-300 px-5 py-3 font-site text-sm text-slate-700 transition hover:border-orange-500 hover:text-orange-600"
            >
              {copied ? 'Link copiado' : 'Copiar link'}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
