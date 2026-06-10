import Image from 'next/image';

const pillars = [
  {
    title: 'Missao',
    text: 'Promover qualidade de vida e inclusao social para pessoas com esclerose multipla e doencas raras no Distrito Federal, oferecendo apoio biopsicossocial, informacao qualificada e defesa do acesso a tratamentos adequados.',
  },
  {
    title: 'Visao',
    text: 'Ser referencia no Distrito Federal no acolhimento, suporte e defesa de pacientes com doencas raras e desmielinizantes, contribuindo para uma sociedade mais informada e sem preconceitos.',
  },
  {
    title: 'Atuacao',
    text: 'Conectar pacientes, familiares, cuidadores, profissionais e parceiros por meio de informacao, campanhas, projetos, apoio entre pares e articulacao por direitos.',
  },
];

const values = [
  {
    title: 'Empatia e acolhimento',
    text: 'Olhar para cada pessoa com humanidade, respeitando limites, historias e necessidades reais.',
  },
  {
    title: 'Etica e transparencia',
    text: 'Atuar com responsabilidade, integridade e clareza na gestao e nas relacoes institucionais.',
  },
  {
    title: 'Protagonismo do paciente',
    text: 'Valorizar a voz, a autonomia e a participacao da pessoa com doenca rara na propria jornada.',
  },
  {
    title: 'Compromisso com a ciencia',
    text: 'Basear orientacoes, campanhas e defesas em informacao qualificada e evidencias atualizadas.',
  },
  {
    title: 'Solidariedade e uniao',
    text: 'Fortalecer redes de apoio entre pacientes, familiares, cuidadores e profissionais de saude.',
  },
  {
    title: 'Advocacy',
    text: 'Defender direitos e dialogar com o poder publico para ampliar acesso, respeito e cuidado.',
  },
];

export default async function About() {
  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-white">
        <div className="relative h-[320px] w-full sm:h-[430px]">
          <Image
            src="https://i.imgur.com/fldeUnR.jpeg"
            alt="Sobre a Apemigos"
            fill
            className="object-cover"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-black/35" />
        </div>

        <div className="max-w-7xl mx-auto relative mt-[-120px] px-6 sm:px-20">
          <div className="max-w-4xl border-t-4 border-orange-500 bg-white p-8 shadow-sm sm:p-12">
            <p className="font-site text-sm uppercase tracking-[0.25em] text-orange-500">
              Nossa historia
            </p>
            <h1 className="mt-4 font-site text-5xl leading-tight text-slate-700 sm:text-7xl">
              Sobre a Apemigos
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-500">
              A Apemigos nasceu da necessidade de unir, orientar e acolher
              pessoas que convivem com esclerose multipla e doencas raras. Nosso
              trabalho fortalece uma rede de apoio no Distrito Federal, com
              informacao, escuta e defesa de direitos.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12 sm:px-20 sm:py-16">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="border-t-4 border-orange-500 bg-white p-6 shadow-sm sm:p-8">
            <p className="font-site text-sm uppercase tracking-[0.2em] text-orange-500">
              Quem somos
            </p>
            <h2 className="mt-2 font-site text-3xl text-slate-700">
              Informar tambem e cuidar
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              Fundada e presidida por Ana Paula Morais, a associacao surgiu para
              aproximar pacientes que enfrentam os desafios de uma condicao
              cronica e, muitas vezes, invisivel. A esclerose multipla e uma
              doenca autoimune que atinge o sistema nervoso central, e o suporte
              entre pares pode fazer diferenca na vida de quem acabou de receber
              um diagnostico ou ja convive com a doenca ha anos.
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              A Apemigos atua para que pacientes, familiares e cuidadores tenham
              acesso a informacao clara, acolhimento, conexao comunitaria e
              orientacao sobre caminhos de cuidado e direitos.
            </p>
          </div>

          <aside className="border-t-4 border-orange-500 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-site text-3xl text-slate-700">
              Para quem atuamos?
            </h2>
            <ul className="mt-5 space-y-3">
              {[
                'Pessoas com esclerose multipla',
                'Pessoas com doencas raras',
                'Familiares e cuidadores',
                'Profissionais, parceiros e apoiadores da causa',
              ].map((item) => (
                <li key={item} className="text-sm leading-6 text-slate-500">
                  <span className="mr-2 font-site text-orange-500">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="border-t-4 border-orange-500 bg-white p-6 shadow-sm"
            >
              <h2 className="font-site text-3xl text-slate-700">
                {pillar.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-500">
                {pillar.text}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="h-fit border-t-4 border-orange-500 bg-white p-6 shadow-sm sm:p-8">
            <p className="font-site text-sm uppercase tracking-[0.2em] text-orange-500">
              Valores
            </p>
            <h2 className="mt-2 font-site text-3xl text-slate-700">
              O que orienta nosso trabalho
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              Nossos valores ajudam a manter a associacao focada no que importa:
              cuidado humano, informacao responsavel e defesa concreta das
              pessoas que convivem com doencas raras e desmielinizantes.
            </p>
          </aside>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((value) => (
              <article
                key={value.title}
                className="border-l-4 border-orange-500 bg-white p-5 shadow-sm"
              >
                <h3 className="font-site text-xl text-slate-700">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {value.text}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
