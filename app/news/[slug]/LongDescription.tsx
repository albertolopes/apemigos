'use client';

type Props = {
  html: string;
};

export function LongDescription({ html }: Props) {
  return (
    <div
      className="text-slate-600 py-6 max-w-3xl text-sm mx-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
