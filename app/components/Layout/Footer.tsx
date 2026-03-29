import './footer.css';
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
    <div className="mx-auto text-center text-[12px] sm:text-xs mt-4 pb-8 relative">
      <div className="font-default mb-4 text-slate-500">
        © 2025 Apemigos. Desenvolvido por{' '}
        <a
          href="https://avocadotech.site"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-500"
        >
          Avocado Tech
        </a>{' '}
        com{' '}
        <span className="inline-block animate-pulse cursor-help text-red-500 hover:scale-125 transition-transform duration-300 relative group">
          ❤️
          {/* Easter Egg Tooltip - Corrigido erro de hidratação (div dentro de p) */}
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-slate-800 text-white rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 text-left border border-slate-700 pointer-events-none font-sans block">
            <span className="flex items-center gap-1 mb-0.5 border-b border-slate-600/50 pb-1">
              <span className="text-sm">👨‍💻</span>
              <span className="font-bold text-white text-[10px] uppercase tracking-wider">
                Sobre o Desenvolvedor
              </span>
            </span>
            <span className="text-[9px] leading-tight text-slate-300 normal-case mb-2 block">
              Este portal foi desenvolvido com dedicação e propósito por{' '}
              <span className="text-orange-400 font-semibold">
                Alberto Lopes
              </span>
              .
            </span>
            <span className="text-[9px] italic text-slate-400 border-l-2 border-orange-500 pl-1.5 normal-case leading-tight block">
              &#34;Como paciente diagnosticado com EM, usei tecnologia para
              fortalecer a APEMIGOS.&#34;
            </span>
            {/* Triangle pointer */}
            <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-800 block"></span>
          </span>
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
