import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export function PublicLayout() {
  return (
    <>
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <Navbar />
      <main id="conteudo" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
