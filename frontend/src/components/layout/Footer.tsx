import { Link } from 'react-router-dom';
import { Instagram, Github, Linkedin } from 'lucide-react';
import { Logo } from './Logo';
import { DemoResetButton } from './DemoResetButton';

export function Footer() {
  return (

    <footer className="border-t border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="container flex flex-col gap-10 py-10 lg:flex-row lg:justify-between">
        <div className="max-w-md space-y-4">
          <Logo />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A agenda universitária que reúne tudo o que acontece no seu campus em um só calendário.
          </p>
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <a href="#" aria-label="Instagram" className="rounded-full border border-slate-200 p-2 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:hover:border-brand-400">
              <Instagram size={18} />
            </a>
            <a href="#" aria-label="GitHub" className="rounded-full border border-slate-200 p-2 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:hover:border-brand-400">
              <Github size={18} />
            </a>
            <a href="#" aria-label="LinkedIn" className="rounded-full border border-slate-200 p-2 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:hover:border-brand-400">
              <Linkedin size={18} />
            </a>
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">Descobrir</h4>
            <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Link to="/calendario" className="transition hover:text-brand-600">Calendário</Link>
              <Link to="/explorar" className="transition hover:text-brand-600">Explorar eventos</Link>
              <Link to="/organizadores" className="transition hover:text-brand-600">Organizadores</Link>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">Minha conta</h4>
            <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Link to="/minha-agenda" className="transition hover:text-brand-600">Minha agenda</Link>
              <Link to="/meus-ingressos" className="transition hover:text-brand-600">Meus ingressos</Link>
              <Link to="/perfil" className="transition hover:text-brand-600">Perfil</Link>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">Organize</h4>
            <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Link to="/organizador" className="transition hover:text-brand-600">Painel</Link>
              <Link to="/organizador/eventos/novo" className="transition hover:text-brand-600">Criar evento</Link>
              <Link to="/organizador/checkin" className="transition hover:text-brand-600">Check-in</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container flex flex-col gap-3 border-t border-slate-200 py-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Ágora · Projeto acadêmico — front-end com dados simulados.</span>
        <DemoResetButton />
      </div>
    </footer>
  );
}
