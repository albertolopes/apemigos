'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  CampoFormularioEvento,
  FormularioEvento,
  InscricaoEvento,
  eventosService,
} from '@services';
import { sortByOrder } from '../../eventos-utils';

type FormValues = Record<number, string | string[]>;
type FormErrors = Record<number | string, string>;

const optionTypes = ['SELECT', 'RADIO', 'CHECKBOX'];

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

function maskCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function isValidCpf(value: string) {
  const cpf = onlyDigits(value);

  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const calculateDigit = (base: string, factor: number) => {
    const total = base
      .split('')
      .reduce((sum, digit) => sum + Number(digit) * factor--, 0);
    const remainder = (total * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const firstDigit = calculateDigit(cpf.slice(0, 9), 10);
  const secondDigit = calculateDigit(cpf.slice(0, 10), 11);

  return firstDigit === Number(cpf[9]) && secondDigit === Number(cpf[10]);
}

function normalizeFieldValue(
  campo: CampoFormularioEvento,
  value: string | string[]
) {
  if (campo.tipo === 'CPF' && typeof value === 'string')
    return onlyDigits(value);
  if (campo.tipo === 'PHONE' && typeof value === 'string')
    return onlyDigits(value);
  return value;
}

function getValue(values: FormValues, campo: CampoFormularioEvento) {
  return values[campo.id] ?? (campo.tipo === 'CHECKBOX' ? [] : '');
}

function getBackendSummary(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'Erro ao realizar inscrição';
}

function getFormularioEventoId(formulario: FormularioEvento | null) {
  return formulario?.evento?.id || formulario?.eventoId;
}

function validateField(campo: CampoFormularioEvento, value: string | string[]) {
  const normalized = normalizeFieldValue(campo, value);
  const empty = Array.isArray(normalized)
    ? normalized.length === 0
    : !String(normalized).trim();

  if (campo.obrigatorio && empty) return 'Campo obrigatório.';
  if (empty) return '';

  if (campo.tipo === 'EMAIL') {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(normalized));
    if (!isValid) return 'Informe um e-mail válido.';
  }

  if (campo.tipo === 'CPF' && !isValidCpf(String(normalized))) {
    return 'Informe um CPF válido.';
  }

  if (campo.tipo === 'PHONE' && String(normalized).length < 10) {
    return 'Informe um telefone válido.';
  }

  if (campo.tipo === 'NUMBER' && Number.isNaN(Number(normalized))) {
    return 'Informe um número válido.';
  }

  if (campo.tipo === 'DATE') {
    const dateValue = String(normalized);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return 'Informe uma data válida.';
    }
  }

  if (optionTypes.includes(campo.tipo)) {
    const validOptions = new Set(
      (campo.opcoes || []).map((opcao) => opcao.valor)
    );
    const selected = Array.isArray(normalized)
      ? normalized
      : [String(normalized)];
    const hasInvalidOption = selected.some((item) => !validOptions.has(item));

    if (hasInvalidOption) return 'Selecione uma opção válida.';
  }

  return '';
}

function getDisplayResponse(
  inscricao: InscricaoEvento,
  key: string,
  fallbackFields: string[]
) {
  const answer = inscricao.respostas?.find((resposta) => {
    const fieldKey = String(
      resposta.chave || resposta.label || ''
    ).toLowerCase();
    return (
      fieldKey.includes(key) ||
      fallbackFields.some((item) => fieldKey.includes(item))
    );
  });

  if (!answer?.valor || Array.isArray(answer.valor)) return '';
  return answer.valor;
}

