import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar';

export interface ItemShell {
  para: string;
  rotulo: string;
  icone: ReactNode;
  fim?: boolean;
  badge?: ReactNode;
}

export interface GrupoShell {
  titulo?: string;
  itens: ItemShell[];
}

export function AppShell({ grupos, titulo }: { grupos: GrupoShell[]; titulo: string }) {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <>
      <Navbar />
      <div className="shell">
        <aside className={`shell__aside ${menuAberto ? 'is-open' : ''}`}>
          {grupos.map((g, gi) => (
            <div key={gi}>
              {g.titulo && <div className="shell__grupo">{g.titulo}</div>}
              {g.itens.map((it) => (
                <NavLink
                  key={it.para}
                  to={it.para}
                  end={it.fim}
                  className={({ isActive }) => `shell__link ${isActive ? 'is-active' : ''}`}
                  onClick={() => setMenuAberto(false)}
                >
                  {it.icone}
                  <span>{it.rotulo}</span>
                  {it.badge}
                </NavLink>
              ))}
            </div>
          ))}
        </aside>
        {menuAberto && (
          <div className="drawer-overlay hide-desktop" onClick={() => setMenuAberto(false)} style={{ zIndex: 390 }} />
        )}
        <main className="shell__main">
          <div className="shell__topbar">
            <button className="navbar__icon-btn" onClick={() => setMenuAberto(true)} aria-label="Abrir menu lateral">
              <Menu size={20} />
            </button>
            <strong>{titulo}</strong>
          </div>
          <Outlet />
        </main>
      </div>
    </>
  );
}
