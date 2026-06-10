import Image from 'next/image';
import testIds from '@app/utils/test-ids';
import SocialEmbeds from './components/SocialEmbeds/SocialEmbeds';
import DonateBanner from './components/DonateBanner/DonateBanner';
import Link from 'next/link';
import RecentNews from '@app/components/RecentNews/RecentNews';

export default function Home() {
  return (
    <div className="mx-auto relative sm:px-20 py-2">
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
            Esclerose Múltipla e Doenças Raras
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row relative items-center bg-white mt-[-10px] sm:mt-[-55px] mx-auto max-w-xs sm:max-w-4xl border-t-4 border-orange-500 font-site">
          <h3 className="flex-1 sm:text-3xl py-4 px-8 text-center sm:text-left">
            Juntos por mais informação, apoio e esperança
          </h3>
          <Link
            href="/contact"
            className="btn-main sm:text-2xl sm:p-8 hover:bg-slate-600 w-fit"
          >
            Clique aqui
          </Link>
        </div>
      </div>

      <div
        className="flex mt-6 sm:mt-16 sm:gap-6 flex-col sm:flex-row"
        data-testid={testIds.HOME_PAGE.HIGHLIGHTS}
      >
        <div className="basis-1/3">
          <div className="h-[370px] relative">
            <Image
              src="https://i.imgur.com/b3jGnWx.jpeg"
              alt="projects"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="border-y-4 border-orange-500 p-8 sm:w-60 relative bg-white sm:mt-[-300px]">
            <h3 className="text-2xl text-slate-700 font-site">
              Nossas Iniciativas
            </h3>
            <p className="text-slate-500 my-6 text-sm">
              Trabalhamos para oferecer informação clara, apoio emocional e
              oportunidades de conexão para pessoas que convivem com a esclerose
              múltipla. Conheça nossos projetos e veja como você pode participar
              dessa rede de solidariedade.
            </p>
            <Link
              href="/projects"
              className="text-orange-500 py-6 font-site"
              data-testid={testIds.HOME_PAGE.OUR_INITIATIVES_CTA}
            >
              Clique aqui
            </Link>
          </div>
        </div>
        <div className="basis-2/3">
          <div className="h-[370px] relative">
            <Image
              src="https://i.imgur.com/fldeUnR.jpeg"
              alt="projects"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="border-y-4 border-orange-500 p-8 sm:w-60 relative bg-white sm:ml-32 sm:mt-[-430px]">
            <h3 className="text-2xl text-slate-700 font-site">
              Sobre a Apemigos
            </h3>
            <p className="text-slate-500 my-6 text-sm">
              Fundada e presidida por Ana Paula Morais, a Apemigos oferece
              suporte biopsicossocial, promove inclusão social e dissemina
              informação qualificada para pessoas com esclerose múltipla e
              doenças raras no Distrito Federal, defendendo direitos e o acesso
              a tratamentos com base em empatia, ética, ciência, solidariedade e
              protagonismo do paciente.
            </p>
            <Link href="/about" className="text-orange-500 py-6 font-site">
              Clique aqui
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:mt-32 mb-12 sm:gap-12">
        <div className="basis-2/3">
          <div className="h-[370px] sm:h-[470px] relative">
            <Image
              src="https://i.imgur.com/imnveaL.png"
              alt="projects"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="border-y-4 border-orange-500 p-8 sm:w-60 relative bg-white sm:ml-44 sm:mt-[-230px]">
            <h3 className="text-2xl text-slate-700 font-site">
              Notícias Recentes
            </h3>
            <p className="text-slate-500 my-6 text-sm">
              Acompanhe as últimas notícias, descobertas científicas e avanços
              no tratamento da esclerose múltipla. Mantemos você informado sobre
              tudo que pode impactar sua qualidade de vida.
            </p>
            <Link href="/news" className="text-orange-500 py-6 font-site">
              Clique aqui
            </Link>
          </div>
        </div>
        <div className="basis-1/3">
          <div className="h-[370px] sm:h-[470px] relative">
            <Image
              src="https://i.imgur.com/8vMvIzd.png"
              alt="projects"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="border-y-4 border-orange-500 p-8 sm:w-60 relative bg-white sm:ml-32 sm:mt-[-530px]">
            <h3 className="text-2xl text-slate-700 font-site">
              Alto Custo sem labirinto
            </h3>
            <p className="text-slate-500 my-6 text-sm">
              Guia facilitado para entender o CEAF/Alto Custo no Distrito
              Federal, encontrar formularios oficiais, conferir sua condicao e
              organizar os documentos antes de protocolar ou agendar.
            </p>
            <Link href="/alto-custo" className="text-orange-500 py-6 font-site">
              Clique aqui
            </Link>
          </div>
        </div>
      </div>
      <RecentNews />
      <DonateBanner />
      <SocialEmbeds />
    </div>
  );
}
