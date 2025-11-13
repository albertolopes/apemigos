import Image from 'next/image';
import {
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaTelegram,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
} from 'react-icons/fa';

export default async function Page() {
  return (
    <div className="relative">
      <div className="w-full h-[400px] relative">
        <Image
          src="https://static.wixstatic.com/media/0b340f_a5c250a81aed4d7fa68e005cff2132c8~mv2_d_3840_1960_s_2.jpg/v1/fill/w_3456,h_984,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/0b340f_a5c250a81aed4d7fa68e005cff2132c8~mv2_d_3840_1960_s_2.jpg"
          alt="projetos"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="max-w-7xl mx-auto mt-[-120px] relative bg-white px-8 sm:px-20">
        <h1 className="text-center py-8 font-site text-black  font-bold">
          Entre em contato
        </h1>
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className="text-lg text-gray-700 mb-4">
            Se você tiver alguma dúvida, entre em contato conosco.
          </p>
          <p className="text-lg text-gray-700 font-semibold">
            Teremos prazer em ajudá-lo.
          </p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-6  hover:bg-green-50 transition-colors cursor-pointer w-full sm:w-[200px] no-underline text-inherit hover:text-inherit"
          >
            <FaWhatsapp className="text-3xl text-green-500 mb-2" />
            <span className="text-sm font-semibold mb-1">WhatsApp</span>
            <span className="text-xs text-gray-600 text-center">
              +55 11 99999-9999
            </span>
          </a>
          <a
            href="mailto:seuemail@exemplo.com"
            className="flex flex-col items-center p-6  hover:bg-orange-50 transition-colors cursor-pointer w-full sm:w-[200px] no-underline text-inherit hover:text-inherit"
          >
            <FaEnvelope className="text-3xl text-orange-500 mb-2" />
            <span className="text-sm font-semibold mb-1">Email</span>
            <span className="text-xs text-gray-600 text-center">
              seuemail@exemplo.com
            </span>
          </a>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="font-site text-3xl text-black  font-bold text-center mb-8">
            MÍDIAS SOCIAIS
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <a
              href="https://www.instagram.com/apemigos?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center"
            >
              <FaInstagram className="text-3xl text-pink-600 mb-2" />
              <span className="text-sm font-semibold mb-1">Instagram</span>
              <span className="text-xs text-gray-600 text-center">
                @Apemigos
              </span>
            </a>
            <a
              href="https://facebook.com/seu-usuario"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center"
            >
              <FaFacebook className="text-3xl text-blue-600 mb-2" />
              <span className="text-sm font-semibold mb-1">Facebook</span>
              <span className="text-xs text-gray-600 text-center">
                /Apemigos
              </span>
            </a>
            <a
              href="https://twitter.com/seu-usuario"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center "
            >
              <FaTwitter className="text-3xl text-blue-400 mb-2" />
              <span className="text-sm font-semibold mb-1">Twitter</span>
              <span className="text-xs text-gray-600 text-center">
                @Apemigos
              </span>
            </a>
            <a
              href="https://linkedin.com/in/seu-usuario"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center"
            >
              <FaLinkedin className="text-3xl text-blue-700 mb-2" />
              <span className="text-sm font-semibold mb-1">LinkedIn</span>
              <span className="text-xs text-gray-600 text-center">
                /company/apemigos
              </span>
            </a>
            <a
              href="https://t.me/seu-canal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center "
            >
              <FaTelegram className="text-3xl text-blue-500 mb-2" />
              <span className="text-sm font-semibold mb-1">Telegram</span>
              <span className="text-xs text-gray-600 text-center">
                @Apemigos
              </span>
            </a>
            <a
              href="https://youtube.com/c/seu-canal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center"
            >
              <FaYoutube className="text-3xl text-red-600 mb-2" />
              <span className="text-sm font-semibold mb-1">YouTube</span>
              <span className="text-xs text-gray-600 text-center">
                Apemigos Oficial
              </span>
            </a>
            <a
              href="https://tiktok.com/@seu-usuario"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center"
            >
              <FaTiktok className="text-3xl text-black mb-2" />
              <span className="text-sm font-semibold mb-1">TikTok</span>
              <span className="text-xs text-gray-600 text-center">
                @Apemigos
              </span>
            </a>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex flex-col items-center">
            <h3 className="font-site text-2xl text-black font-bold my-6 text-center">
              Voluntários
            </h3>
            <form className="border-2 text-black p-8 rounded-lg bg-white shadow-sm w-full max-w-2xl">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label
                      className="text-xs text-orange-500 font-semibold"
                      htmlFor="nome"
                    >
                      Primeiro nome *
                    </label>
                    <input
                      className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      type="text"
                      name="nome"
                      id="nome"
                      required={true}
                    />
                  </div>
                  <div>
                    <label
                      className="text-xs  text-orange-500 font-semibold"
                      htmlFor="sobrenome"
                    >
                      Sobrenome
                    </label>
                    <input
                      className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      type="text"
                      name="sobrenome"
                      id="sobrenome"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label
                      className="text-xs text-orange-500  font-semibold"
                      htmlFor="email"
                    >
                      Email *
                    </label>
                    <input
                      className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      type="email"
                      name="email"
                      id="email"
                      required={true}
                    />
                  </div>
                  <div>
                    <label
                      className="text-xs text-orange-500 font-semibold"
                      htmlFor="telefone"
                    >
                      Telefone
                    </label>
                    <input
                      className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      type="tel"
                      name="telefone"
                      id="telefone"
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="text-xs  text-orange-500  font-semibold"
                    htmlFor="endereco"
                  >
                    Endereço
                  </label>
                  <input
                    className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    type="text"
                    name="endereco"
                    id="endereco"
                  />
                </div>
              </div>
              <button
                className="btn-main w-full mt-6 bg-orange-500 text-white py-3 rounded hover:bg-orange-600 transition-colors font-semibold"
                type="submit"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
