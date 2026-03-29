'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { pixService } from '../../../services/pix/pix.service';

export default function DonateBanner() {
  const pixKey = 'apemigos.em@gmail.com';
  const [amount, setAmount] = useState('');
  const [qrSrc, setQrSrc] = useState<string | null>(null);
  const [txid, setTxid] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAmount, setModalAmount] = useState('');
  const [lastResponse, setLastResponse] = useState<any | null>(null);

  function formatAmountInput(v: string) {
    // allow digits and comma/dot, keep the user's comma if they type it
    const cleaned = v.replace(/[^0-9,\.]/g, '');
    // limit to at most one separator (comma or dot) visually: if user types multiple, keep first
    const firstComma = cleaned.indexOf(',');
    const firstDot = cleaned.indexOf('.');
    // if both present, prefer the earliest one as decimal separator and remove other separators
    if (firstComma >= 0 && firstDot >= 0) {
      // decide which comes first
      const sep = firstComma < firstDot ? ',' : '.';
      // remove all other separators
      const parts = cleaned.split(/[,\.]/);
      return parts[0] + sep + parts.slice(1).join('').slice(0, 2);
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

  function normalizeToFloatString(s: string) {
    if (!s) return '';
    // Replace commas with dot to normalize decimal separator
    let replaced = s.replace(/,/g, '.');
    // remove any non-digit/dot
    replaced = replaced.replace(/[^0-9.]/g, '');
    // keep only the first dot as decimal separator
    const parts = replaced.split('.');
    if (parts.length <= 1) return parts[0];
    return parts[0] + '.' + parts.slice(1).join('').slice(0, 2);
  }

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = formatAmountInput(e.target.value);
    setAmount(v);
  }

  function handleModalAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setModalAmount(formatAmountInput(e.target.value));
  }

  async function generatePixFor(value?: string) {
    setError(null);
    setLoading(true);
    const raw = (value ?? modalAmount ?? amount) || '';
    const normalized = normalizeToFloatString(raw);

    if (normalized) {
      const numeric = Number(parseFloat(normalized));
      if (isNaN(numeric) || numeric <= 0) {
        setError('Informe um valor válido maior que zero (ex: 50 ou 50.00)');
        setLoading(false);
        return null;
      }
    }

    try {
      const numeric = normalized
        ? Number(parseFloat(normalized).toFixed(2))
        : undefined;
      const data = await pixService.createStatic(numeric);

      setLastResponse(data || null);

      if (data?.qrCodeBase64) {
        const src = data.qrCodeBase64.startsWith('data:')
          ? data.qrCodeBase64
          : `data:image/png;base64,${data.qrCodeBase64}`;
        setQrSrc(src);
      } else if (data?.payload) {
        // render the payload via an external QR generator (backend already returned payload)
        setQrSrc(
          `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
            data.payload
          )}`
        );
      } else {
        setQrSrc(null);
      }

      if (data?.txid) setTxid(data.txid);
      if (raw) {
        // keep the displayed format the user typed (comma or dot)
        setAmount(raw);
        setModalAmount(raw);
      }
      setLoading(false);
      return data?.qrCodeBase64 || data?.payload || null;
    } catch (e: any) {
      console.error('Erro ao gerar pix via backend', e);
      setError(
        'Não foi possível gerar o QR no servidor. Tente novamente mais tarde.'
      );
      setLoading(false);
      return null;
    }
  }

  async function handleCopyPayload() {
    if (!lastResponse?.payload) return;
    try {
      await navigator.clipboard.writeText(lastResponse.payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setError('Não foi possível copiar o payload');
    }
  }
  return (
    <section className="w-full py-8">
      <div className="w-full">
        <div className="bg-white border rounded-lg shadow-sm p-6 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-site text-2xl text-orange-500 mb-2">
                Doação e Solidariedade
              </h3>
              <p className="text-slate-600 text-sm">
                Sua contribuição ajuda a manter projetos, apoio e informação
                para pessoas com esclerose múltipla. Toda doação faz diferença —
                mesmo valores pequenos nos ajudam a continuar o trabalho.
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Doe ou{' '}
                <a href="/contact" className="text-orange-500 underline">
                  entre em contato
                </a>{' '}
                para saber mais.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="#doar"
                onClick={(e) => {
                  e.preventDefault();
                  setModalAmount(amount || '');
                  setModalOpen(true);
                }}
                className="btn-main bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
              >
                Doar agora
              </a>

              <a
                href="/contact"
                className="text-slate-700 px-4 py-2 rounded border border-slate-200 hover:bg-slate-50 text-sm"
              >
                Fale conosco
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 z-10">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-site text-lg">Doar</h4>
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Fechar"
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <label className="text-xs text-slate-500 font-semibold block mb-1">
              Valor da doação (R$)
            </label>
            <input
              value={modalAmount}
              onChange={handleModalAmountChange}
              placeholder="Ex: 50.00"
              className="mb-3 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              inputMode="decimal"
            />

            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => generatePixFor(modalAmount)}
                className="px-3 py-2 bg-slate-800 text-white rounded hover:bg-slate-900 disabled:opacity-60 flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"
                      ></path>
                    </svg>
                    Gerando...
                  </>
                ) : (
                  'Gerar QR Pix'
                )}
              </button>
            </div>

            {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

            {qrSrc ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-48 h-48 relative">
                  <Image
                    src={qrSrc as string}
                    alt="QR Pix"
                    className="object-contain"
                    fill
                    unoptimized
                  />
                </div>
                <p className="text-sm">
                  Chave PIX: <strong>{pixKey}</strong>
                </p>
                <p className="text-sm text-slate-500 text-center">
                  Abra seu app bancário, escaneie o QR ou copie a chave para
                  efetuar a doação.
                </p>

                {/* Copiar payload logo abaixo do QR (se disponível) */}
                {lastResponse?.payload && (
                  <div className="w-full mt-3 flex flex-col items-center">
                    <div className="w-full bg-slate-50 border border-slate-100 p-2 rounded text-xs text-slate-700 break-words max-h-40 overflow-auto">
                      {String(lastResponse.payload)}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleCopyPayload}
                        className="px-3 py-1 text-xs border rounded bg-white hover:bg-slate-50"
                        disabled={!lastResponse.payload}
                      >
                        pix copia e cola
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-slate-500">
                {loading
                  ? 'Gerando QR Pix...'
                  : 'Preencha um valor e clique em "Gerar QR Pix" para receber o QR.'}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-3 py-2 text-sm border rounded border-slate-200 hover:bg-slate-50"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>

  );
}
