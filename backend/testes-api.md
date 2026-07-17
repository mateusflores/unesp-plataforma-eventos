# Testes da API — Ágora

## Pré-requisitos

- PostgreSQL rodando com as variáveis de ambiente configuradas
- `./mvnw spring-boot:run` rodando em `http://localhost:8080`
- Ferramenta: `curl` (ou Insomnia/Postman)

---

## 1. População inicial via SQL

Execute estes inserts diretamente no banco (antes de rodar os testes pela API):

```sql
-- Universidades
INSERT INTO universidades (nome, sigla, logo_cor) VALUES
('Universidade Estadual Paulista', 'UNESP', '#8B0000'),
('Universidade de São Paulo', 'USP', '#006400'),
('Universidade Federal de São Carlos', 'UFSCar', '#FF8C00');

-- Endereços dos campi
INSERT INTO endereco (logradouro, numero, bairro, cidade, uf, cep) VALUES
('Rua Cristóvão Colombo', '2265', 'Jardim Nazareth', 'São José do Rio Preto', 'SP', '15054-000'),
('Av. Eng. Luiz Edmundo C. Coube', '14-01', 'Vargem Limpa', 'Bauru', 'SP', '17033-360'),
('Av. dos Bandeirantes', '3900', 'Vila Monte Alegre', 'Ribeirão Preto', 'SP', '14040-901');

-- Campi
INSERT INTO campus (nome, universidade_id, endereco_id) VALUES
('Campus de São José do Rio Preto', 1, 1),
('Campus de Bauru', 1, 2),
('Campus de Ribeirão Preto', 2, 3);

-- Categorias
INSERT INTO categorias (nome, slug, cor, icone) VALUES
('Festa', 'festa', '--cat-festa', 'music'),
('Palestra', 'palestra', '--cat-palestra', 'book-open'),
('Workshop', 'workshop', '--cat-workshop', 'wrench'),
('Esportes', 'esportes', '--cat-esportes', 'trophy'),
('Arte e Cultura', 'arte-cultura', '--cat-arte', 'palette'),
('Feira', 'feira', '--cat-feira', 'shopping-bag');

-- Tags
INSERT INTO tags (nome) VALUES
('presencial'), ('online'), ('gratuito'), ('pago'), ('aberto ao público'), ('restrito a alunos');

-- Usuários (senha: 123456) — precisa criar via /auth/registrar para gerar hash BCrypt
```

> **Atenção:** Os usuários **não** podem ser inseridos diretamente com SQL porque a senha precisa do hash BCrypt. Crie-os via API conforme passo 3 abaixo.

---

## 2. Variáveis de ambiente do shell

```bash
API=http://localhost:8080
```

---

## 3. Criar usuários via API

```bash
# Ana — PARTICIPANTE
curl -s -X POST "$API/auth/registrar" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Ana Beatriz Souza","email":"ana@agora.dev","senha":"123456","telefone":"(17) 99999-0001"}'
```

```bash
# Bruno — ORGANIZADOR
curl -s -X POST "$API/auth/registrar" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Bruno Carvalho Lima","email":"bruno@agora.dev","senha":"123456","telefone":"(17) 99999-0002"}'
```

```bash
# Maria — ORGANIZADORA
curl -s -X POST "$API/auth/registrar" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Maria Oliveira","email":"maria@agora.dev","senha":"123456","telefone":"(17) 99999-0004"}'
```

```bash
# Carla — ADMIN
curl -s -X POST "$API/auth/registrar" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Carla Menezes","email":"admin@agora.dev","senha":"123456","telefone":"(17) 99999-0003"}'
```

Após criar, guarde o `id` de cada um (vem no `usuario.id` da resposta). Vamos supor:

| Usuário | id | Role |
|---|---|---|
| Ana | 1 | PARTICIPANTE |
| Bruno | 2 | ORGANIZADOR |
| Maria | 3 | ORGANIZADOR |
| Carla | 4 | ADMIN |

---

## 4. Login e token

```bash
# Login como Bruno (ORGANIZADOR)
TOKEN=$(curl -s -X POST "$API/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"bruno@agora.dev","senha":"123456"}' | jq -r '.token')

echo $TOKEN
```

> Se não tiver `jq` instalado, copie manualmente o token da resposta.

---

## 5. Endpoints públicos (sem token)

### GET /auth/recuperar-senha

```bash
curl -s -X POST "$API/auth/recuperar-senha" \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@agora.dev"}'
# Esperado: 204 No Content
```

### GET /universidades

```bash
curl -s "$API/universidades" | jq .
```

### GET /campi

```bash
curl -s "$API/campi" | jq .
curl -s "$API/campi?universidadeId=1" | jq .
```

### GET /categorias

```bash
curl -s "$API/categorias" | jq .
```

### GET /tags

```bash
curl -s "$API/tags" | jq .
```

### GET /organizadores

```bash
curl -s "$API/organizadores" | jq .
```

```bash
curl -s "$API/organizadores/destaques" | jq .
```

```bash
curl -s "$API/organizadores/1" | jq .
```