function FieldControl({
  campo,
  value,
  error,
  onChange,
}: {
  campo: CampoFormularioEvento;
  value: string | string[];
  error?: string;
  onChange: (campo: CampoFormularioEvento, value: string | string[]) => void;
}) {
  const commonClass =
    'mt-2 block w-full border border-slate-300 px-3 py-3 text-sm focus:border-orange-500 focus:outline-none';
  const opcoes = sortByOrder(campo.opcoes || []);

  if (campo.tipo === 'TEXTAREA') {
    return (
      <textarea
        value={String(value)}
        placeholder={campo.placeholder}
        onChange={(event) => onChange(campo, event.target.value)}
        className={`${commonClass} min-h-[120px]`}
      />
    );
  }

  if (campo.tipo === 'SELECT') {
    return (
      <select
        value={String(value)}
        onChange={(event) => onChange(campo, event.target.value)}
        className={commonClass}
      >
        <option value="">Selecione</option>
        {opcoes.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.label}
          </option>
        ))}
      </select>
    );
  }

  if (campo.tipo === 'RADIO') {
    return (
      <div className="mt-3 space-y-2">
        {opcoes.map((opcao) => (
          <label key={opcao.valor} className="flex items-center gap-3 text-sm">
            <input
              type="radio"
              name={campo.chave}
              value={opcao.valor}
              checked={value === opcao.valor}
              onChange={(event) => onChange(campo, event.target.value)}
              className="h-4 w-4 accent-orange-500"
            />
            {opcao.label}
          </label>
        ))}
      </div>
    );
  }

  if (campo.tipo === 'CHECKBOX') {
    const selected = Array.isArray(value) ? value : [];

    return (
      <div className="mt-3 space-y-2">
        {opcoes.map((opcao) => (
          <label key={opcao.valor} className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              value={opcao.valor}
              checked={selected.includes(opcao.valor)}
              onChange={(event) => {
                const nextValue = event.target.checked
                  ? [...selected, opcao.valor]
                  : selected.filter((item) => item !== opcao.valor);
                onChange(campo, nextValue);
              }}
              className="h-4 w-4 accent-orange-500"
            />
            {opcao.label}
          </label>
        ))}
      </div>
    );
  }

  const inputType =
    campo.tipo === 'EMAIL'
      ? 'email'
      : campo.tipo === 'PHONE'
      ? 'tel'
      : campo.tipo === 'DATE'
      ? 'date'
      : campo.tipo === 'NUMBER'
      ? 'number'
      : 'text';

  return (
    <input
      type={inputType}
      value={String(value)}
      placeholder={campo.placeholder}
      onChange={(event) => {
        const nextValue =
          campo.tipo === 'CPF'
            ? maskCpf(event.target.value)
            : event.target.value;
        onChange(campo, nextValue);
      }}
      className={commonClass}
      aria-invalid={Boolean(error)}
    />
  );
}

