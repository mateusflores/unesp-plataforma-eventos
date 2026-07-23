import { Link } from 'react-router-dom';
import { Instagram, Github, Linkedin } from 'lucide-react';
import { Logo } from './Logo';
import { DemoResetButton } from './DemoResetButton';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo />
          <p>A agenda universitária que reúne tudo o que acontece no seu campus em um só calendário.</p>
          <div className="footer__social">
            <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="#" aria-label="GitHub"><Github size={18} /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
          </div>
        </div>
        <div className="footer__cols">
          <div>
            <h4>Descobrir</h4>
            <Link to="/calendario">Calendário</Link>
            <Link to="/explorar">Explorar eventos</Link>
            <Link to="/organizadores">Organizadores</Link>
          </div>
          <div>
            <h4>Minha conta</h4>
            <Link to="/minha-agenda">Minha agenda</Link>
            <Link to="/meus-ingressos">Meus ingressos</Link>
            <Link to="/perfil">Perfil</Link>
          </div>
          <div>
            <h4>Organize</h4>
            <Link to="/organizador">Painel</Link>
            <Link to="/organizador/eventos/novo">Criar evento</Link>
            <Link to="/organizador/checkin">Check-in</Link>
          </div>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© 2026 Ágora · Projeto acadêmico — front-end com dados simulados.</span>
        <DemoResetButton />
      </div>
    </footer>
  );
}
