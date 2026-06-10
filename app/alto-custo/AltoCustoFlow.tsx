'use client';

import { useMemo, useState } from 'react';

const sesDfBaseUrl = 'https://www.saude.df.gov.br';

const officialFormsPage = `${sesDfBaseUrl}/protocolos-clinicos-ter-resumos-e-formularios`;

const generalDocuments = [
  {
    title:
      'Laudo para Solicitacao, Avaliacao e Autorizacao de Medicamentos (LME)',
    href: `${sesDfBaseUrl}/documents/37101/0/Formulario_LME%2B%281%29.pdf/065c5df3-e37d-ec6f-7bab-dfdc51a5f841?t=1750082356745`,
    description:
      'Formulario principal usado pelo medico solicitante para pedir o medicamento no CEAF.',
  },
  {
    title: 'Declaracao Autorizadora',
    href: `${sesDfBaseUrl}/documents/37101/0/Declara%C3%A7%C3%A3o%2BAutorizadora%2B%281%29.pdf/04e84d2d-135a-360b-08b9-c95bca5a4a4b?t=1722606737199`,
    description:
      'Usada quando outra pessoa sera autorizada a representar o paciente na farmacia.',
  },
  {
    title: 'Declaracao de Residencia',
    href: `${sesDfBaseUrl}/documents/37101/0/Declaracao_de_Residencia_CEAF.pdf/8a7bab36-5534-f1af-300d-d20af2a37923?t=1676310969352`,
    description:
      'Modelo da SES-DF para comprovacao de residencia quando necessario.',
  },
  {
    title: 'Declaracao de Nao Gravidez',
    href: officialFormsPage,
    description:
      'Atalho para a pagina oficial onde a SES-DF mantem o documento atualizado.',
  },
];

const conditions = [
  'Acne Grave',
  'Acromegalia',
  'Anemia Hemolitica Autoimune',
  'Angioedema Associado a Deficiencia de C1 Esterase',
  'Artrite Psoriaca',
  'Artrite Reumatoide',
  'Asma',
  'Atrofia Muscular Espinhal 5q Tipo I e II',
  'Colangite Biliar Primaria',
  'Dermatite Atopica',
  'Diabetes Mellitus Tipo I',
  'Diabetes Mellitus Tipo 2',
  'Doenca de Alzheimer',
  'Doenca de Crohn',
  'Doenca de Fabry',
  'Doenca de Gaucher',
  'Doenca de Pompe',
  'Doenca de Wilson',
  'Doenca Falciforme',
  'Dor Cronica',
  'Endometriose',
  'Epilepsia',
  'Esclerose Lateral Amiotrofica',
  'Esclerose Multipla',
  'Esclerose Sistemica',
  'Espondilite Ancilosante',
  'Fenilcetonuria',
  'Fibrose Cistica',
  'Fibrose Pulmonar Idiopatica',
  'Hemoglobinuria Paroxistica Noturna',
  'Hidradenite Supurativa',
  'Hipertensao Arterial Pulmonar',
  'Imunodeficiencia Primaria',
  'Insuficiencia Adrenal',
  'Lupus Eritematoso Sistemico',
  'Miastenia Gravis',
  'Mucopolissacaridoses',
  'Osteoporose',
  'Psoriase',
  'Puberdade Precoce Central',
  'Sindrome de Guillain-Barre',
  'Sindrome de Turner',
  'Sindrome Nefrotica Primaria',
  'Transplantes',
  'Transtorno Afetivo Bipolar Tipo I',
  'Urticaria Cronica Espontanea',
  'Uveites Nao-Infecciosas',
].map((name) => ({
  name,
  href: `${sesDfBaseUrl}/${slugify(name)}`,
}));

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

const steps = [
  'Digite o nome da sua condicao e confirme se ela aparece na lista do CEAF.',
  'Abra a pagina oficial da condicao e leia quais documentos ela pede.',
  'Baixe LME, formularios, relatorios, criterios e anexos antes de preencher.',
  'Monte uma pasta com documentos pessoais, receita, relatorio e exames.',
  'Protocole ou agende pelo caminho oficial indicado pela SES-DF.',
];

const checklist = [
  'Tenho o nome da condicao e o CID escritos no relatorio ou pedido medico.',
  'Tenho receita com nome do medicamento, dose, quantidade e tempo de tratamento.',
  'O LME foi preenchido, assinado e carimbado pelo profissional solicitante.',
  'O relatorio medico explica diagnostico, historico, tratamentos e justificativa.',
  'Separei exames e anexos especificos pedidos na pagina da minha condicao.',
  'Separei documento com foto, CPF, CNS e comprovante de residencia do paciente.',
  'Se outra pessoa for resolver, inclui declaracao autorizadora e documentos dela.',
  'Conferi a pagina oficial no dia do protocolo para evitar formulario antigo.',
];