export default function EventoInscricaoPage() {
  const params = useParams<{ slug: string }>();
  const [formulario, setFormulario] = useState<FormularioEvento | null>(null);
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [success, setSuccess] = useState<InscricaoEvento | null>(null);
  const [activeHelpId, setActiveHelpId] = useState<number | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setBackendError(null);

    eventosService
      .getFormularioBySlug(params.slug)
      .then(setFormulario)
      .catch((err) => setBackendError(err.message))
      .finally(() => setIsLoading(false));
  }, [params.slug]);

  useEffect(() => {
    function closeHelp(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-field-help]')) return;
      setActiveHelpId(null);
    }

    function closeOnEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') setActiveHelpId(null);
    }

    document.addEventListener('click', closeHelp);
    document.addEventListener('keydown', closeOnEsc);

    return () => {
      document.removeEventListener('click', closeHelp);
      document.removeEventListener('keydown', closeOnEsc);
    };
  }, []);

  const camposAtivos = useMemo(
    () =>
      sortByOrder((formulario?.campos || []).filter((campo) => campo.ativo)),
    [formulario]
  );

  const inscricoesAbertas =
    formulario?.inscricoesAbertas ??
    formulario?.evento?.inscricoesAbertas ??
    true;

  function updateValue(campo: CampoFormularioEvento, value: string | string[]) {
    setValues((current) => ({ ...current, [campo.id]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[campo.id];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBackendError(null);

    const nextErrors: FormErrors = {};
    camposAtivos.forEach((campo) => {
      const message = validateField(campo, getValue(values, campo));
      if (message) nextErrors[campo.id] = message;
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const eventoId = getFormularioEventoId(formulario);
      if (!eventoId) {
        throw new Error(
          'Não foi possível identificar o evento para inscrição.'
        );
      }

      const payload = {
        respostas: camposAtivos.map((campo) => ({
          campoId: campo.id,
          valor: normalizeFieldValue(campo, getValue(values, campo)),
        })),
      };
      const response = await eventosService.criarInscricao(eventoId, payload);
      setSuccess(response);
    } catch (err) {
      setBackendError(getBackendSummary(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-20 text-center text-sm text-slate-500">
        Carregando formulário...
      </main>
    );
  }

  if (backendError && !formulario) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="font-site text-slate-800">Evento não encontrado</h1>
        <p className="mt-4 text-sm text-slate-600">{backendError}</p>
        <Link href="/eventos" className="mt-8 inline-block text-orange-600">
          Voltar para eventos
        </Link>
      </main>
    );
  }

  if (!inscricoesAbertas) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="font-site text-slate-800">Inscrições encerradas</h1>
        <p className="mt-4 text-sm text-slate-600">
          Este evento não está recebendo novas inscrições.
        </p>
        <Link
          href={`/eventos/${formulario?.evento?.slug || params.slug}`}
          className="mt-8 inline-block text-orange-600"
        >
          Ver detalhes do evento
        </Link>
      </main>
    );
  }

  if (success) {
    const numero =
      success.numeroInscricao || success.numero || success.protocolo;
    const nome = getDisplayResponse(success, 'nome', ['name']);
    const email = getDisplayResponse(success, 'email', ['e-mail']);
    const data = success.dataInscricao || success.createdAt;

    return (
      <main className="mx-auto max-w-4xl px-6 py-20">
        <div className="border border-green-200 bg-green-50 px-6 py-8 text-center">
          <h1 className="font-site text-slate-800">
            Inscrição realizada com sucesso.
          </h1>
          <dl className="mx-auto mt-6 grid max-w-xl grid-cols-1 gap-3 text-sm text-slate-700 sm:grid-cols-2">
            {numero && (
              <div>
                <dt className="font-semibold text-slate-900">Número</dt>
                <dd>{numero}</dd>
              </div>
            )}
            {nome && (
              <div>
                <dt className="font-semibold text-slate-900">Nome</dt>
                <dd>{nome}</dd>
              </div>
            )}
            {email && (
              <div>
                <dt className="font-semibold text-slate-900">E-mail</dt>
                <dd>{email}</dd>
              </div>
            )}
            {data && (
              <div>
                <dt className="font-semibold text-slate-900">Data</dt>
                <dd>{new Date(data).toLocaleString('pt-BR')}</dd>
              </div>
            )}
          </dl>
          <Link href="/eventos" className="mt-8 inline-block text-orange-600">
            Voltar para eventos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 sm:px-10">
      <Link
        href={`/eventos/${formulario?.evento?.slug || params.slug}`}
        className="text-sm text-orange-600"
      >
        Voltar para detalhes
      </Link>
      <h1 className="mt-5 font-site text-slate-800">
        {formulario?.titulo || 'Inscrição no evento'}
      </h1>
      {formulario?.descricao && (
        <p className="mt-4 text-sm text-slate-600">{formulario.descricao}</p>
      )}

      {backendError && (
        <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {backendError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {camposAtivos.map((campo) => {
          const value = getValue(values, campo);
          const error = errors[campo.id];

          return (
            <div key={campo.id}>
              <div className="flex items-center gap-2">
                <label className="block text-sm font-semibold text-slate-900">
                  {campo.label}
                  {campo.obrigatorio && (
                    <span className="text-orange-600"> *</span>
                  )}
                </label>
                {campo.textoAjuda && (
                  <span className="relative" data-field-help>
                    <button
                      type="button"
                      aria-label={`Ajuda sobre ${campo.label}`}
                      aria-expanded={activeHelpId === campo.id}
                      onClick={(event) => {
                        event.stopPropagation();
                        setActiveHelpId((current) =>
                          current === campo.id ? null : campo.id
                        );
                      }}
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-xs font-bold text-slate-600 hover:border-orange-500 hover:text-orange-600"
                    >
                      ?
                    </button>
                    {activeHelpId === campo.id && (
                      <div
                        role="tooltip"
                        className="absolute left-0 top-7 z-20 w-64 border border-slate-200 bg-white p-3 text-xs font-normal leading-5 text-slate-600 shadow-lg"
                      >
                        {campo.textoAjuda}
                      </div>
                    )}
                  </span>
                )}
              </div>
              <FieldControl
                campo={campo}
                value={value}
                error={error}
                onChange={updateValue}
              />
              {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
            </div>
          );
        })}

        {camposAtivos.length === 0 && (
          <div className="border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            Nenhum campo ativo disponível para este formulário.
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || camposAtivos.length === 0}
          className="btn-main disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar inscrição'}
        </button>
      </form>
    </main>
  );
}
