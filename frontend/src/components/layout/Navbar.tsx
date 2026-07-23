import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  Menu,
  X,
  Moon,
  Sun,
  CalendarDays,
  Ticket,
  LayoutDashboard,
  Shield,
  LogOut,
  User,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Logo } from './Logo';
import { Avatar, Button } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import './layout.css';

const linksPublicos = [
  { para: '/calendario', rotulo: 'Calendário' },
  { para: '/explorar', rotulo: 'Explorar' },
  { para: '/organizadores', rotulo: 'Organizadores' },
];

export function Navbar() {
  const { usuario, autenticado, papel, logout } = useAuth();
  const { tema, alternar } = useTheme();
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);
  const [perfilAberto, setPerfilAberto] = useState(false);
  const perfilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (perfilRef.current && !perfilRef.current.contains(e.target as Node)) setPerfilAberto(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const submeterBusca = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explorar?busca=${encodeURIComponent(busca)}`);
    setMenuAberto(false);
  };

  return (
    <header className="navbar">
      <div className="container-wide navbar__inner">
        <div className="navbar__left">
          <button
            className="navbar__burger hide-desktop"
            onClick={() => setMenuAberto((v) => !v)}
            aria-label="Abrir menu"
            aria-expanded={menuAberto}
          >
            {menuAberto ? <X size={22} /> : <Menu size={22} />}
          </button>
          <Logo />
          <nav className="navbar__nav hide-mobile" aria-label="Navegação principal">
            {linksPublicos.map((l) => (
              <NavLink key={l.para} to={l.para} className={({ isActive }) => `navbar__link ${isActive ? 'is-active' : ''}`}>
                {l.rotulo}
              </NavLink>
            ))}
          </nav>
        </div>

        <form className="navbar__search hide-mobile" onSubmit={submeterBusca} role="search">
          <Search size={17} />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar eventos, festas, workshops…"
            aria-label="Buscar eventos"
          />
        </form>

        <div className="navbar__right">
          <button className="navbar__icon-btn" onClick={alternar} aria-label="Alternar tema" title="Alternar tema">
            {tema === 'light' ? <Moon size={19} /> : <Sun size={19} />}
          </button>

          {autenticado && usuario ? (
            <div className="navbar__perfil" ref={perfilRef}>
              <button className="navbar__perfil-btn" onClick={() => setPerfilAberto((v) => !v)} aria-expanded={perfilAberto}>
                <Avatar nome={usuario.nome} cor={usuario.avatarCor} tamanho={32} />
                <span className="navbar__perfil-nome hide-mobile">{usuario.nome.split(' ')[0]}</span>
                <ChevronDown size={15} className="hide-mobile" />
              </button>
              {perfilAberto && (
                <div className="menu-drop" role="menu">
                  <div className="menu-drop__header">
                    <Avatar nome={usuario.nome} cor={usuario.avatarCor} tamanho={40} />
                    <div>
                      <strong>{usuario.nome}</strong>
                      <span>{usuario.email}</span>
                    </div>
                  </div>
                  <div className="menu-drop__sep" />
                  <MenuLink para="/minha-agenda" icone={<CalendarDays size={16} />} onClick={() => setPerfilAberto(false)}>
                    Minha agenda
                  </MenuLink>
                  <MenuLink para="/meus-ingressos" icone={<Ticket size={16} />} onClick={() => setPerfilAberto(false)}>
                    Meus ingressos
                  </MenuLink>
                  <MenuLink para="/perfil" icone={<User size={16} />} onClick={() => setPerfilAberto(false)}>
                    Meu perfil
                  </MenuLink>
                  {(papel === 'ORGANIZADOR' || papel === 'ADMIN') && (
                    <MenuLink para="/organizador" icone={<LayoutDashboard size={16} />} onClick={() => setPerfilAberto(false)}>
                      Painel do organizador
                    </MenuLink>
                  )}
                  {papel === 'ADMIN' && (
                    <MenuLink para="/admin" icone={<Shield size={16} />} onClick={() => setPerfilAberto(false)}>
                      Administração
                    </MenuLink>
                  )}
                  <div className="menu-drop__sep" />
                  <button
                    className="menu-drop__item menu-drop__item--danger"
                    role="menuitem"
                    onClick={() => {
                      logout();
                      setPerfilAberto(false);
                      navigate('/');
                    }}
                  >
                    <LogOut size={16} /> Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="hide-mobile">
                <Button variante="ghost" tamanho="sm">Entrar</Button>
              </Link>
              <Link to="/cadastro" className="hide-mobile">
                <Button tamanho="sm" iconeEsq={<Sparkles size={15} />}>Criar conta</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Menu mobile */}
      {menuAberto && (
        <div className="navbar__mobile hide-desktop">
          <form className="navbar__search navbar__search--mobile" onSubmit={submeterBusca} role="search">
            <Search size={17} />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar eventos…" aria-label="Buscar" />
          </form>
          {linksPublicos.map((l) => (
            <NavLink key={l.para} to={l.para} className="navbar__mobile-link" onClick={() => setMenuAberto(false)}>
              {l.rotulo}
            </NavLink>
          ))}
          {!autenticado && (
            <div className="row gap-3 mt-2">
              <Link to="/login" style={{ flex: 1 }} onClick={() => setMenuAberto(false)}>
                <Button variante="secondary" bloco>Entrar</Button>
              </Link>
              <Link to="/cadastro" style={{ flex: 1 }} onClick={() => setMenuAberto(false)}>
                <Button bloco>Criar conta</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function MenuLink({
  para,
  icone,
  children,
  onClick,
}: {
  para: string;
  icone: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link to={para} className="menu-drop__item" role="menuitem" onClick={onClick}>
      {icone} {children}
    </Link>
  );
}
