# Guia de Integração — do Mock para a API real

Este front-end foi desenhado para trocar os dados mockados por uma API REST **sem
alterar páginas nem componentes**. Toda a lógica de acesso a dados está isolada na
**camada de serviços**.

---

## 1. A ideia central

Os componentes **nunca** importam mocks diretamente. Eles importam sempre de
`@/services`:

```ts
import { services } from '@/services';

const { itens } = await services.events.listar(filtros);
```

Quem decide se `services` é a implementação **mock** ou a **API real** é um único
arquivo — [`src/services/index.ts`](../src/services/index.ts):

```ts
export const services: Services = env.useMocks ? mockServices : apiServices;
```

E `env.useMocks` vem da variável de ambiente `VITE_USE_MOCKS`.

```
Componentes ──► services (contrato) ──► mock  (VITE_USE_MOCKS=true)
                                    └──► API   (VITE_USE_MOCKS=false)
```

---

## 2. Como ativar a API real

1. No arquivo `.env`:

   ```env
   VITE_USE_MOCKS=false
   VITE_API_BASE_URL=https://sua-api.com
   ```

2. Reinicie o `npm run dev`. Pronto — a aplicação passa a chamar a API real.

Nenhuma outra mudança é necessária na interface.

---

## 3. O contrato de serviços

O arquivo [`src/services/contracts.ts`](../src/services/contracts.ts) define as
interfaces que **ambas** as implementações seguem (`AuthService`, `EventService`,
`PurchaseService`, `CheckInService`, `AdminService`, etc.). É o "contrato" entre o
front-end e o back-end.

- **Mock:** [`src/services/mocks/index.ts`](../src/services/mocks/index.ts) — usa um
  _store_ em memória semeado a partir de `src/data`, com persistência opcional em
  `localStorage` e latência simulada.
- **API real:** [`src/services/api/index.ts`](../src/services/api/index.ts) — mapeia
  cada método para um endpoint REST usando o cliente [`http`](../src/services/api/http.ts).

Se o back-end existir com contrato diferente, basta ajustar os **endpoints** em
`src/services/api/index.ts` (e, se necessário, mapear o formato de resposta) —
sem tocar nos componentes.

---

## 4. Mapa de endpoints proposto

A implementação `apiServices` já sugere um mapeamento REST. Exemplos:

| Serviço                          | Método HTTP | Endpoint                               |
| -------------------------------- | ----------- | -------------------------------------- |
| `auth.login`                     | POST        | `/auth/login`                          |
| `events.listar`                  | GET         | `/eventos?busca=&universidadeId=&…`    |
| `events.porSlug`                 | GET         | `/eventos/slug/:slug`                  |
| `events.criar`                   | POST        | `/eventos`                             |
| `events.publicar`                | PATCH       | `/eventos/:id/publicar`                |
| `registrations.inscrever`        | POST        | `/inscricoes`                          |
| `coupons.validar`                | POST        | `/cupons/validar`                      |
| `purchases.criar`                | POST        | `/compras`                             |
| `tickets.doUsuario`              | GET         | `/usuarios/:id/ingressos`              |
| `checkin.registrar`              | POST        | `/checkin`                             |
| `admin.metricas`                 | GET         | `/admin/metricas`                      |

A lista completa está em `src/services/api/index.ts`.

---

## 5. Autenticação

- O contexto [`AuthContext`](../src/contexts/AuthContext.tsx) guarda o usuário logado
  (em `localStorage`, apenas para a demonstração).
- O cliente HTTP já suporta **token Bearer** via `setAuthToken(token)` em
  [`src/services/api/http.ts`](../src/services/api/http.ts). Ao integrar, chame essa
  função após o login para injetar o JWT em todas as requisições.

---

## 6. Tipos de domínio

Os contratos usam os tipos de [`src/types/index.ts`](../src/types/index.ts), derivados
do [`docs/referencias/plantuml.txt`](referencias/plantuml.txt) (Usuario, Evento, Ingresso, Lote, Compra, Pagamento, Cupom,
IngressoEmitido, CheckIn, Inscricao, Universidade, Campus, Categoria, Tag…).
Alinhe os DTOs do back-end a esses tipos — ou adapte no `apiServices` — e a interface
continua funcionando sem mudanças.

---

## 7. Tratamento de erros e estados

- Erros de API devem seguir o formato `{ status, message }`. O cliente HTTP converte
  respostas não-OK em `ApiError(status, message)`.
- O hook [`useAsync`](../src/hooks/useAsync.ts) e o componente `AsyncBoundary` já tratam
  os estados **loading / success / empty / error**, e o `ErrorState` distingue
  **401 / 403 / 404 / offline** automaticamente a partir do status.

Ou seja: quando a API real retornar esses códigos, as telas já reagem corretamente.
