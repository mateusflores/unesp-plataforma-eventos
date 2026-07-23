import { Link } from 'react-router-dom';

export function Logo({ tamanho = 32 }: { tamanho?: number }) {
  return (
    <Link to="/" className="logo" aria-label="Ágora — página inicial">
      <svg width={tamanho} height={tamanho} viewBox="0 0 32 32" fill="none" aria-hidden>
        <rect width="32" height="32" rx="8" fill="var(--brand-600)" />
        <path
          d="M9 22V10.5C9 9.67 9.67 9 10.5 9H16C19.3 9 22 11.7 22 15C22 18.3 19.3 21 16 21H12.5V22"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="22" cy="22" r="2.6" fill="var(--accent-500)" />
      </svg>
      <span className="logo__nome">Ágora</span>
    </Link>
  );
}
