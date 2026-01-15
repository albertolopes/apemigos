'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import {
  FaEnvelope,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaWhatsapp,
} from 'react-icons/fa';
import Notification from '../components/Notification/Notification';
import { buildVolunteerEmail } from '../utils/email-template';
import { emailService } from '@services';

export default function Page() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;

    const form = formRef.current;
    if (!form) return;

    const fd = new FormData(form);
    const nome = String(fd.get('nome') || '').trim();
    const sobrenome = String(fd.get('sobrenome') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const telefone = String(fd.get('telefone') || '').trim();
    const endereco = String(fd.get('endereco') || '').trim();
    const mensagem = String(fd.get('mensagem') || '').trim();

    // validação simples
    if (!nome || nome.length < 2) {
      setStatus('error');
      setMessage('Por favor informe seu primeiro nome.');
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Por favor informe um email válido.');
      return;
    }

    setStatus('sending');
    setMessage(null);

    try {
      const subject = `Novo Contato: ${nome}${
        sobrenome ? ' ' + sobrenome : ''
      }`;
      const body = buildVolunteerEmail({
        nome,
        sobrenome,
        email,
        telefone,
        endereco,
        mensagem,
      });

      try {
        await emailService.sendEmail({
          to: 'apemigos.em@gmail.com',
          subject,
          body,
        });

        setStatus('success');
        setMessage(
          'Obrigado! Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.'
        );
        form.reset();
      } catch (err: any) {
        const errMsg = err?.message || 'Erro ao enviar email';
        console.error('Erro no envio:', errMsg);
        setStatus('error');
        setMessage(errMsg);
        return;
      }
    } catch (err: any) {
      console.error('Erro ao enviar formulário de voluntariado:', err);
      setStatus('error');
      setMessage('Falha ao enviar. Tente novamente mais tarde.');
    }
  }

  return (
    <div className="relative">
      <div className="w-full h-[400px] relative">
        <Image
          src="https://i.imgur.com/cns7Cv4.jpeg"
          alt="Contato - Apemigos"
          fill
          style={{ objectFit: 'cover' }}
          unoptimized
        />
      </div>

      <div className="max-w-7xl mx-auto mt-[-120px] relative bg-white px-8 sm:px-20">
        <h1 className="text-center py-8 text-orange-500 font-site text-3xl">
          Entre em contato
        </h1>

        <div className="max-w-4xl mx-auto text-center mb-2">
          <p className="text-lg text-slate-500 mb-4">
            Se você tiver alguma dúvida, entre em contato conosco.
          </p>
          <p className="text-lg text-slate-500 mb-4">
            Teremos prazer em ajudá-lo.
          </p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-6 justify-center mb-13">
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-6 hover:bg-green-50 transition-colors cursor-pointer w-full sm:w-[200px] no-underline text-inherit hover:text-inherit"
            aria-label="WhatsApp Apemigos"
          >
            <FaWhatsapp
              className="text-3xl text-green-500 mb-2"
              aria-hidden="true"
            />
            <span className="text-sm font-semibold mb-1">WhatsApp</span>
            <span className="text-xs text-gray-600 text-center">
              +55 61 99217-6669
            </span>
          </a>

          <a
            href="mailto: apemigos.em@gmail.com"
            className="flex flex-col items-center p-6 hover:bg-orange-50 transition-colors cursor-pointer w-full sm:w-[200px] no-underline text-inherit hover:text-inherit"
            aria-label="Email Apemigos"
          >
            <FaEnvelope
              className="text-3xl text-orange-500 mb-2"
              aria-hidden="true"
            />
            <span className="text-sm font-semibold mb-1">Email</span>
            <span className="text-xs text-gray-600 text-center">
              apemigos.em@gmail.com
            </span>
          </a>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-center py-8 text-orange-500 font-site text-3xl">
            Mídias sociais
          </h3>

          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 place-items-center">
            <a
              href="https://www.instagram.com/apemigos?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center text-center"
              aria-label="Instagram"
            >
              <FaInstagram
                className="text-3xl text-pink-600 mb-2"
                aria-hidden="true"
              />
              <span className="text-sm font-semibold mb-1">Instagram</span>
              <span className="text-xs text-gray-600 text-center">
                @Apemigos
              </span>
            </a>

            <a
              href="https://facebook.com/apemigos"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center text-center"
              aria-label="Facebook"
            >
              <FaFacebook
                className="text-3xl text-blue-600 mb-2"
                aria-hidden="true"
              />
              <span className="text-sm font-semibold mb-1">Facebook</span>
              <span className="text-xs text-gray-600 text-center">
                /apemigos
              </span>
            </a>

            <a
              href="https://youtube.com/apemigos"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center text-center"
              aria-label="YouTube"
            >
              <FaYoutube
                className="text-3xl text-red-600 mb-2"
                aria-hidden="true"
              />
              <span className="text-sm font-semibold mb-1">YouTube</span>
              <span className="text-xs text-gray-600 text-center">
                Apemigos Oficial
              </span>
            </a>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex flex-col items-center">
            <h3 className="font-site text-2xl text-orange-500 font-bold my-6 text-center">
              Envie uma mensagem
            </h3>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="border-2 text-slate-500 p-8 rounded-lg bg-white shadow-sm w-full max-w-4xl"
              aria-labelledby="voluntarios-title"
            >
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label
                      className="text-xs text-slate-500 font-semibold"
                      htmlFor="nome"
                    >
                      Primeiro nome *
                    </label>
                    <input
                      className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      type="text"
                      name="nome"
                      id="nome"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label
                      className="text-xs text-slate-500 font-semibold"
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
                      className="text-xs text-slate-500 font-semibold"
                      htmlFor="email"
                    >
                      Email *
                    </label>
                    <input
                      className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      type="email"
                      name="email"
                      id="email"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label
                      className="text-xs text-slate-500 font-semibold"
                      htmlFor="telefone"
                    >
                      Telefone
                    </label>
                    <input
                      className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      type="tel"
                      name="telefone"
                      id="telefone"
                      pattern="[0-9+ ()-]{6,}"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="text-xs text-slate-500 font-semibold"
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

                {/* Nova área de mensagem */}
                <div>
                  <label
                    className="text-xs text-slate-500 font-semibold"
                    htmlFor="mensagem"
                  >
                    Mensagem
                  </label>
                  <textarea
                    name="mensagem"
                    id="mensagem"
                    rows={6}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 resize-vertical"
                    placeholder="Escreva sua mensagem aqui..."
                  />
                </div>
              </div>

              <button
                className="btn-main w-full mt-6 bg-orange-500 text-white py-3 rounded hover:bg-orange-600 transition-colors font-semibold"
                type="submit"
                aria-disabled={status === 'sending'}
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Enviando...' : 'Enviar'}
              </button>

              <Notification
                open={status === 'success' || status === 'error'}
                type={
                  status === 'success'
                    ? 'success'
                    : status === 'error'
                    ? 'error'
                    : 'info'
                }
                message={message}
                onClose={() => {
                  setStatus('idle');
                  setMessage(null);
                }}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
