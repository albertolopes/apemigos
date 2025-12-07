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

- Node.js 18+ (recomendado). Verifique a versão instalada:

```bash
node -v
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

## Boas práticas e notas

- Prefira usar `slug` nas URLs públicas (`/news/outubro-laranja`) para SEO; o frontend já suporta busca por slug no endpoint `/api/noticias/conteudo/slug/{slug}`.
- Mantenha slugs únicos no backend e implemente redirects 301 se um slug mudar.

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
