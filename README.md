# Portal de Notícias sobre Esclerose Múltipla

Este projeto é um portal informativo para Apemigos, ONG dedicada à conscientização e divulgação de informações sobre Esclerose Múltipla. O site publica artigos jornalísticos, notícias, depoimentos e conteúdos relevantes para pacientes, familiares e profissionais de saúde.

## Objetivo

- Divulgar informações confiáveis sobre Esclerose Múltipla.
- Compartilhar notícias, avanços científicos e depoimentos.
- Apoiar pacientes e familiares com conteúdo educativo.

## Tecnologias utilizadas

- Next.js (React)
- Tailwind CSS
- Flowbite
- TypeScript

---

## Rápido: como rodar (resumo)

Recomendado (Yarn):

```bash
# instalar dependências
yarn install

# rodar em modo desenvolvimento
yarn dev

# gerar build de produção
yarn build

# iniciar em modo produção (após build)
yarn start

# lint (corrige formatação onde possível)
yarn lint
```

Equivalente usando npm (se preferir):

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
```

A página ficará disponível em http://localhost:3000 por padrão.

---

## Pré-requisitos

- Node.js LTS (recomendado 18.x ou superior). Verifique com `node -v`.
- npm (vem com Node) ou yarn/pnpm se preferir.

Se não tem o Node instalado (Linux):

```bash
# usando nvm (recomendado)
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.6/install.sh | bash
# feche/abra o terminal ou rode: source ~/.nvm/nvm.sh
nvm install --lts
nvm use --lts
```

- Yarn 3.x é o gerenciador recomendado (o `package.json` usa `packageManager: "yarn@3.3.0"`). Se usar Yarn PnP/berry, execute `yarn install` normalmente.
- Backend REST da aplicação disponível (API). Por padrão o frontend usa a variável `NEXT_PUBLIC_API_URL` (ex: `http://localhost:8080`).

---

## Variáveis de ambiente

Você pode definir as variáveis no ambiente ou em um arquivo `.env.local` na raiz do projeto (Next.js carrega automaticamente `.env.local`). As mais importantes:

- `NEXT_PUBLIC_API_URL` — URL base da API. Padrão usado pelo projeto se não definido: `http://localhost:8080`.

Exemplo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Observação: o projeto utiliza um token de serviço obtido via `auth-service` para chamadas ao backend; se sua API exigir autenticação, garanta que o backend aceite o fluxo de login de serviço ou forneça o token apropriado localmente para testes.

---

## Rodando localmente (passo a passo)

1. Clone o repositório e entre na pasta do projeto

```bash
git clone <repo-url>
cd apemigos
```

2. Instale dependências

```bash
yarn install
# ou: npm install
```

3. Defina variáveis de ambiente (opcional)

Crie `.env.local` com `NEXT_PUBLIC_API_URL` se necessário.

4. Inicie o backend (API)

Certifique-se de que sua API esteja rodando na URL configurada (`NEXT_PUBLIC_API_URL`).

5. Inicie o frontend em modo desenvolvimento

```bash
yarn dev
# ou: npm run dev
```

Abra http://localhost:3000

---

## Build e produção

Gerar a build:

```bash
yarn build
# ou npm run build
```

Iniciar a build em produção:

```bash
yarn start
# ou npm run start
```

---

## Testes e E2E

O projeto inclui dependências para Playwright (`@playwright/test`). Para rodar os testes e garantir que os browsers necessários estão instalados:

```bash
# instalar browsers do Playwright (se necessário)
# npx playwright install

yarn e2e
# ou: npm run e2e
```

> Nota: ajustar e configurar variáveis de ambiente e endpoints caso os testes dependam da API.

---

## Lint e formatação

O projeto usa ESLint + Prettier. Para checar e corrigir problemas:

```bash
yarn lint
# ou npm run lint
```

---

## Depuração rápida (troubleshooting)

- Se ao abrir uma página aparecer `⚠️ Erro ao carregar a notícia. Tente novamente.`:
  - Abra DevTools → Network e verifique a requisição para `/api/noticias/conteudo/...`.
  - Confirme `NEXT_PUBLIC_API_URL` e se o backend está rodando na porta correta.
  - Verifique status HTTP (401 = autorização, 404 = slug/ID não encontrado). Teste o endpoint diretamente com `curl`:

```bash
curl -i -H "Accept: application/json" "${NEXT_PUBLIC_API_URL:-http://localhost:8080}/api/noticias/conteudo/slug/outubro-laranja"
```

- Warnings do Next (ex.: `no-img-element`) são avisos de otimização — não impedem a aplicação de rodar.

- Se houver problemas com o Yarn PnP (berry), tente instalar dependências com `YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn install` ou use npm.

---

## Mapa do site (rotas importantes)

Páginas públicas (frontend):

- / — Página inicial
- /about — Sobre a associação
- /doe — Página dedicada de doações
- /association — Página "Associe-se" (formulário de adesão)
- /contact — Contato
- /news — Lista de notícias
- /news/[slug] — Página de notícia (acessa por slug)
- /projects — Lista de projetos
- /projects/[slug] — Página de projeto
- /projects/rifa — Página específica (rifa)
- /team — Equipe

APIs (backend / proxied endpoints):

