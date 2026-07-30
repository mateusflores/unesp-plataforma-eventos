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

    <header className="relative z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="container-wide mx-auto flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            className="rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            onClick={() => setMenuAberto((v) => !v)}
            aria-label="Abrir menu"
            aria-expanded={menuAberto}
          >
            {menuAberto ? <X size={22} /> : <Menu size={22} />}
          </button>
          <Logo />

          <nav className="hidden items-center gap-2 md:flex" aria-label="Navegação principal">
            {linksPublicos.map((l) => (
              <NavLink
                key={l.para}
                to={l.para}
                className={({ isActive }) => `rounded-full px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'}`}
              >
                {l.rotulo}
              </NavLink>
            ))}
          </nav>
        </div>


        <form className="hidden flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 md:flex" onSubmit={submeterBusca} role="search">
          <Search size={17} />
          <input
            className="w-full border-none bg-transparent text-sm outline-none placeholder:text-slate-400"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar eventos, festas, workshops…"
            aria-label="Buscar eventos"
          />
        </form>


        <div className="flex items-center gap-2">
          <button className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white" onClick={alternar} aria-label="Alternar tema" title="Alternar tema">
            {tema === 'light' ? <Moon size={19} /> : <Sun size={19} />}
          </button>

          {autenticado && usuario ? (

            <div className="relative" ref={perfilRef}>
              <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800" onClick={() => setPerfilAberto((v) => !v)} aria-expanded={perfilAberto}>
                <Avatar nome={usuario.nome} cor={usuario.avatarCor} tamanho={32} />
                <span className="hidden md:inline">{usuario.nome.split(' ')[0]}</span>
                <ChevronDown size={15} className="hidden md:block" />
              </button>
              {perfilAberto && (
                <div className="absolute right-0 z-20 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900" role="menu">
                  <div className="flex items-center gap-3 border-b border-slate-200 px-2 pb-3 dark:border-slate-800">
                    <Avatar nome={usuario.nome} cor={usuario.avatarCor} tamanho={40} />
                    <div>
                      <strong className="block text-sm text-slate-900 dark:text-white">{usuario.nome}</strong>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{usuario.email}</span>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <MenuLink para="/minha-agenda" icone={<CalendarDays size={16} />} onClick={() => setPerfilAberto(false)}>Minha agenda</MenuLink>
                    <MenuLink para="/meus-ingressos" icone={<Ticket size={16} />} onClick={() => setPerfilAberto(false)}>Meus ingressos</MenuLink>
                    <MenuLink para="/perfil" icone={<User size={16} />} onClick={() => setPerfilAberto(false)}>Meu perfil</MenuLink>
                    {(papel === 'ORGANIZADOR' || papel === 'ADMIN') && (
                      <MenuLink para="/organizador" icone={<LayoutDashboard size={16} />} onClick={() => setPerfilAberto(false)}>Painel do organizador</MenuLink>
                    )}
                    {papel === 'ADMIN' && (
                      <MenuLink para="/admin" icone={<Shield size={16} />} onClick={() => setPerfilAberto(false)}>Administração</MenuLink>
                    )}
                  </div>
                  <div className="mt-3 border-t border-slate-200 pt-2 dark:border-slate-800">
                    <button
                      className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/40"
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
                </div>
              )}
            </div>
          ) : (
            <>

              <Link to="/login" className="hidden md:inline-flex">
                <Button variante="ghost" tamanho="sm">Entrar</Button>
              </Link>
              <Link to="/cadastro" className="hidden md:inline-flex">
                <Button tamanho="sm" iconeEsq={<Sparkles size={15} />}>Criar conta</Button>
              </Link>
            </>
          )}
        </div>
      </div>


      {menuAberto && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <form className="mb-3 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500" onSubmit={submeterBusca} role="search">
            <Search size={17} />
            <input className="w-full border-none bg-transparent text-sm outline-none placeholder:text-slate-400" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar eventos…" aria-label="Buscar" />
          </form>
          <div className="space-y-1">
            {linksPublicos.map((l) => (
              <NavLink key={l.para} to={l.para} className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" onClick={() => setMenuAberto(false)}>
                {l.rotulo}
              </NavLink>
            ))}
          </div>
          {!autenticado && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Link to="/login" onClick={() => setMenuAberto(false)}>
                <Button variante="secondary" bloco>Entrar</Button>
              </Link>
              <Link to="/cadastro" onClick={() => setMenuAberto(false)}>
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

    <Link to={para} className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" role="menuitem" onClick={onClick}>
      {icone} {children}
    </Link>
  );
}
