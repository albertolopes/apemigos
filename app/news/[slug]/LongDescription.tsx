'use client';

type Props = {
  html: string;
};

export function LongDescription({ html }: Props) {
  // 1. Substitui &nbsp; por espaço normal
  // 2. Remove parágrafos vazios ou contendo apenas espaços/quebras que causam buracos na tela
  const cleanHtml = html
    ? html
        .replace(/&nbsp;/g, ' ')
        .replace(/<p>\s*<\/p>/g, '')
        .replace(/<p><br><\/p>/g, '')
    : '';

  return (
    <>
      <p className="text-slate-500 pt-6 max-w-3xl text-sm text-center mx-auto" />
      <div
        // [&_p]:mb-4 -> Adiciona margem inferior de 1rem (16px) em todos os parágrafos
        // [&_p:last-child]:mb-0 -> Remove a margem do último parágrafo
        // [&_img]:mx-auto -> Centraliza imagens
        // [&_img]:block -> Garante que imagens se comportem como blocos para respeitar margens
        className="text-slate-600 py-6 max-w-3xl text-sm mx-auto w-full break-words [word-break:normal] [&_p]:mb-4 [&_p:last-child]:mb-0 [&_img]:mx-auto [&_img]:block"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </>
  );
}
