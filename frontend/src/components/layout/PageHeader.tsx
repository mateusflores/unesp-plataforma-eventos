import type { ReactNode } from 'react';

export function PageHeader({
  titulo,
  subtitulo,
  acoes,
}: {
  titulo: string;
  subtitulo?: string;
  acoes?: ReactNode;
}) {
  return (

    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{titulo}</h1>
        {subtitulo && <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">{subtitulo}</p>}
      </div>
      {acoes && <div className="flex flex-wrap items-center gap-2">{acoes}</div>}
    </div>
  );
}
