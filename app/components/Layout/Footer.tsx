import './footer.css';
import { Logo } from '@app/components/Logo/Logo';
import testIds from '@app/utils/test-ids';

const Footer = () => (
  <footer
    className="m-h-56 leading-7 sm:px-14 sm:pt-14 font-site"
    data-testid={testIds.LAYOUT.FOOTER}
  >
    <div className="flex flex-col sm:flex-row">
      <div className="w-full bg-orange-500 text-white p-14 sm:pl-44">
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
              Qnd 28, lote 21, loja 1 <br /> Comercial Norte Taguatinga
            </p>
            <p className="mt-10">Telefone: (61) 99217-6669</p>
            <p className="mt-10">Email: apemigos.em@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
    <div className="mx-auto text-center text-[12px] sm:text-xs mt-4">
      {/*<Logo />*/}
      <p className="font-default mb-4 text-slate-500">
        © 2025 Apemigos. Desenvolvido por{' '}
        <a
          href="https://github.com/albertolopes"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-500"
        >
          Avocado Tech
        </a>
      </p>
    </div>
  </footer>
);

export default Footer;
