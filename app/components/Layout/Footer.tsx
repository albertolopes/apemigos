import './footer.css';
import { Logo } from '@app/components/Logo/Logo';
import testIds from '@app/utils/test-ids';

const Footer = () => (
  <footer
    className="m-h-56 leading-7 sm:p-14 font-site"
    data-testid={testIds.LAYOUT.FOOTER}
  >
    <div className="flex flex-col sm:flex-row">
      <div className="basis-2/3 bg-orange-500 text-white p-14 sm:pl-44">
        <h2 className="text-2xl sm:text-3xl font-bold">Fale Conosco</h2>
        <div className="flex flex-col sm:flex-row text-sm font-helvetica">
          <div className="basis-1/3 border-b border-white pb-4">
            <p className="mt-10">
              Estamos aqui para ouvir você. Se tiver dúvidas, sugestões ou
              quiser compartilhar sua experiência, entre em contato.
            </p>
            <p className="mt-10">Apoio à Comunidade de Esclerose Múltipla</p>
          </div>
          <div className="basis-1/3"></div>
          <div className="basis-1/2 border-b border-white pb-4">
            <p className="mt-10">
              Rua da Saúde, 123 <br /> Brasília - DF
            </p>
            <p className="mt-10">Telefone: (61) 0000-0000</p>
            <p className="mt-10">Email: contato@esclerosevida.org</p>
          </div>
        </div>
      </div>
      <div className="basis-1/3 bg-gray-200 p-14 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">Fique Informado</h2>
        <p className="mt-6 text-slate-500">
          Cadastre seu e-mail e receba novidades, informações e conteúdos sobre
          esclerose múltipla.
        </p>
        <input
          type="email"
          className="my-6 w-3/4 block mx-auto bg-transparent border-0 border-b border-orange-500 text-orange-500"
          placeholder="Email Address"
        />
        <a href="" className="text-slate-500 py-6 font-site">
          Inscreva-se
        </a>
      </div>
    </div>
    <div className="mx-auto text-center sm:text-xs mt-6">
      {/*<Logo />*/}
      <p className="font-default mb-10">
        © 2025 Apemigos. Desenvolvido por{' '}
        <a
          href="https://github.com/albertolopes"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-500"
        >
          Alberto Lopes
        </a>
      </p>
    </div>
  </footer>
);

export default Footer;
