'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
} from 'react-icons/fa';
import Notification from '../components/Notification/Notification';
import { buildVolunteerEmail } from '../utils/email-template';
import { emailService } from '@services';

const contactCards = [
  {
    title: 'WhatsApp',
    detail: '+55 61 99217-6669',
    href: 'https://wa.me/5561992176669',
    icon: FaWhatsapp,
    color: 'text-green-500',
    description: 'Canal direto para dúvidas rápidas e acolhimento inicial.',
  },
  {
    title: 'Email',
    detail: 'apemigos.em@gmail.com',
    href: 'mailto:apemigos.em@gmail.com',
    icon: FaEnvelope,
    color: 'text-orange-500',
    description: 'Melhor caminho para mensagens detalhadas e documentos.',
  },
];

const socialLinks = [
  {
    title: 'Instagram',
    detail: '@Apemigos',
    href: 'https://www.instagram.com/apemigos?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    icon: FaInstagram,
    color: 'text-pink-600',
  },
  {
    title: 'Facebook',
    detail: '/apemigos',
    href: 'https://facebook.com/apemigos',
    icon: FaFacebook,
    color: 'text-blue-600',
  },
  {
    title: 'YouTube',
    detail: 'Apemigos Oficial',
    href: 'https://youtube.com/apemigos',
    icon: FaYoutube,
    color: 'text-red-600',
  },
];

const helpTopics = [
  'Informacoes sobre esclerose multipla e doencas raras',
  'Acolhimento para pacientes, familiares e cuidadores',
  'Duvidas sobre projetos, eventos e campanhas da Apemigos',
  'Parcerias, imprensa, voluntariado e apoio institucional',
];

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
      const errMsg =
        err?.message || 'Falha ao enviar. Tente novamente mais tarde.';
      console.error('Erro ao enviar formulário de contato:', errMsg);
      setStatus('error');
      setMessage(errMsg);
    }
  }

  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-white">
        <div className="relative h-[320px] w-full sm:h-[430px]">
          <Image
            src="https://i.imgur.com/cns7Cv4.jpeg"
            alt="Contato - Apemigos"
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
              Fale com a Apemigos
            </p>
            <h1 className="mt-4 font-site text-5xl leading-tight text-slate-700 sm:text-7xl">
              Entre em contato
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-500">
              Estamos aqui para orientar, acolher e conectar pessoas com
              esclerose multipla, doencas raras, familiares, cuidadores,
              profissionais e parceiros no Distrito Federal.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12 sm:px-20 sm:py-16">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="grid gap-4 sm:grid-cols-2">
            {contactCards.map(
              ({ title, detail, href, icon: Icon, color, description }) => (
                <a
                  key={title}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={
                    href.startsWith('http') ? 'noopener noreferrer' : undefined
                  }
                  className="border-t-4 border-orange-500 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  aria-label={`${title} Apemigos`}
                >
                  <Icon className={`text-4xl ${color}`} aria-hidden="true" />
                  <h2 className="mt-4 font-site text-2xl text-slate-700">
                    {title}
                  </h2>
                  <p className="mt-2 text-sm font-semibold text-slate-600">
                    {detail}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {description}
                  </p>
                </a>
              )
            )}
          </div>

          <aside className="border-t-4 border-orange-500 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-site text-3xl text-slate-700">
              Como podemos ajudar?
            </h2>
            <ul className="mt-5 space-y-3">
              {helpTopics.map((topic) => (
                <li key={topic} className="text-sm leading-6 text-slate-500">
                  <span className="mr-2 font-site text-orange-500">•</span>
                  {topic}
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="h-fit border-t-4 border-orange-500 bg-white p-6 shadow-sm sm:p-8">
            <p className="font-site text-sm uppercase tracking-[0.2em] text-orange-500">
              Redes sociais
            </p>
            <h2 className="mt-2 font-site text-3xl text-slate-700">
              Acompanhe a Apemigos
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              Siga nossos canais para acompanhar campanhas, eventos, informacao
              qualificada e comunicados da associacao.
            </p>
            <div className="mt-6 grid gap-3">
              {socialLinks.map(({ title, detail, href, icon: Icon, color }) => (
                <a
                  key={title}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 border border-slate-200 p-4 transition hover:border-orange-500 hover:bg-orange-50"
                  aria-label={title}
                >
                  <Icon className={`text-3xl ${color}`} aria-hidden="true" />
                  <span>
                    <span className="block font-site text-lg text-slate-700">
                      {title}
                    </span>
                    <span className="block text-sm text-slate-500">
                      {detail}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </aside>

          <section className="border-t-4 border-orange-500 bg-white p-6 shadow-sm sm:p-8">
            <p className="font-site text-sm uppercase tracking-[0.2em] text-orange-500">
              Mensagem
            </p>
            <h2 className="mt-2 font-site text-3xl text-slate-700">
              Envie sua dúvida
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              Preencha os campos abaixo. Quanto mais contexto você enviar, mais
              fácil será direcionar sua mensagem para o apoio correto.
            </p>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="mt-8 text-slate-500"
              aria-labelledby="contato-title"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    className="text-xs font-semibold text-slate-500"
                    htmlFor="nome"
                  >
                    Primeiro nome *
                  </label>
                  <input
                    className="mt-2 w-full border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-orange-500"
                    type="text"
                    name="nome"
                    id="nome"
                    required
                    aria-required="true"
                  />
                </div>

                <div>
                  <label
                    className="text-xs font-semibold text-slate-500"
                    htmlFor="sobrenome"
                  >
                    Sobrenome
                  </label>
                  <input
                    className="mt-2 w-full border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-orange-500"
                    type="text"
                    name="sobrenome"
                    id="sobrenome"
                  />
                </div>

                <div>
                  <label
                    className="text-xs font-semibold text-slate-500"
                    htmlFor="email"
                  >
                    Email *
                  </label>
                  <input
                    className="mt-2 w-full border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-orange-500"
                    type="email"
                    name="email"
                    id="email"
                    required
                    aria-required="true"
                  />
                </div>

                <div>
                  <label
                    className="text-xs font-semibold text-slate-500"
                    htmlFor="telefone"
                  >
                    Telefone
                  </label>
                  <input
                    className="mt-2 w-full border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-orange-500"
                    type="tel"
                    name="telefone"
                    id="telefone"
                    pattern="[0-9+ ()-]{6,}"
                    placeholder="(61) 99999-9999"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label
                  className="text-xs font-semibold text-slate-500"
                  htmlFor="endereco"
                >
                  Cidade / Regiao administrativa
                </label>
                <input
                  className="mt-2 w-full border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-orange-500"
                  type="text"
                  name="endereco"
                  id="endereco"
                  placeholder="Ex.: Ceilandia, Asa Norte, Gama"
                />
              </div>

              <div className="mt-5">
                <label
                  className="text-xs font-semibold text-slate-500"
                  htmlFor="mensagem"
                >
                  Mensagem
                </label>
                <textarea
                  name="mensagem"
                  id="mensagem"
                  rows={6}
                  className="mt-2 w-full resize-y border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-orange-500"
                  placeholder="Conte brevemente como podemos ajudar."
                />
              </div>

              <button
                className="btn-main mt-6 w-full disabled:cursor-not-allowed"
                type="submit"
                aria-disabled={status === 'sending'}
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Enviando...' : 'Enviar mensagem'}
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
          </section>
        </section>
      </main>
    </div>
  );
}
