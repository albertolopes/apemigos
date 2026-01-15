import Image from 'next/image';

export default async function About() {
  return (
    <div className="relative">
      <div className="w-full h-[400px] relative">
        <Image
          src="https://i.imgur.com/80zkthg.jpeg"
          alt="banner ONG Esclerose Múltipla"
          fill
          style={{ objectFit: 'cover' }}
          unoptimized
        />
      </div>
      <div className="max-w-7xl mx-auto mt-[-120px] relative bg-white px-8 sm:px-20">
        <h1 className="text-center py-8 font-site">Sobre a Apemigos</h1>
        <p className="text-slate-600 pt-6 max-w-3xl text-center mx-auto">
          Fundada e presidida por Ana Paula Morais, a associação nasceu da
          necessidade de unir pacientes que enfrentam os desafios de uma doença
          crônica e, muitas vezes, &quot;invisível&quot;. A EM é uma doença
          autoimune que atinge o sistema nervoso central e o suporte entre pares
          é vital.
        </p>

        <div className="mx-auto sm:text-base mt-8 space-y-8">
          <section>
            <h2 className="text-orange-500 text-lg font-site mb-2 text-center">
              Missão
            </h2>
            <p className="text-slate-600 pt-6 max-w-3xl text-center mx-auto">
              Promover a qualidade de vida e a inclusão social das pessoas com
              esclerose múltipla e doenças raras no Distrito Federal, oferecendo
              apoio biopsicossocial, disseminando informações qualificadas e
              lutando pela garantia de direitos e pelo acesso universal a
              tratamentos adequados.
            </p>
          </section>

          <section>
            <h2 className="text-orange-500 text-lg font-site mb-2 text-center">
              Visão
            </h2>
            <p className="text-slate-600 pt-6 max-w-3xl text-center mx-auto">
              Ser a principal referência no Distrito Federal no suporte e defesa
              de pacientes com doenças raras e desmielinizantes, sendo
              reconhecida pela excelência no acolhimento, pela influência em
              políticas públicas e por contribuir para uma sociedade mais
              informada e sem preconceitos.
            </p>
          </section>

          <section>
            <h2 className="text-orange-500 text-lg font-site mb-2 text-center">
              Valores
            </h2>
            <div className="text-slate-600 pt-6 max-w-3xl text-center mx-auto">
              <p>
                <strong>Empatia e Acolhimento:</strong> Olhar para cada
                indivíduo com humanidade, entendendo suas limitações e
                potencialidades.
              </p>

              <p>
                <strong>Ética e Transparência:</strong> Atuar com integridade em
                todas as ações e na gestão dos recursos da associação.
              </p>

              <p>
                <strong>Protagonismo do Paciente:</strong> Valorizar a voz e a
                autonomia da pessoa com doença rara em sua jornada de tratamento
                e na sociedade.
              </p>

              <p>
                <strong>Compromisso com a Ciência:</strong> Basear nossas
                orientações e defesas em evidências científicas atualizadas.
              </p>

              <p>
                <strong>Solidariedade e União:</strong> Fortalecer a rede de
                apoio entre pacientes, familiares, cuidadores e profissionais de
                saúde.
              </p>

              <p>
                <strong>Advocacy (Defesa de Direitos):</strong> Atuar
                incansavelmente junto aos órgãos públicos para garantir o
                cumprimento das leis e o acesso à saúde.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
