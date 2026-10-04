# FinForge 🔥

> Carteira de investimentos pessoal com precisão decimal e projetor de patrimônio.

## 🎯 Sobre o Projeto

FinForge é uma aplicação financeira construída com foco em **precisão matemática absoluta** e **Clean Architecture**. Utilizamos `decimal.js` para garantir zero erros de ponto flutuante em todos os cálculos monetários.

### ✨ Funcionalidades

#### 💼 Carteira de Investimentos
- 📊 **Cadastro de ativos** com tipos: Ações, ETFs, FIIs, Cripto, Renda Fixa e Caixa
- 💸 **Transações** de compra, venda, dividendos, JCP e rendimentos
- 📈 **Posições** com preço médio, P&L realizado e não realizado
- 🎯 **Alocação** com gráfico de pizza + alertas de concentração
- 📉 **Projeção** de patrimônio futuro com aportes e IPCA
- 🧪 **Simulador "E se...?"** comparando cenários com aporte extra e retiradas
- 💵 **Proventos** com yield on cost por ativo
- 🌍 **Multi-moeda** (BRL + USD) com cotação automática
- 💾 **Backup / Restore** via JSON
- 🔐 **Auth** com Supabase (email/senha)

#### 🧮 Calculadoras (mantidas)
- Juros Compostos, Juros Simples, FIRE, Conversor de Taxas, Ajuste de Inflação, Comparador de Investimentos

### 🛠 Stack Tecnológica

- **Framework**: Next.js 16.1 (App Router, Server Actions)
- **Engine**: React 19
- **Linguagem**: TypeScript 5.x (Strict mode)
- **Estilização**: Tailwind CSS v4
- **UI**: shadcn/ui (Radix UI) + Framer Motion 12
- **Backend / DB**: Supabase (Postgres + Auth + RLS)
- **Gráficos**: Recharts
- **Matemática**: decimal.js
- **Validação**: Zod
- **Formulários**: React Hook Form

### 🔌 Cotações
- Cripto: **CoinGecko** (sem auth)
- Ações/FIIs/ETFs BR: **Brapi.dev** (free tier)
- Ações/ETFs US: **Yahoo Finance** (sem auth)
- USD/BRL: **AwesomeAPI**
- Cache compartilhado em `price_cache` (TTL 15min, refresh manual)

## 🚀 Como Executar

```bash
npm install
cp .env.example .env.local  # preencha com credenciais do Supabase
npm run dev
```

### Setup do Supabase
1. Crie projeto em https://supabase.com
2. SQL Editor → rode `supabase/migrations/20251003000000_init.sql`
3. Authentication → Providers → Email → confirme se quer/desativar confirmação
4. Settings → API → copie `URL` e `anon public key` para `.env.local`

## 📁 Estrutura

```
src/
├── core/
│   ├── domain/                # Tipos e constantes
│   │   ├── portfolio.types.ts
│   │   ├── asset-classes.ts
│   │   └── portfolio-constants.ts
│   ├── services/                # Lógica de cálculo (pura)
│   │   ├── portfolio.service.ts
│   │   ├── fixedIncome.service.ts
│   │   ├── projection.service.ts
│   │   ├── allocation.service.ts
│   │   ├── dividends.service.ts
│   │   ├── priceFetcher.service.ts
│   │   ├── currency.service.ts
│   │   └── portfolio-aggregator.service.ts
│   ├── data/                   # Acesso ao banco (server-only)
│   └── utils/
├── components/
│   ├── auth/                    # AuthForm, UserMenu
│   ├── portfolio/               # AssetForm, TransactionForm, AllocationView, etc.
│   └── Dashboard/               # PortfolioTeaser
├── hooks/                       # useAuth
└── lib/supabase/                # client, server, middleware, types

supabase/
└── migrations/                  # SQL versionado

app/
├── (auth)/                      # /login, /signup
├── portfolio/                   # carteira + sub-rotas
├── assets/                      # CRUD de ativos
└── transactions/                # CRUD de transações
```

## 🧪 Testes

116 testes com Vitest cobrindo serviços de cálculo, hooks e componentes.

```bash
npm test
npm run test:coverage
```

## 📐 Regras de Negócio

- **Preço médio** = Σ(qty × preço) / Σ(qty) − vendas parciais reduzem qty e custo
- **P&L realizado** = Σ(venda − preço_médio_na_data)
- **P&L não realizado** = (preço_atual − preço_médio) × quantidade
- **Yield on cost** = Σ(dividendos) / custo_total × 100
- **Renda Fixa**: CDI% / IPCA+ / Prefixado com capitalização anual
- **Multi-moeda**: agregação sempre em BRL usando `USDBRL` cacheado

## 📄 Licença

MIT