import React, { useEffect } from 'react';

type NotificationProps = {
  open: boolean;
  type?: 'success' | 'error' | 'info';
  message?: string | null;
  duration?: number; // ms
  onClose?: () => void;
};

export default function Notification({
  open,
  type = 'info',
  message,
  duration = 6000,
  onClose,
}: NotificationProps) {
  useEffect(() => {
    if (!open) return;
    if (!duration || duration <= 0) return;

    const t = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open || !message) return null;

  const base =
    'max-w-md w-full shadow-lg rounded-lg p-4 flex items-start gap-3';
  const styles: Record<string, string> = {
    success: 'bg-green-50 border border-green-200 text-green-800',
    error: 'bg-red-50 border border-red-200 text-red-800',
    info: 'bg-slate-50 border border-slate-200 text-slate-800',
  };

  const colorClass = styles[type] || styles.info;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 sm:bottom-8 sm:right-8"
    >
      <div className={`${base} ${colorClass}`}>
        <div className="flex-1">
          <div className="font-semibold">
            {type === 'success'
              ? 'Sucesso'
              : type === 'error'
              ? 'Erro'
              : 'Informação'}
          </div>
          <div className="text-sm mt-1">{message}</div>
        </div>

        <button
          aria-label="Fechar notificação"
          onClick={() => onClose?.()}
          className="ml-2 text-sm font-semibold px-2 py-1 rounded hover:opacity-80"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