---

## 6. Criar organizadores (vincular ao usuário)

> Bruno (id=2) e Maria (id=3) precisam ser cadastrados como organizadores. Isso precisa ser feito via SQL por enquanto, já que o endpoint de criação de organizadores ainda não foi exposto via API.

```sql
INSERT INTO organizadores (tipo, nome, descricao, avatar_cor, usuario_id, verificado, eventos_realizados)
VALUES
('USUARIO', 'Bruno Carvalho Lima', 'Organizador de eventos de tecnologia', '#2196F3', 2, true, 5),
('USUARIO', 'Maria Oliveira', 'Organizadora de eventos culturais', '#9C27B0', 3, true, 3);
```

Agora os organizadores têm id=1 (Bruno) e id=2 (Maria).

---

## 7. Eventos — criar via API (protegido)

### POST /eventos — Evento gratuito (palestra)

Use o token do Bruno (ORGANIZADOR):

```bash
curl -s -X POST "$API/eventos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "titulo": "Inteligência Artificial na Educação",
    "resumo": "Palestra sobre IA aplicada ao ensino universitário.",
    "descricao": "Uma palestra imperdível sobre como a inteligência artificial está transformando a educação superior. Abordaremos ferramentas práticas, ética e o futuro das salas de aula.",
    "imagemCapa": "https://picsum.photos/seed/ia/800/400",
    "gratuito": true,
    "publico": true,
    "dataInicio": "2026-08-15T14:00:00-03:00",
    "dataFim": "2026-08-15T17:00:00-03:00",
    "local": "Auditório Central — IBILCE",
    "capacidade": 200,
    "organizadorId": 1,
    "universidadeId": 1,
    "campusId": 1,
    "categoriaIds": [2],
    "tagIds": [1, 3, 5],
    "endereco": {
      "logradouro": "Rua Cristóvão Colombo",
      "numero": "2265",
      "bairro": "Jardim Nazareth",
      "cidade": "São José do Rio Preto",
      "estado": "SP",
      "cep": "15054-000"
    },
    "status": "PUBLICADO"
  }' | jq .
```

### POST /eventos — Evento pago (festa com ingressos e lotes)

```bash
curl -s -X POST "$API/eventos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "titulo": "Festa do Calouro 2026",
    "resumo": "A maior festa de recepção dos calouros da UNESP.",
    "descricao": "Venha celebrar o início do ano letivo com shows, comida e diversão. Bandas ao vivo, DJs, food trucks e muito mais!",
    "imagemCapa": "https://picsum.photos/seed/festa/800/400",
    "gratuito": false,
    "publico": true,
    "dataInicio": "2026-09-10T20:00:00-03:00",
    "dataFim": "2026-09-11T05:00:00-03:00",
    "local": "Quadra Poliesportiva — UNESP Bauru",
    "capacidade": 1000,
    "organizadorId": 1,
    "universidadeId": 1,
    "campusId": 2,
    "categoriaIds": [1],
    "tagIds": [1, 4, 5],
    "endereco": {
      "logradouro": "Av. Eng. Luiz Edmundo C. Coube",
      "numero": "14-01",
      "bairro": "Vargem Limpa",
      "cidade": "Bauru",
      "estado": "SP",
      "cep": "17033-360"
    },
    "ingressos": [
      {
        "nome": "Pista",
        "descricao": "Acesso à pista principal",
        "lotes": [
          {
            "nome": "1º Lote",
            "preco": 30.00,
            "quantidadeTotal": 400,
            "quantidadeDisponivel": 400,
            "dataInicio": "2026-07-01T00:00:00-03:00",
            "dataFim": "2026-08-15T23:59:00-03:00"
          },
          {
            "nome": "2º Lote",
            "preco": 50.00,
            "quantidadeTotal": 300,
            "quantidadeDisponivel": 300,
            "dataInicio": "2026-08-16T00:00:00-03:00",
            "dataFim": "2026-09-09T23:59:00-03:00"
          }
        ]
      },
      {
        "nome": "VIP",
        "descricao": "Acesso VIP com open bar",
        "lotes": [
          {
            "nome": "Único",
            "preco": 120.00,
            "quantidadeTotal": 100,
            "quantidadeDisponivel": 100,
            "dataInicio": "2026-07-01T00:00:00-03:00",
            "dataFim": "2026-09-09T23:59:00-03:00"
          }
        ]
      }
    ],
    "status": "PUBLICADO"
  }' | jq .
```

### POST /eventos — Evento como Maria (outro organizador)

Primeiro faça login como Maria:

```bash
TOKEN_MARIA=$(curl -s -X POST "$API/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@agora.dev","senha":"123456"}' | jq -r '.token')
```

