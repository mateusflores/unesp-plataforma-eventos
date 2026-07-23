import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';
import './auth.css';

const destaques = [
  'Todos os eventos do campus em um só calendário',
  'Inscrição em eventos gratuitos e compra de ingressos',
  'Ingresso digital com QR Code e check-in rápido',
];

export function AuthShell({ titulo, subtitulo, children }: { titulo: string; subtitulo: string; children: ReactNode }) {
  return (
    <div className="auth">
      <div className="auth__aside">
        <div className="auth__aside-top">
          <Logo tamanho={34} />
        </div>
        <div className="auth__aside-mid">
          <h2>Sua vida universitária, toda organizada.</h2>
          <ul>
            {destaques.map((d) => (
              <li key={d}>
                <span className="auth__check">✓</span> {d}
              </li>
            ))}
          </ul>
        </div>
        <p className="auth__aside-foot">Projeto acadêmico · Ambiente de demonstração com dados simulados.</p>
      </div>
      <div className="auth__main">
        <div className="auth__card">
          <div className="auth__mobilelogo">
            <Link to="/"><Logo tamanho={32} /></Link>
          </div>
          <h1>{titulo}</h1>
          <p className="text-secondary">{subtitulo}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
