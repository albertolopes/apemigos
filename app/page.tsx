import { CarouselClient } from '@app/components/Carousel/Carousel';
import Image from 'next/image';
import testIds from '@app/utils/test-ids';

export default function Home() {
  return (
    <div className="mx-auto relative sm:px-20 py-5">
      <div className="text-center w-full relative">
        <div className="absolute top-0 left-0 h-[200px] sm:h-[calc(100%-55px)] w-full bg-black opacity-50"></div>
        <video autoPlay muted loop className="w-full h-[200px] sm:h-fit">
          <source
            src="https://video.wixstatic.com/video/0b340f_b4aaabafff194cf6ac9ee5511f58099d/720p/mp4/file.mp4"
            type="video/mp4"
          />
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
            SAIBA MAIS
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
              src="https://static.wixstatic.com/media/0b340f_d146a1cff38b4503ae5e6ccc9aa86368~mv2_d_5184_3456_s_4_2.jpg/v1/fill/w_434,h_460,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/0b340f_d146a1cff38b4503ae5e6ccc9aa86368~mv2_d_5184_3456_s_4_2.jpg"
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
              Saiba Mais
            </a>
          </div>
        </div>
        <div className="basis-2/3">
          <div className="h-[370px] relative">
            <Image
              src="https://static.wixstatic.com/media/0b340f_c407b331d71449afa40b30f6efb200aa~mv2_d_5580_4160_s_4_2.jpg/v1/fill/w_615,h_460,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/0b340f_c407b331d71449afa40b30f6efb200aa~mv2_d_5580_4160_s_4_2.jpg"
              alt="projects"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="border-y-4 border-orange-500 p-8 sm:w-60 relative bg-white sm:ml-32 sm:mt-[-430px]">
            <h3 className="text-2xl font-site">Nossa Missão</h3>
            <p className="text-slate-500 my-6 text-sm">
              Acreditamos que informação de qualidade e apoio constante são
              essenciais para transformar a vida de quem enfrenta a esclerose
              múltipla. Nosso compromisso é compartilhar conhecimento, promover
              pesquisas e fortalecer a comunidade para que todos tenham mais
              qualidade de vida e esperança no futuro.
            </p>
            <a href="/about" className="text-slate-500 py-6 font-site">
              Saiba Mais
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:mt-32 mb-12 sm:gap-12">
        <div className="basis-2/3">
          <div className="h-[370px] sm:h-[470px] relative">
            <Image
              src="https://static.wixstatic.com/media/0b340f_0b4d1813105145bfa782ce1d7a379151~mv2_d_5760_3840_s_4_2.jpg/v1/fill/w_682,h_568,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/0b340f_0b4d1813105145bfa782ce1d7a379151~mv2_d_5760_3840_s_4_2.jpg"
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
              Read More
            </a>
          </div>
        </div>
        <div className="basis-1/3">
          <div className="h-[370px] sm:h-[470px] relative">
            <Image
              src="https://static.wixstatic.com/media/0b340f_a075ec7cf76b4b479b4b482e44a88c43~mv2_d_3840_5760_s_4_2.jpg/v1/fill/w_486,h_568,al_tr,q_80,usm_0.66_1.00_0.01,enc_auto/0b340f_a075ec7cf76b4b479b4b482e44a88c43~mv2_d_3840_5760_s_4_2.jpg"
              alt="projects"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="border-y-4 border-orange-500 p-8 sm:w-60 relative bg-white sm:ml-32 sm:mt-[-530px]">
            <h3 className="text-2xl font-site">Participe</h3>
            <p className="text-slate-500 my-6 text-sm">
              Sua participação faz a diferença. Seja como voluntário, parceiro
              ou apoiador, cada contribuição ajuda a fortalecer a comunidade e a
              levar esperança a quem convive com a esclerose múltipla.
            </p>
            <a href="/contact" className="text-slate-500 py-6 font-site">
              Read More
            </a>
          </div>
        </div>
      </div>
      <CarouselClient />
    </div>
  );
}