```bash
curl -s -X POST "$API/eventos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_MARIA" \
  -d '{
    "titulo": "Semana Cultural 2026",
    "resumo": "Cinco dias de arte, música e teatro na USP Ribeirão.",
    "descricao": "A Semana Cultural reúne artistas locais, peças de teatro, exposições de arte e apresentações musicais. Evento aberto a toda comunidade.",
    "imagemCapa": "https://picsum.photos/seed/cultural/800/400",
    "gratuito": true,
    "publico": true,
    "dataInicio": "2026-10-05T09:00:00-03:00",
    "dataFim": "2026-10-10T21:00:00-03:00",
    "local": "Centro Cultural — USP Ribeirão Preto",
    "capacidade": 500,
    "organizadorId": 2,
    "universidadeId": 2,
    "campusId": 3,
    "categoriaIds": [5],
    "tagIds": [1, 3, 5],
    "endereco": {
      "logradouro": "Av. dos Bandeirantes",
      "numero": "3900",
      "bairro": "Vila Monte Alegre",
      "cidade": "Ribeirão Preto",
      "estado": "SP",
      "cep": "14040-901"
    },
    "status": "PUBLICADO"
  }' | jq .
```

---

## 8. Eventos — consultas públicas

```bash
# Listar todos os eventos (paginado)
curl -s "$API/eventos" | jq .

# Listar com filtros
curl -s "$API/eventos?universidadeId=1&gratuito=true&pagina=1&porPagina=9" | jq .

# Busca por texto
curl -s "$API/eventos?busca=calouro" | jq .

# Eventos em destaque
curl -s "$API/eventos/destaques" | jq .

# Por slug
curl -s "$API/eventos/slug/festa-do-calouro-2026" | jq .

# Por id
curl -s "$API/eventos/1" | jq .

# Eventos de um organizador
curl -s "$API/organizadores/1/eventos" | jq .
```

---

## 9. Eventos — ações protegidas (ORGANIZADOR)

```bash
# Publicar (se estiver como rascunho)
curl -s -X PATCH "$API/eventos/1/publicar" \
  -H "Authorization: Bearer $TOKEN"
# Esperado: 204 No Content

# Atualizar
curl -s -X PUT "$API/eventos/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "titulo": "Inteligência Artificial na Educação (nova data)",
    "resumo": "Palestra sobre IA aplicada ao ensino universitário.",
    "descricao": "Uma palestra imperdível sobre como a inteligência artificial está transformando a educação superior.",
    "gratuito": true,
    "publico": true,
    "dataInicio": "2026-09-01T14:00:00-03:00",
    "dataFim": "2026-09-01T17:00:00-03:00",
    "local": "Auditório Central — IBILCE",
    "capacidade": 200,
    "organizadorId": 1,
    "universidadeId": 1,
    "campusId": 1,
    "categoriaIds": [2],
    "tagIds": [1, 3, 5],
    "status": "PUBLICADO"
  }' | jq .

# Duplicar
curl -s -X POST "$API/eventos/1/duplicar" \
  -H "Authorization: Bearer $TOKEN" | jq .

# Cancelar
curl -s -X PATCH "$API/eventos/2/cancelar" \
  -H "Authorization: Bearer $TOKEN"
# Esperado: 204 No Content
```

---

## 10. Usuário logado

```bash
curl -s "$API/usuarios/1" | jq .
curl -s "$API/usuarios/2" | jq .
```

---

## 11. Limpeza (resetar dados de teste)

Desligue o servidor e drope/recrie o schema, ou use:

```sql
TRUNCATE TABLE eventos, ingressos, lotes, inscricoes, vendas, item_venda,
  ingressos_emitidos, check_ins, cupons_desconto, pagamentos,
  evento_categoria, evento_tag,
  organizadores, usuarios, campus, universidades, categorias, tags, endereco
RESTART IDENTITY CASCADE;
```

---

## Resumo dos endpoints testados

| Método | Endpoint | Autenticação | Status |
|---|---|---|---|
| POST | `/auth/registrar` | Público | ✅ |
| POST | `/auth/login` | Público | ✅ |
| POST | `/auth/demo` | Público | ✅ |
| POST | `/auth/recuperar-senha` | Público | ✅ |
| GET | `/usuarios/{id}` | Autenticado | ✅ |
| GET | `/universidades` | Público | ✅ |
| GET | `/campi` | Público | ✅ |
| GET | `/categorias` | Público | ✅ |
| GET | `/tags` | Público | ✅ |
| GET | `/organizadores` | Público | ✅ |
| GET | `/organizadores/destaques` | Público | ✅ |
| GET | `/organizadores/{id}` | Público | ✅ |
| GET | `/eventos` | Público | ✅ |
| GET | `/eventos/destaques` | Público | ✅ |
| GET | `/eventos/slug/{slug}` | Público | ✅ |
| GET | `/eventos/{id}` | Público | ✅ |
| GET | `/organizadores/{id}/eventos` | Público | ✅ |
| POST | `/eventos` | ORGANIZADOR | ✅ |
| PUT | `/eventos/{id}` | ORGANIZADOR | ✅ |
| PATCH | `/eventos/{id}/publicar` | ORGANIZADOR | ✅ |
| PATCH | `/eventos/{id}/cancelar` | ORGANIZADOR | ✅ |
| POST | `/eventos/{id}/duplicar` | ORGANIZADOR | ✅ |
