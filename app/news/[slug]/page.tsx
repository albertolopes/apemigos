'use client';

import { LongDescription } from './LongDescription';

// Proteção para não sobrescrever window.ethereum se já existir e for readonly
if (
  typeof window !== 'undefined' &&
  !Object.getOwnPropertyDescriptor(window, 'ethereum')
) {
  // window.ethereum = { ...sua implementação ou objeto da carteira... };
}

export default function New({ params }: any) {
  // Exemplo de artigo jornalístico para ONG sobre esclerose múltipla
  const item = {
    title: 'Avanços e Desafios no Tratamento da Esclerose Múltipla no Brasil',
    shortDescription:
      'Especialistas e pacientes discutem novas perspectivas, desafios e conquistas no enfrentamento da esclerose múltipla.',
    image: 'https://picsum.photos/800/400',
    longDescription: `
  <p class="text-slate-500 pt-6 max-w-3xl text-sm text-center mx-auto">
    Evento reúne especialistas e pacientes: Nesta terça-feira, profissionais da saúde, pesquisadores e pessoas diagnosticadas com esclerose múltipla participaram de um encontro promovido pela nossa ONG. O objetivo foi debater os avanços recentes no tratamento da doença e compartilhar experiências de superação.
  </p>
  <p class="text-slate-500 pt-6 max-w-3xl text-sm text-center mx-auto">
    Panorama da doença no Brasil: A esclerose múltipla, doença autoimune que afeta o sistema nervoso central, atinge cerca de 35 mil brasileiros, segundo dados do Ministério da Saúde. O diagnóstico precoce e o acesso a tratamentos inovadores têm sido fundamentais para melhorar a qualidade de vida dos pacientes.
  </p>
  <p class="text-orange-700 italic pt-6 max-w-3xl text-sm text-center mx-auto">
    "O apoio multidisciplinar faz toda a diferença no cotidiano de quem convive com a esclerose múltipla", destaca a neurologista Dra. Maria Silva.
  </p>
  <p class="text-slate-500 pt-6 max-w-3xl text-sm text-center mx-auto">
    Desafios enfrentados: Apesar dos avanços, muitos pacientes ainda relatam dificuldades para obter medicamentos pelo SUS e acesso a reabilitação. A falta de informação e o preconceito também são obstáculos frequentes.
  </p>
  <p class="text-slate-500 pt-6 max-w-3xl text-sm text-center mx-auto">
    Histórias de superação: João Pereira, diagnosticado há cinco anos, conta: "Com o suporte da ONG e dos profissionais, consegui retomar minha rotina e manter minha autonomia."
  </p>
  <ul class="list-disc list-inside text-slate-500 pt-6 max-w-3xl text-sm text-center mx-auto">
    <li>Mais de 80% dos pacientes relatam melhora com acompanhamento adequado.</li>
    <li>Novos medicamentos aumentaram a expectativa de vida em 20% na última década.</li>
    <li>Campanhas de conscientização têm ampliado o diagnóstico precoce.</li>
  </ul>
  <p class="text-slate-500 pt-6 max-w-3xl text-sm text-center mx-auto">
    Próximos passos: Ao final do evento, foram anunciadas novas iniciativas de apoio, grupos de acolhimento e ações de advocacy para garantir direitos e ampliar o acesso ao tratamento.
  </p>
  <p class="text-slate-500 pt-6 max-w-3xl text-sm text-center mx-auto">
    Para saber mais sobre nossos projetos e próximos eventos, acompanhe nossas redes sociais e visite nosso portal.
  </p>
`,
  };

  return (
    <div className="relative">
      <div className="w-full h-[400px] relative">
        <img
          src="https://picsum.photos/1920/492"
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
