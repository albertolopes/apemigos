export function EventStatusBadge({ open }: { open?: boolean }) {
  return (
    <span
      className={`inline-flex w-fit items-center px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
        open ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
      }`}
    >
      {open ? 'Inscrições abertas' : 'Inscrições encerradas'}
    </span>
  );
}
