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
    <div
      className="
        text-slate-600 
        py-6 
        max-w-4xl 
        text-base 
        mx-auto 
        w-full 
        break-words 
        [word-break:normal] 
        leading-relaxed
        
        /* Reset de tamanhos de fonte inline do HTML retornado */
        [&_*]:!text-base
        
        /* Espaçamento entre parágrafos */
        [&_p]:mb-4 
        [&_p:last-child]:mb-0 
        
        /* Estilização de Títulos - Forçamos o tamanho desejado mesmo que o HTML traga outro */
        [&_h2]:!text-xl 
        [&_h2]:md:!text-2xl 
        [&_h2]:font-site 
        [&_h2]:text-orange-500 
        [&_h2]:mt-10 
        [&_h2]:mb-4 
        [&_h2]:leading-tight
        
        [&_h3]:!text-lg 
        [&_h3]:md:!text-xl 
        [&_h3]:font-site 
        [&_h3]:text-slate-600
        [&_h3]:mt-8 
        [&_h3]:mb-3
        
        /* Estilização de Listas */
        [&_ul]:list-disc 
        [&_ul]:pl-6 
        [&_ul]:mb-6 
        [&_ul]:space-y-2
        
        [&_li]:pl-1
        [&_li_p]:!text-base
        [&_li_p]:mb-0 
        
        /* Imagens */
        [&_img]:mx-auto 
        [&_img]:block 
        [&_img]:rounded-xl 
        [&_img]:shadow-md 
        [&_img]:my-8
        
        /* Ênfase */
        [&_strong]:text-slate-800
        [&_strong]:font-bold
      "
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
