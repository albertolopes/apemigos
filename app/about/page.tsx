import Image from 'next/image';

export default async function About() {
  return (
    <div className="relative">
      <div className="w-full h-[400px] relative">
        <Image
          src="https://static.wixstatic.com/media/0b340f_c407b331d71449afa40b30f6efb200aa~mv2_d_5580_4160_s_4_2.jpg/v1/fill/w_1920,h_492,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/0b340f_c407b331d71449afa40b30f6efb200aa~mv2_d_5580_4160_s_4_2.jpg"
          alt="projects"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="max-w-7xl mx-auto mt-[-120px] relative bg-white px-8 sm:px-20">
        <h1 className="text-center py-8 font-site">
          Sobre a Esclerose Múltipla
        </h1>
        <p className="text-slate-500 pt-6 max-w-3xl text-sm text-center mx-auto">
          A Esclerose Múltipla (EM) é uma doença autoimune crônica que afeta o
          sistema nervoso central. O sistema imunológico ataca a camada de
          mielina que protege os neurônios, prejudicando a comunicação entre o
          cérebro e o resto do corpo. A EM pode causar sintomas variados,
          incluindo fadiga, dificuldade de coordenação, alterações visuais e
          problemas de memória.
        </p>
        <p className="text-slate-500 pt-6 max-w-3xl text-sm text-center mx-auto">
          A causa exata da Esclerose Múltipla ainda não é totalmente
          compreendida, mas fatores genéticos, ambientais e imunológicos parecem
          contribuir para o seu desenvolvimento. O diagnóstico precoce e o
          acompanhamento médico adequado são essenciais para controlar os
          sintomas e reduzir a progressão da doença.
        </p>
        <p className="text-slate-500 pt-6 max-w-3xl text-sm text-center mx-auto">
          Atualmente, existem tratamentos que ajudam a reduzir surtos, retardar
          a evolução da doença e melhorar a qualidade de vida dos pacientes.
          Além disso, mudanças no estilo de vida, fisioterapia e apoio
          psicológico podem ser muito benéficos.
        </p>
        <h2 className="text-center text-4xl my-12 sm:my-20 font-site">
          Objetivos de Conhecimento e Apoio à Esclerose Múltipla
        </h2>
        <div className="flex flex-col sm:flex-row gap-12 justify-around text-center">
          <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
            <svg
              className="w-12 h-12 text-purple-500 mb-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
            </svg>
            <span className="text-slate-500 font-site text-lg">
              Aumentar a conscientização sobre a Esclerose Múltipla,
              esclarecendo sintomas, causas e formas de prevenção.
            </span>
          </div>

          <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
            <svg
              className="w-12 h-12 text-green-500 mb-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span className="text-slate-500 font-site text-lg">
              Apoiar pacientes e famílias com informações úteis, recursos e
              estratégias para lidar com a doença no dia a dia.
            </span>
          </div>

          <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
            <svg
              className="w-12 h-12 text-blue-500 mb-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L2 7l10 5 10-5-10 5zm0 3.5v7l10-5-10-5z" />
            </svg>
            <span className="text-slate-500 font-site text-lg">
              Promover pesquisas, novos tratamentos e práticas que melhorem a
              qualidade de vida de quem vive com Esclerose Múltipla.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
