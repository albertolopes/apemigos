'use client';

import { useState } from 'react';
import Image from 'next/image';
import { pixService } from '@services/pix/pix.service';

export default function DonatePixPanel() {
  const pixKey = 'apemigos.em@gmail.com';
  const [amount, setAmount] = useState('');
  const [qrSrc, setQrSrc] = useState<string | null>(null);
  const [txid, setTxid] = useState('');
  const [lastResponse, setLastResponse] = useState<any | null>(null);
  const [copiedMessage, setCopiedMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function formatAmountInput(value: string) {
    const cleaned = value.replace(/[^0-9,\.]/g, '');
    const firstComma = cleaned.indexOf(',');
    const firstDot = cleaned.indexOf('.');

    if (firstComma >= 0 && firstDot >= 0) {
      const separator = firstComma < firstDot ? ',' : '.';
      const parts = cleaned.split(/[,\.]/);
      return parts[0] + separator + parts.slice(1).join('').slice(0, 2);
    }

    if (firstComma >= 0) {
      const parts = cleaned.split(',');
      return parts[0] + ',' + parts.slice(1).join('').slice(0, 2);
    }

    if (firstDot >= 0) {
      const parts = cleaned.split('.');
      return parts[0] + '.' + parts.slice(1).join('').slice(0, 2);
    }

    return cleaned;
  }

  function normalizeToFloatString(value: string) {
    const replaced = value.replace(/,/g, '.').replace(/[^0-9.]/g, '');
    const parts = replaced.split('.');

    if (parts.length <= 1) {
      return parts[0];
    }

    return parts[0] + '.' + parts.slice(1).join('').slice(0, 2);
  }

  function normalizePixPayload(value?: string) {
    if (!value) return '';
    return String(value).replace(/\s+/g, '').trim();
  }

  async function copyText(text: string, message: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessage(message);
      window.setTimeout(() => setCopiedMessage(''), 2000);
    } catch (copyError) {
      setError('Não foi possível copiar agora. Tente novamente.');
    }
  }

  async function generatePixFor(value?: string) {
    setCopiedMessage('');
    setError(null);
    setLoading(true);
    const raw = value ?? amount ?? '';
    const normalizedAmount = normalizeToFloatString(raw);

    if (normalizedAmount) {
      const numeric = Number.parseFloat(normalizedAmount);
      if (Number.isNaN(numeric) || numeric <= 0) {
        setLoading(false);
        setError('Informe um valor válido maior que zero.');
        return null;
      }
    }

    try {
      const numeric = normalizedAmount
        ? Number(Number.parseFloat(normalizedAmount).toFixed(2))
        : undefined;
      const data = await pixService.createStatic(numeric);
      const normalizedPayload = normalizePixPayload(data?.payload);

      setLastResponse(
        data
          ? {
              ...data,
              payload: normalizedPayload || data.payload || '',
            }
          : null
      );

      if (data.qrCodeBase64) {
        setQrSrc(
          data.qrCodeBase64.startsWith('data:')
            ? data.qrCodeBase64
            : `data:image/png;base64,${data.qrCodeBase64}`
        );
      } else if (normalizedPayload) {
        setQrSrc(
          `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
            normalizedPayload
          )}`
        );
      } else {
        setQrSrc(null);
      }

      setTxid(data.txid || '');
      if (raw) {
        setAmount(raw);
      }
      return data?.qrCodeBase64 || data?.payload || null;
    } catch (requestError) {
      console.error('Erro ao gerar pix via backend', requestError);
      setError('Não foi possível gerar o QR Pix no momento.');
      setQrSrc(null);
      setTxid('');
      setLastResponse(null);
      return null;
    } finally {
      setLoading(false);
    }
  }

  function handleGeneratePix() {
    void generatePixFor(amount);
  }

  return (
    <section className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.1fr)_350px]">
      <div className="min-w-0 border-y-4 border-orange-500 bg-white px-6 py-8 shadow-sm sm:px-10">
        <h2 className="font-site text-3xl text-orange-500">Doe com Pix</h2>
        <p className="mt-4 max-w-2xl text-sm text-slate-500 sm:text-base">
          Gere um QR Pix com o valor que desejar ou use a chave direta da
          associação. A contribuição ajuda a sustentar acolhimento, informação e
          iniciativas para pessoas com esclerose múltipla e doenças raras.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <label
              htmlFor="donation-amount"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
            >
              Valor da doação
            </label>
            <input
              id="donation-amount"
              value={amount}
              onChange={(event) =>
                setAmount(formatAmountInput(event.target.value))
              }
              placeholder="Ex: 50,00"
              inputMode="decimal"
              className="h-[54px] w-full border border-slate-300 px-4 py-3 text-slate-700 outline-none transition focus:border-orange-500"
            />
          </div>

          <button
            type="button"
            onClick={handleGeneratePix}
            disabled={loading}
            className="btn-main h-[54px] self-end px-8 py-0 disabled:cursor-not-allowed"
          >
            {loading ? 'Gerando...' : 'Gerar QR Pix'}
          </button>
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <div className="mt-8 border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Chave Pix
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <strong className="min-w-0 break-all text-slate-700">
              {pixKey}
            </strong>
            <button
              type="button"
              onClick={() => copyText(pixKey, 'Chave Pix copiada.')}
              className="border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:border-orange-500 hover:text-orange-500"
            >
              Copiar chave
            </button>
          </div>
        </div>

        {lastResponse?.payload ? (
          <div className="mt-6 border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Pix copia e cola
            </p>
            <p className="mt-3 break-all text-sm text-slate-600">
              {String(lastResponse.payload)}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  copyText(String(lastResponse.payload), 'Código Pix copiado.')
                }
                className="border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:border-orange-500 hover:text-orange-500"
              >
                Copiar código
              </button>
              {txid ? (
                <span className="text-xs uppercase tracking-[0.16em] text-slate-400">
                  TXID {txid}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        {copiedMessage ? (
          <p className="mt-4 text-sm text-green-700">{copiedMessage}</p>
        ) : null}
      </div>

      <aside className="min-w-0 border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex h-full flex-col">
          <div className="relative mx-auto aspect-square w-full max-w-full overflow-hidden border border-slate-200 bg-slate-50 sm:max-w-[300px]">
            {qrSrc ? (
              <Image
                src={qrSrc}
                alt="QR Code para doação via Pix"
                fill
                className="object-contain p-4"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-400">
                O QR Pix aparece aqui depois que o valor for gerado.
              </div>
            )}
          </div>

          <div className="mt-auto pt-10 space-y-5 text-base leading-8 text-slate-500">
            <p>
              1. Defina o valor ou deixe em branco para doar diretamente pela
              chave Pix.
            </p>
            <p>2. Gere o QR e escaneie no aplicativo do seu banco.</p>
            <p>3. Se preferir, use o código copia e cola.</p>
          </div>
        </div>
      </aside>
    </section>
  );
}