- GET /api/noticias?page={page}&size={size} — Busca paginada de notícias
- GET /api/noticias/conteudo/slug/{slug} — Buscar conteúdo da notícia por slug
- GET /api/projetos?page={page}&size={size} — Busca paginada de projetos (padrão 9 por página no frontend)
- POST /api/associados — Cadastro de associados (multipart/form-data)
- POST /api/email — Envio de e‑mail (aceita HTML no corpo)
- POST /api/pix/static — Gera payload + QR Pix (retorno: payload, qrCodeBase64, txid)
- POST /api/service-login — Geração de token de serviço (protegido)
- /api/proxy/... — Proxy local para encaminhar requisições ao backend e injetar X-Service-Token (side-by-side)

> Observação: algumas rotas são chamadas via proxy do frontend para manter o X-Service-Token no servidor (não exposto ao cliente). Consulte o código em `app/api/proxy/[...path]/route.ts`.

## Resumo das mudanças recentes (o que foi implementado)

- Serviços (frontend): adicionado/ajustado o service para `projects` seguindo o padrão do projeto.
- Paginação: projetos e notícias passaram a suportar paginação; o padrão de páginas no frontend para projetos é 9 itens por página.
- Notícias: a busca por conteúdo agora suporta buscar por `id` (para o backend) e por `slug` usando o endpoint `/api/noticias/conteudo/slug/{slug}` — o frontend foi ajustado para usar o endpoint adequado.
- Associação (formulário): novo formulário "Associe-se" com upload de arquivos (aceita JPG, PNG, PDF), validação de CPF/email/telefone, campos de endereço (todos obrigatórios exceto complemento) e envio multipart/form-data para `/api/associados`. A lista de arquivos é enviada ao backend e o backend é responsável por enviar o e‑mail de confirmação.
- Uploads/arquivos: prevenção de duplicatas por nome+size (foi adicionada verificação; evolução futura para hash no cliente/servidor é suportada no fluxo).
- Email: criado template de e‑mail HTML simples e robusto (inclui enviado por "Avocado Desenvolvimento de Software"). O frontend envia apenas os dados ao backend; o backend dispara o envio.
- Doações (pix): adicionada integração com `/api/pix/static` — o frontend pede ao backend o payload/qrCodeBase64 e exibe o QR recebido; o valor do `amount` aceita floats (ex.: 123.25). O frontend não gera mais a lógica do payload/CRC — isso ocorre no backend.
- Autenticação de serviço: variáveis de ambiente usadas pelo frontend/backend: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SERVICE_KEY`, `JWT_SECRET`. As chamadas protegidas usam Bearer token; chamadas entre frontend e backend que precisam do X-Service-Token são feitas via proxy (side-by-side) para que o token do serviço não apareça no navegador.
- Proxy: introduzido `app/api/proxy/[...path]/route.ts` para encaminhar chamadas ao backend e injetar `X-Service-Token`. O proxy também repassa o header `Origin` corretamente para evitar problemas de CORS (configurável por `.env`).
- Variáveis de ambiente e .env: adicionado suporte para `.env`/`.env.local` (não comitar o arquivo). Variáveis principais: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SERVICE_KEY`, `JWT_SECRET`, `ALLOWED_ORIGINS` (lista separada por vírgula) — veja seção abaixo.
- UI/UX: componentes novos/ajustados: Notification component, feedback no envio de formulários, melhorias visuais no DonateBanner e SocialEmbeds para manter alinhamento e largura consistentes.

## Variáveis de ambiente recomendadas (exemplo `.env` ou `.env.local`)

```env
# URL da API (backend)
NEXT_PUBLIC_API_URL=http://localhost:8080

# Chave de serviço que o backend espera (útil para proxy e login de serviço)
NEXT_PUBLIC_SERVICE_KEY=apemigos-service-key-2025-secure-version

# Secret usado pelo backend (não necessário no frontend)
JWT_SECRET=your_jwt_secret_here

# Origens permitidas para o proxy (separadas por vírgula)
ALLOWED_ORIGINS=http://localhost:3000,https://apemigos.vercel.app

# Chave do serviço usada em ambiente local apenas para testes (não versionar)
DEV_SERVICE_TOKEN=7f8e7a2d3c4b5a6f9e8d7c6b5a4f3e2d
```

Não adicione o `.env` ao repositório (adicione ao `.gitignore` se necessário).

## Dicas rápidas de debug

- Se a API retornar 403/401 para chamadas que funcionam via curl: verifique os headers `Origin`, `Authorization` (Bearer) e se o proxy está enviando `X-Service-Token`.
- Para problemas com upload multipart/form-data: verifique se o formulário no frontend está enviando `FormData` (sem transformar arquivos em string) e se o backend aceita `multipart/form-data` no `@PostMapping`.
- Se encontrar erros de build relacionados a ESLint/Prettier: rode `npm run lint` e ajuste as regras locais; o build em produção costuma ser mais rígido.

---

Se quiser, eu faço um PR com esse README atualizado e crio um `.env.example` com as variáveis acima para facilitar o setup local.

---

## Contribuição

Contribuições são bem‑vindas. Para contribuir:

1. Abra uma issue descrevendo o problema ou feature.
2. Crie um branch a partir de `main`.
3. Faça commit com mensagens claras e envie um Pull Request.

---

## Contato

Para dúvidas sobre o projeto entre em contato com a equipe técnica da ONG.

---

_Feito com ❤️ para a Apemigos — Informação que transforma vidas._
