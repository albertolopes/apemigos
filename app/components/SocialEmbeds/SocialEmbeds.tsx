'use client';
import { useEffect } from 'react';

export default function SocialEmbeds() {
  useEffect(() => {
    // Load Instagram embed script if not loaded
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
    // Use parent container's width so SocialEmbeds aligns with DonateBanner
    <section className="w-full py-8">
      <div className="w-full">
        <h2 className="text-center font-site text-2xl text-orange-500 mb-4">
          Acompanhe nas redes
        </h2>

        <div className="max-w-3xl mx-auto text-center mb-6 px-4 sm:px-0">
          <p className="text-slate-600 text-sm">
            Acompanhe nossas ações nas redes sociais e participe da causa.
            Curta, compartilhe e ajude a dar voz às pessoas com Esclerose
            Múltipla.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* YouTube card */}
          <article className="bg-white border rounded-lg overflow-hidden shadow-sm flex flex-col">
            <div className="relative w-full h-56 md:h-80 lg:h-96 bg-black">
              <iframe
                title="Vídeo YouTube Apemigos"
                src="https://www.youtube.com/embed/r0tIISAZTQY"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-site text-lg text-slate-700">YouTube</h3>
              <p className="text-slate-500 my-2 text-sm flex-1">
                Inscreva-se no nosso canal para acompanhar vídeos, eventos e
                gravações das nossas ações.
              </p>
              <div className="mt-2 flex items-center justify-between">
                <a
                  href="https://www.youtube.com/@apemigosbrasilia413/videos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block btn-main bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
                >
                  Visitar canal
                </a>
                <span className="text-xs text-slate-500">
                  Assista e compartilhe
                </span>
              </div>
            </div>
          </article>

          {/* Instagram card */}
          <article className="bg-white border rounded-lg overflow-hidden shadow-sm flex flex-col">
            <div className="relative w-full h-56 md:h-80 lg:h-96 flex items-center justify-center bg-black">
              <figure className="w-full h-full flex items-center justify-center">
                <blockquote
                  className="instagram-media m-0 w-full h-full flex items-center justify-center"
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
                    className="text-slate-700 text-sm"
                  >
                    Veja no Instagram
                  </a>
                </blockquote>
              </figure>
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-site text-lg text-slate-700">Instagram</h3>
              <p className="text-slate-500 my-2 text-sm flex-1">
                Compartilhe para ajudar a ampliar nossa mensagem.
              </p>
              <div className="mt-2 flex items-center justify-between">
                <a
                  href="https://www.instagram.com/p/DNQrREWOEVa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block btn-main bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded text-sm"
                >
                  Abrir post
                </a>
                <span className="text-xs text-slate-500">
                  Siga e compartilhe
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
