import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { OrganizerLayout } from './layouts/OrganizerLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Públicas / participante
import { HomePage } from './pages/public/HomePage';
import { CalendarPage } from './pages/public/CalendarPage';
import { ExplorePage } from './pages/public/ExplorePage';
import { EventDetailsPage } from './pages/public/EventDetailsPage';
import { OrganizersPage } from './pages/public/OrganizersPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { CheckoutPage } from './pages/participant/CheckoutPage';
import { MinhaAgendaPage } from './pages/participant/MinhaAgendaPage';
import { MeusIngressosPage } from './pages/participant/MeusIngressosPage';
import { PerfilPage } from './pages/participant/PerfilPage';

// Organizador
import { OrgDashboardPage } from './pages/organizer/DashboardPage';
import { OrgEventosPage } from './pages/organizer/MeusEventosPage';
import { OrgEventoFormPage } from './pages/organizer/EventoFormPage';
import { OrgIngressosPage } from './pages/organizer/IngressosPage';
import { OrgCuponsPage } from './pages/organizer/CuponsPage';
import { OrgParticipantesPage } from './pages/organizer/ParticipantesPage';
import { OrgCheckInPage } from './pages/organizer/CheckInPage';

// Admin
import { AdminOverviewPage } from './pages/admin/OverviewPage';
import { AdminUniversidadesPage } from './pages/admin/UniversidadesPage';
import { AdminCampiPage } from './pages/admin/CampiPage';
import { AdminUsuariosPage } from './pages/admin/UsuariosPage';
import { AdminOrganizadoresPage } from './pages/admin/OrganizadoresPage';
import { AdminCategoriasPage } from './pages/admin/CategoriasPage';
import { AdminTagsPage } from './pages/admin/TagsPage';
import { AdminEventosPage } from './pages/admin/EventosAdminPage';

// Sistema
import { NotFoundPage } from './pages/system/NotFoundPage';
import { ForbiddenPage } from './pages/system/ForbiddenPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Público + participante */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/calendario" element={<CalendarPage />} />
          <Route path="/explorar" element={<ExplorePage />} />
          <Route path="/organizadores" element={<OrganizersPage />} />
          <Route path="/eventos/:slug" element={<EventDetailsPage />} />

          <Route
            path="/checkout/:slug"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/minha-agenda"
            element={
              <ProtectedRoute papeis={['PARTICIPANTE', 'ORGANIZADOR', 'ADMIN']}>
                <MinhaAgendaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meus-ingressos"
            element={
              <ProtectedRoute>
                <MeusIngressosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <PerfilPage />
              </ProtectedRoute>
            }
          />
          <Route path="/403" element={<ForbiddenPage />} />
        </Route>

        {/* Autenticação (sem navbar padrão) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />

        {/* Organizador */}
        <Route
          element={
            <ProtectedRoute papeis={['ORGANIZADOR', 'ADMIN']}>
              <OrganizerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/organizador" element={<OrgDashboardPage />} />
          <Route path="/organizador/eventos" element={<OrgEventosPage />} />
          <Route path="/organizador/eventos/novo" element={<OrgEventoFormPage />} />
          <Route path="/organizador/eventos/:id/editar" element={<OrgEventoFormPage />} />
          <Route path="/organizador/ingressos" element={<OrgIngressosPage />} />
          <Route path="/organizador/cupons" element={<OrgCuponsPage />} />
          <Route path="/organizador/participantes" element={<OrgParticipantesPage />} />
          <Route path="/organizador/checkin" element={<OrgCheckInPage />} />
        </Route>

        {/* Admin */}
        <Route
          element={
            <ProtectedRoute papeis={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminOverviewPage />} />
          <Route path="/admin/universidades" element={<AdminUniversidadesPage />} />
          <Route path="/admin/campi" element={<AdminCampiPage />} />
          <Route path="/admin/usuarios" element={<AdminUsuariosPage />} />
          <Route path="/admin/organizadores" element={<AdminOrganizadoresPage />} />
          <Route path="/admin/categorias" element={<AdminCategoriasPage />} />
          <Route path="/admin/tags" element={<AdminTagsPage />} />
          <Route path="/admin/eventos" element={<AdminEventosPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
