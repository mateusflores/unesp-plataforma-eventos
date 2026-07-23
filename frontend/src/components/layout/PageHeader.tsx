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
    <div className="page-head row-between gap-4 wrap">
      <div>
        <h1 className="page-head__titulo">{titulo}</h1>
        {subtitulo && <p className="page-head__sub">{subtitulo}</p>}
      </div>
      {acoes && <div className="row gap-2 wrap">{acoes}</div>}
    </div>
  );
}
