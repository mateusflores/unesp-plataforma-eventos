import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { CatalogProvider } from './contexts/CatalogContext';
<<<<<<< HEAD
=======
import './index.css';
>>>>>>> 604fa8e (Migração para Tailwind e ajustes de build)
import './styles/tokens.css';
import './styles/base.css';
import './styles/utilities.css';
import './components/ui/ui.css';
import './styles/pages.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CatalogProvider>
            <App />
          </CatalogProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