export default function AltoCustoFlow() {
  const [query, setQuery] = useState('');
  const [selectedName, setSelectedName] = useState(conditions[0].name);

  const filteredConditions = useMemo(() => {
    const normalizedQuery = normalize(query.trim());

    if (!normalizedQuery) return conditions;

    return conditions.filter((condition) =>
      normalize(condition.name).includes(normalizedQuery)
    );
  }, [query]);

  const selectedCondition =
    conditions.find((condition) => condition.name === selectedName) ||
    filteredConditions[0] ||
    conditions[0];

  return (
    <div className="space-y-16">
      <section className="grid gap-4 md:grid-cols-5">
        {steps.map((step, index) => (
          <article
            key={step}
            className="border-t-4 border-orange-500 bg-white p-5 shadow-sm"
          >
            <span className="font-site text-4xl text-orange-500">
              {index + 1}
            </span>
            <p className="mt-4 text-sm leading-6 text-slate-500">{step}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="bg-white p-6 shadow-sm border-t-4 border-orange-500 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-site text-sm uppercase tracking-[0.2em] text-orange-500">
                Filtro da lista
              </p>
              <h2 className="mt-2 font-site text-slate-700 text-3xl text-black">
                Encontre sua condicao
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                Digite parte do nome para filtrar as condicoes abaixo. Depois
                selecione uma delas para abrir a pagina oficial da SES-DF.
              </p>
            </div>
            <label className="w-full sm:max-w-sm">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Filtrar condicoes
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Digite para filtrar: esclerose, fabry, asma..."
                className="w-full border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-orange-500"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-2 border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-700 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {filteredConditions.length === 1
                ? '1 condicao encontrada'
                : `${filteredConditions.length} condicoes encontradas`}
            </span>
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-left font-semibold underline underline-offset-4"
              >
                Limpar filtro
              </button>
            ) : (
              <span className="text-orange-600">
                Clique em uma condicao para selecionar.
              </span>
            )}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {filteredConditions.map((condition) => (
              <button
                key={condition.name}
                type="button"
                onClick={() => setSelectedName(condition.name)}
                className={`border px-4 py-3 text-left text-sm transition ${
                  selectedCondition.name === condition.name
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : 'border-slate-200 text-slate-500 hover:border-orange-500'
                }`}
              >
                {condition.name}
              </button>
            ))}
          </div>

          {filteredConditions.length === 0 && (
            <p className="mt-6 border border-slate-200 p-4 text-sm text-slate-500">
              Nenhuma condicao encontrada nesta lista inicial. Consulte a pagina
              oficial da SES-DF, pois a relacao completa pode mudar.
            </p>
          )}
        </div>

        <aside className="h-fit border-t-4 border-orange-500 bg-white p-6 shadow-sm sm:p-8">
          <p className="font-site text-sm uppercase tracking-[0.2em] text-orange-500">
            Proximo passo
          </p>
          <h3 className="mt-3 font-site text-slate-700 text-3xl text-black">
            {selectedCondition.name}
          </h3>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Abra a pagina oficial desta condicao na SES-DF antes de preencher a
            pasta. E la que voce confere criterios, formularios, relatorios
            padronizados, exames e anexos exigidos.
          </p>
          <div className="mt-5 border-l-4 border-orange-500 bg-orange-50 p-4 text-sm leading-6 text-orange-700">
            Use este botao para sair da Apemigos e consultar a regra oficial
            atualizada para <strong>{selectedCondition.name}</strong>.
          </div>
          <a
            href={selectedCondition.href}
            target="_blank"
            rel="noreferrer"
            className="btn-main mt-6 block text-center"
          >
            Abrir pagina oficial da condicao
          </a>
          <p className="mt-3 text-xs leading-5 text-slate-400">
            O link abre em uma nova aba no site da Secretaria de Saude do DF.
          </p>
          <a
            href={officialFormsPage}
            target="_blank"
            rel="noreferrer"
            className="mt-4 block text-sm text-slate-500 underline decoration-orange-500 underline-offset-4"
          >
            Ver lista completa na SES-DF
          </a>
        </aside>
      </section>

      <section>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-site text-sm uppercase tracking-[0.2em] text-orange-500">
              Atalhos oficiais
            </p>
            <h2 className="mt-2 text-slate-700 font-site text-3xl text-black">
              Documentos gerais
            </h2>
          </div>
          <a
            href={officialFormsPage}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-slate-500 underline decoration-orange-500 underline-offset-4"
          >
            Pagina oficial de formularios
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {generalDocuments.map((document) => (
            <a
              key={document.title}
              href={document.href}
              target="_blank"
              rel="noreferrer"
              className="border-t-4 border-orange-500 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="font-site text-xl text-slate-700">
                {document.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                {document.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className="border-t-4 border-orange-500 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-site text-3xl text-slate-700">
            Checklist da primeira pasta
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Use esta lista para revisar a pasta antes de protocolar ou agendar.
            Ela nao troca a exigencia da pagina oficial de cada condicao.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {checklist.map((item) => (
            <li
              key={item}
              className="border-l-4 border-orange-500 bg-white p-4 text-sm leading-6 text-slate-500 shadow-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
