import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import AltoCustoFlow from './AltoCustoFlow';

const ceafPage = 'https://www.saude.df.gov.br/componente-especializado';
const formsPage =
  'https://www.saude.df.gov.br/protocolos-clinicos-ter-resumos-e-formularios';
const ceafDigitalPage = 'https://ceafdigital.saude.df.gov.br/home';
const agendaDfPage = 'https://agenda.df.gov.br/posto.html?servico=57014096';
const agendaDfHomePage = 'https://agenda.df.gov.br/index.html';
const onlineSchedulingNews =
  'https://www.saude.df.gov.br/w/pacientes-da-farmacia-de-alto-custo-ja-podem-agendar-atendimento-on-line-sem-esperar-renovacao-cadastral';

export const metadata: Metadata = {
  title: 'Alto Custo sem labirinto | Apemigos',
  description:
    'Guia facilitado da Apemigos para encontrar formularios e documentos oficiais do CEAF/Alto Custo da Secretaria de Saude do DF.',
  alternates: {
    canonical: '/alto-custo',
  },
};

const beforeStart = [
  'Peca ao medico o diagnostico por escrito, com CID e historico do tratamento.',
  'Confira se a receita informa medicamento, dose, quantidade e tempo de uso.',
  'Procure sua condicao na lista oficial do CEAF antes de separar os formularios.',
  'Separe documentos pessoais, comprovante de residencia e Cartao Nacional de Saude.',
];

const firstTimeSteps = [
  {
    title: '1. Saia da consulta com as informacoes certas',
    text: 'Antes de correr atras de formulario, confirme com o medico o nome da condicao, CID, medicamento, dose, exames que comprovam o diagnostico e se existe PCDT ou criterio especifico.',
  },
  {
    title: '2. Confira se o Alto Custo cobre sua condicao',
    text: 'Use a busca desta pagina para achar a condicao. Depois abra a pagina oficial da SES-DF, porque cada doenca pode ter anexos, exames e relatorios diferentes.',
  },
  {
    title: '3. Baixe apenas os documentos corretos',
    text: 'Comece pelo LME e pelos documentos gerais. Em seguida, baixe os formularios e anexos especificos da sua condicao na pagina oficial.',
  },
  {
    title: '4. Monte uma pasta antes de agendar',
    text: 'Junte receita, relatorio medico, exames, documentos pessoais e formularios preenchidos. Isso reduz ida perdida e exigencia por documento faltante.',
  },
];

