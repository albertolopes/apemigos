import Image from 'next/image';
import testIds from '@app/utils/test-ids';
import SocialEmbeds from './components/SocialEmbeds/SocialEmbeds';
import DonateBanner from './components/DonateBanner/DonateBanner';

export default function Home() {
  return (
    <div className="mx-auto relative sm:px-20 py-5">
      <div className="text-center w-full relative">
        <div className="absolute top-0 left-0 h-[200px] sm:h-[calc(100%-55px)] w-full bg-black opacity-50"></div>
        <video
          autoPlay
          muted
          loop
          className="w-full h-[200px] sm:h-[500px] md:h-[650px] lg:h-[750px] object-cover"
        >
          <source src="https://i.imgur.com/3VEt8SW.mp4" type="video/mp4" />
        </video>
        <div className="absolute top-[40px] right-[30px] sm:top-2/4 sm:left-2/4 text-white sm:translate-y-[-50%] sm:translate-x-[-50%] font-site">
          <h2 className="sm:text-4xl mb-4">Informar é cuidar</h2>
          <h1 className="sm:text-[90px] sm:leading-[90px]">
            NMO e Esclerose Múltipla
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row relative items-center bg-white mt-[-10px] sm:mt-[-55px] mx-auto max-w-xs sm:max-w-4xl border-t-4 border-orange-500 font-site">
          <h3 className="flex-1 sm:text-3xl py-4 px-8 text-center sm:text-left">
            Juntos por mais informação, apoio e esperança
          </h3>
          <a
            href="/contact"
            className="btn-main sm:text-2xl sm:p-8 hover:bg-slate-600 w-fit"
          >
            Clique aqui
          </a>
        </div>
      </div>

      <div
        className="flex mt-12 sm:mt-32 sm:gap-12 flex-col sm:flex-row"
        data-testid={testIds.HOME_PAGE.HIGHLIGHTS}
      >
        <div className="basis-1/3">
          <div className="h-[370px] relative">
            <Image
              src="https://i.imgur.com/c9pi1XC.jpeg"
              alt="projects"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="border-y-4 border-orange-500 p-8 sm:w-60 relative bg-white sm:mt-[-300px]">
            <h3 className="text-2xl font-site">Nossas Iniciativas</h3>
            <p className="text-slate-500 my-6 text-sm">
              Trabalhamos para oferecer informação clara, apoio emocional e
              oportunidades de conexão para pessoas que convivem com a esclerose
              múltipla. Conheça nossos projetos e veja como você pode participar
              dessa rede de solidariedade.
            </p>
            <a
              href="/projects"
              className="text-slate-500 py-6 font-site"
              data-testid={testIds.HOME_PAGE.OUR_INITIATIVES_CTA}
            >
              Clique aqui
            </a>
          </div>
        </div>
        <div className="basis-2/3">
          <div className="h-[370px] relative">
            <Image
              src="https://i.imgur.com/80zkthg.jpeg"
              alt="projects"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="border-y-4 border-orange-500 p-8 sm:w-60 relative bg-white sm:ml-32 sm:mt-[-430px]">
            <h3 className="text-2xl font-site">Sobre a Apemigos</h3>
            <p className="text-slate-500 my-6 text-sm">
              Fundada e presidida por Ana Paula Morais, a Apemigos oferece
              suporte biopsicossocial, promove inclusão social e dissemina
              informação qualificada para pessoas com esclerose múltipla e
              doenças raras no Distrito Federal, defendendo direitos e o acesso
              a tratamentos com base em empatia, ética, ciência, solidariedade e
              protagonismo do paciente.
            </p>
            <a href="/about" className="text-slate-500 py-6 font-site">
              Clique aqui
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:mt-32 mb-12 sm:gap-12">
        <div className="basis-2/3">
          <div className="h-[370px] sm:h-[470px] relative">
            <Image
              src="https://i.imgur.com/khWgFyK.jpeg"
              alt="projects"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="border-y-4 border-orange-500 p-8 sm:w-60 relative bg-white sm:ml-44 sm:mt-[-230px]">
            <h3 className="text-2xl font-site">Notícias Recentes</h3>
            <p className="text-slate-500 my-6 text-sm">
              Acompanhe as últimas notícias, descobertas científicas e avanços
              no tratamento da esclerose múltipla. Mantemos você informado sobre
              tudo que pode impactar sua qualidade de vida.
            </p>
            <a href="/news" className="text-slate-500 py-6 font-site">
              Clique aqui
            </a>
          </div>
        </div>
        <div className="basis-1/3">
          <div className="h-[370px] sm:h-[470px] relative">
            <Image
              src="https://i.imgur.com/ZN56KWD.png"
              alt="projects"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="border-y-4 border-orange-500 p-8 sm:w-60 relative bg-white sm:ml-32 sm:mt-[-530px]">
            <h3 className="text-2xl font-site">Cartão da pessoa com EM</h3>
            <p className="text-slate-500 my-6 text-sm">
              O Cartão da Pessoa com Esclerose Múltipla auxilia na identificação
              da condição em estabelecimentos públicos e privados. Solicite o
              seu e tenha mais segurança e facilidade no acesso a serviços.
            </p>
            <a href="/association" className="text-slate-500 py-6 font-site">
              Clique aqui
            </a>
          </div>
        </div>
      </div>
      <DonateBanner />
      <SocialEmbeds />
    </div>
  );
}
