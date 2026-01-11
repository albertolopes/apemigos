"use client";
import { useEffect } from "react";

export default function SocialEmbeds() {
  useEffect(() => {
    // Load Instagram embed script if not loaded
    if (typeof window === "undefined") return;
    const anyWin = window as any;
    if (!anyWin.instgrm) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
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
    // restore larger container and aspect ratios (before diminutions)
    <section className="max-w-7xl mx-auto mt-12 px-4 sm:px-0 pb-20">
      <h2 className="text-center font-site text-2xl text-orange-500 mb-6">
        Acompanhe nas redes
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* YouTube embed (single video) - fixed identical heights with Instagram */}
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <div className="relative h-[220px] md:h-[420px]">
            <iframe
              title="Vídeo YouTube Apemigos"
              src="https://www.youtube.com/embed/r0tIISAZTQY"
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-4">
            <h3 className="font-site text-lg text-slate-700">YouTube</h3>
            <p className="text-slate-500 my-2 text-sm">
              Inscreva-se no nosso canal para acompanhar vídeos, eventos e
              gravações das nossas ações.
            </p>
            <a
              href="https://www.youtube.com/@apemigosbrasilia413/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block btn-main bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Visitar canal
            </a>
          </div>
        </div>

        {/* Instagram embed (Reel) - only the post, aligned and larger */}
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm p-4 flex items-start justify-center h-[220px] md:h-[572px] overflow-auto">
          <blockquote
            className="instagram-media"
            data-instgrm-permalink="https://www.instagram.com/reel/DOHUpJ2kqkG/"
            data-instgrm-version="14"
            style={{ background: '#FFF', border: 0, margin: 0, padding: 0 }}
          >
            <a
              href="https://www.instagram.com/reel/DOHUpJ2kqkG/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 text-sm"
            >
              Veja no Instagram
            </a>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
