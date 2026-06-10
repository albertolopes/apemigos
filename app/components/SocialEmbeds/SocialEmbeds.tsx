'use client';
import { useEffect } from 'react';

export default function SocialEmbeds() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const anyWin = window as any;
    if (!anyWin.instgrm) {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.onload = () => {
        try {
          anyWin.instgrm?.Embeds?.process();
        } catch (e) {
          // ignore
        }
      };
      document.body.appendChild(script);
    } else {
      try {
        anyWin.instgrm?.Embeds?.process();
      } catch (e) {
        // ignore
      }
    }
  }, []);

  return (
    <section className="w-full py-8">
      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="h-fit border-t-4 border-orange-500 bg-white p-6 shadow-sm sm:p-8">
          <p className="font-site text-sm uppercase tracking-[0.2em] text-orange-500">
            Redes sociais
          </p>
          <h2 className="mt-2 font-site text-3xl text-slate-700">
            Acompanhe nas redes
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            As redes da Apemigos aproximam pacientes, familiares e apoiadores.
            Use esses canais para acompanhar a rotina da associacao,
            compartilhar informacao e fortalecer a causa.
          </p>
          <div className="mt-6 bg-orange-50 p-4">
            <p className="font-site text-lg text-slate-700">
              Compartilhar tambem e apoiar.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Um post enviado para a pessoa certa pode virar orientacao,
              acolhimento ou acesso a uma rede de suporte.
            </p>
          </div>
        </aside>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="bg-white shadow-sm">
            <div className="relative h-56 w-full bg-black md:h-72 lg:h-80">
              <iframe
                title="Vídeo YouTube Apemigos"
                src="https://www.youtube.com/embed/r0tIISAZTQY"
                className="absolute inset-0 h-full w-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-5 sm:p-6">
              <p className="font-site text-xs uppercase tracking-[0.2em] text-orange-500">
                Video
              </p>
              <h3 className="mt-2 font-site text-2xl text-slate-700">
                YouTube
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Entrevistas, eventos e conversas para assistir, rever e
                compartilhar com quem precisa de informacao confiavel.
              </p>
              <a
                href="https://www.youtube.com/@apemigosbrasilia413/videos"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block font-site text-sm text-slate-500 underline decoration-orange-500 underline-offset-4 hover:text-orange-500"
              >
                Visitar canal
              </a>
            </div>
          </article>

          <article className="bg-white shadow-sm">
            <div className="relative flex h-56 w-full items-center justify-center bg-black md:h-72 lg:h-80">
              <figure className="flex h-full w-full items-center justify-center">
                <blockquote
                  className="instagram-media m-0 flex h-full w-full items-center justify-center"
                  data-instgrm-permalink="https://www.instagram.com/p/DNQrREWOEVa"
                  data-instgrm-version="14"
                  style={{
                    background: '#FFF',
                    border: 0,
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <a
                    href="https://www.instagram.com/p/DNQrREWOEVa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-700"
                  >
                    Veja no Instagram
                  </a>
                </blockquote>
              </figure>
            </div>
            <div className="p-5 sm:p-6">
              <p className="font-site text-xs uppercase tracking-[0.2em] text-orange-500">
                Comunidade
              </p>
              <h3 className="mt-2 font-site text-2xl text-slate-700">
                Instagram
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Campanhas, bastidores e chamados para participacao em uma
                linguagem simples, feita para circular.
              </p>
              <a
                href="https://www.instagram.com/p/DNQrREWOEVa"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block font-site text-sm text-slate-500 underline decoration-orange-500 underline-offset-4 hover:text-orange-500"
              >
                Abrir post
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
