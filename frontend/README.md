# Ágora — Agenda Universitária

Plataforma universitária centralizada para **descoberta, organização e participação em eventos**: palestras, festas, workshops, semanas acadêmicas, minicursos, competições, feiras e muito mais — tudo em um só calendário.

Este repositório contém **apenas o front-end**, construído com dados **mockados** e preparado desde o início para integração futura com uma API REST, sem exigir reconstrução das páginas ou componentes.

> Projeto acadêmico. Nenhum pagamento, e-mail, QR Code ou upload é real — tudo é simulado no navegador.

---

## ✨ Destaques

- **Calendário** como elemento central: visualização por **mês, semana e lista**, navegação temporal, destaque para o dia atual, contador de eventos por dia, cores por categoria, resumo do evento em modal e ação "ver mais" quando há muitos eventos no dia.
- **Três perfis** com rotas protegidas: **Participante**, **Organizador** e **Administrador**.
- **Autenticação simulada** com contas de demonstração (troca de perfil sem back-end).
- Fluxos completos: inscrição em evento gratuito, **checkout** simulado (Pix/Cartão/Boleto, cupom, resumo), **ingresso digital com QR Code**, **check-in** por leitura simulada.
- **Design system próprio** (tokens, componentes, estados), tema **claro/escuro**, responsivo (desktop → mobile).
- Todos os estados de tela tratados: **loading, success, empty, error, 401, 403, 404, offline**.
- **Camada de serviços trocável**: mock ↔ API real via uma única variável de ambiente.

---

## 🚀 Como executar

Requisitos: **Node.js 18+** (recomendado **Node 22** — o Node 14 quebra o Vite).

```bash
# 1. Instalar dependências
npm install

# 2. Ambiente de desenvolvimento
npm run dev
# abre em http://localhost:5173

# 3. Build de produção
npm run build && npm run preview
```

Se você usa **nvm**:

```bash
nvm use 22   # ou: nvm install 22 && nvm use 22
```

### Contas de demonstração

Na tela de **Login** (`/login`) há um seletor de contas — um clique já entra no perfil:

| Perfil          | Nome                | E-mail            |
| --------------- | ------------------- | ----------------- |
| Participante    | Ana Beatriz Souza   | `ana@agora.dev`   |
| Organizador     | Bruno Carvalho Lima | `bruno@agora.dev` |
| Administrador   | Carla Menezes       | `admin@agora.dev` |

> No login manual, qualquer senha não vazia é aceita (autenticação simulada).

No rodapé há o botão **"Reiniciar dados da demo"**, que restaura todos os dados mockados ao estado inicial.

---

## ⚙️ Configuração (mock ↔ API)

Arquivo `.env` (veja `.env.example`):

```env
VITE_USE_MOCKS=true                    # true = mocks | false = API real
VITE_API_BASE_URL=http://localhost:8080
VITE_MOCK_DELAY=600                    # latência simulada (ms) dos serviços mock
```

Enquanto `VITE_USE_MOCKS=true`, a aplicação usa os serviços simulados. Ao definir `false`,
ela passa a consumir a API real — **sem alterar nenhum componente**. Veja
[`docs/INTEGRACAO.md`](docs/INTEGRACAO.md) para os detalhes da substituição.

---

## 🗂️ Arquitetura de pastas

```
src/
├─ assets/
├─ components/        # UI e componentes de domínio
│  ├─ ui/             # design system (Button, Badge, Modal, Drawer, Table…)
│  ├─ events/         # EventCard, EventFilters, EventCover, badges
│  ├─ calendar/       # Calendar (mês/semana/lista) + utilitários
│  ├─ admin/          # DataTable, ConfirmDialog
│  └─ layout/         # Navbar, Footer, Sidebar, ProtectedRoute
├─ pages/             # páginas por área (public, auth, participant, organizer, admin, system)
├─ layouts/           # PublicLayout, AppShell, OrganizerLayout, AdminLayout
├─ services/          # camada de serviços
│  ├─ contracts.ts    # interfaces (contrato único mock/API)
│  ├─ mocks/          # implementação mockada + store
│  ├─ api/            # implementação HTTP real (REST)
│  └─ index.ts        # factory: escolhe mock ou API
├─ data/              # dados mockados (pt-BR) por entidade
├─ types/             # tipos de domínio (baseados em docs/referencias/plantuml.txt)
├─ contexts/          # Auth, Toast, Catalog
├─ hooks/             # useAsync, useDebounce, useTheme, useOrganizer
├─ utils/             # formatação e helpers de domínio
├─ styles/            # tokens, base, utilitários, estilos de página
└─ config/            # env
```

---

## 🧭 Rotas principais

| Rota                                   | Acesso        | Descrição                              |
| -------------------------------------- | ------------- | -------------------------------------- |
| `/`                                    | Público       | Página inicial                         |
| `/calendario`                          | Público       | Calendário (mês/semana/lista)          |
| `/explorar`                            | Público       | Grade de eventos com filtros           |
| `/eventos/:slug`                       | Público       | Detalhes do evento + inscrição/compra  |
| `/organizadores`                       | Público       | Organizadores em destaque              |
| `/login` · `/cadastro` · `/recuperar-senha` | Público  | Autenticação simulada                  |
| `/checkout/:slug`                      | Autenticado   | Checkout de ingressos                  |
| `/minha-agenda` · `/meus-ingressos` · `/perfil` | Participante | Área do participante          |
| `/organizador/*`                       | Organizador   | Dashboard, eventos, ingressos, cupons, participantes, check-in |
| `/admin/*`                             | Administrador | Universidades, campi, usuários, eventos, categorias, tags |

Rotas protegidas redirecionam para `/login` (não autenticado) ou `/403` (perfil sem permissão).

---

## 🛠️ Tecnologias

- **React 18** + **TypeScript** + **Vite**
- **React Router 6**
- **lucide-react** (ícones)
- **CSS moderno** com design tokens (custom properties), sem framework de UI pronto

> Sem Bootstrap. Sem dependências desnecessárias. Calendário e QR Code são componentes próprios.

---

## 📄 Documentação adicional

- [`docs/INTEGRACAO.md`](docs/INTEGRACAO.md) — onde e como substituir os mocks pela API real.