export default function AltoCustoPage() {
  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-x-0 top-0 h-56 bg-orange-500/10 sm:h-72">
          <Image
            src="https://i.imgur.com/8vMvIzd.png"
            alt="Guia Alto Custo sem labirinto"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 pb-16 pt-32 sm:px-20 sm:pb-24 sm:pt-44 relative">
          <div className="max-w-4xl border-t-4 border-orange-500 bg-white p-8 shadow-sm sm:p-12">
            <p className="font-site text-sm uppercase tracking-[0.25em] text-orange-500">
              CEAF / Alto Custo no DF
            </p>
            <h1 className="mt-4 font-site text-slate-700 text-5xl leading-tight text-slate-700 sm:text-7xl">
              Alto Custo sem labirinto
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-500">
              Um guia para quem recebeu um diagnostico, ouviu falar em
              &quot;Alto Custo&quot; pela primeira vez e precisa transformar a
              burocracia em uma lista clara de proximos passos, documentos e
              links oficiais da Secretaria de Saude do DF.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={formsPage}
                target="_blank"
                rel="noreferrer"
                className="btn-main"
              >
                Formularios oficiais
              </a>
              <a
                href={ceafDigitalPage}
                target="_blank"
                rel="noreferrer"
                className="border border-orange-500 px-6 py-3 text-center font-site text-sm text-orange-500 hover:bg-orange-50"
              >
                Acessar CEAF Digital
              </a>
              <a
                href={ceafPage}
                target="_blank"
                rel="noreferrer"
                className="border border-orange-500 px-6 py-3 text-center font-site text-sm text-orange-500 hover:bg-orange-50"
              >
                Entenda o CEAF na SES-DF
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 sm:px-20 sm:py-16">
        <section className="mb-16 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="border-t-4 border-orange-500 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-site text-slate-700 text-3xl text-slate-700">
              O que e o CEAF?
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              O CEAF, conhecido como Alto Custo, e uma politica publica do SUS
              para acesso a medicamentos especializados. Cada solicitacao passa
              por regras, documentos e avaliacao tecnica da Secretaria de Saude.
              Esta pagina organiza o caminho, mas a decisao e as exigencias
              oficiais sao da SES-DF.
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Pense nesta pagina como uma triagem de informacao: ela ajuda voce
              a saber onde clicar, o que perguntar ao medico e quais papeis
              separar antes de protocolar ou agendar atendimento.
            </p>
          </div>

          <div className="border-t-4 border-orange-500 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-site text-slate-700 text-3xl text-slate-700">
              Antes de comecar
            </h2>
            <ul className="mt-4 space-y-3">
              {beforeStart.map((item) => (
                <li key={item} className="text-sm leading-6 text-slate-500">
                  <span className="mr-2 font-site text-orange-500">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-6 max-w-3xl">
            <p className="font-site text-sm uppercase tracking-[0.2em] text-orange-500">
              Primeira vez
            </p>
            <h2 className="mt-2 text-slate-700 font-site text-3xl text-slate-700">
              Se voce foi diagnosticado agora, comece por aqui
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              O erro mais comum e tentar protocolar sem saber exatamente quais
              documentos a condicao exige. Use esta ordem para reduzir
              retrabalho.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {firstTimeSteps.map((step) => (
              <article
                key={step.title}
                className="border-t-4 border-orange-500 bg-white p-5 shadow-sm"
              >
                <h3 className="font-site text-slate-700 text-xl text-slate-700">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <AltoCustoFlow />

        <section className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="border-t-4 border-orange-500 bg-white p-6 shadow-sm sm:p-8">
            <p className="font-site text-sm uppercase tracking-[0.2em] text-orange-500">
              Atendimento online
            </p>
            <h2 className="mt-2 font-site text-3xl text-slate-700">
              CEAF Digital e agendamento
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              A SES-DF tambem disponibiliza o CEAF Digital e informou que
              pacientes da Farmacia de Alto Custo podem agendar on-line a
              retirada de medicamentos e a renovacao de documentos pelo Agenda
              DF, sem precisar aguardar a renovacao cadastral no novo sistema.
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Segundo a noticia oficial de 15/05/2026, os agendamentos estavam
              disponiveis para Asa Sul, Ceilandia e Gama, com atendimento na
              unidade em que o paciente ja possui cadastro ativo. Confira sempre
              a informacao atualizada antes de marcar.
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Para primeira solicitacao, confirme na pagina oficial se o caminho
              sera CEAF Digital, Agenda DF ou atendimento indicado pela unidade.
              A regra operacional pode mudar conforme tipo de atendimento.
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              O link direto abaixo aponta para o servico de agendamento de
              retirada de medicacao. Se ele nao abrir corretamente, acesse a
              pagina inicial do Agenda DF e selecione o orgao/servico
              correspondente.
            </p>
          </div>

          <div className="grid gap-3">
            <a
              href={ceafDigitalPage}
              target="_blank"
              rel="noreferrer"
              className="border-t-4 border-orange-500 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="font-site text-xl text-slate-700">CEAF Digital</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Portal oficial do novo sistema digital da Farmacia de Alto
                Custo.
              </p>
            </a>
            <a
              href={agendaDfPage}
              target="_blank"
              rel="noreferrer"
              className="border-t-4 border-orange-500 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="font-site text-xl text-slate-700">Agenda DF</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Link direto para agendamento de retirada de medicacao na
                Farmacia de Alto Custo. O identificador de sessao foi removido
                para evitar link expirado.
              </p>
            </a>
            <a
              href={agendaDfHomePage}
              target="_blank"
              rel="noreferrer"
              className="border-t-4 border-orange-500 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="font-site text-xl text-slate-700">
                Inicio do Agenda DF
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Alternativa caso o link direto nao carregue: entre no sistema,
                selecione o orgao e escolha o servico de interesse.
              </p>
            </a>
            <a
              href={onlineSchedulingNews}
              target="_blank"
              rel="noreferrer"
              className="border-t-4 border-orange-500 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="font-site text-xl text-slate-700">
                Noticia oficial
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Comunicado da SES-DF sobre agendamento on-line sem aguardar
                renovacao cadastral.
              </p>
            </a>
          </div>
        </section>

        <section className="mt-16 border-t-4 border-orange-500 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-site text-3xl text-slate-700">
            Fonte e responsabilidade
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            Fonte: Secretaria de Saude do DF. Conferir sempre a pagina oficial
            antes de protocolar. A pagina oficial de formularios informa
            atualizacao em 08/05/2026 as 14h43.
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Esta pagina e informativa e nao substitui orientacao medica,
            juridica ou avaliacao da Secretaria de Saude. Regras, formularios e
            links podem mudar.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={formsPage}
              target="_blank"
              rel="noreferrer"
              className="btn-main"
            >
              Conferir formularios na SES-DF
            </a>
            <Link
              href="/contact"
              className="border border-slate-200 px-6 py-3 text-center font-site text-sm text-slate-500 hover:border-orange-500 hover:text-orange-500"
            >
              Falar com a Apemigos
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
