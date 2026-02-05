# Project: FinForge - Rules & Specs

## 1. Visão Geral do Produto
**Nome:** FinForge  
**Propósito:** Uma suíte de ferramentas financeiras de alta precisão focada em planejamento de independência financeira (FIRE) e simulações de investimento.  
**Objetivo Técnico:** Servir como base para a aplicação de **Arquitetura Limpa**, performance extrema com **React 19 Server Components** e precisão matemática absoluta em cálculos de juros compostos.

---

## 2. Stack Tecnológico (Updated 2026)

### Core
- **Framework:** Next.js 16.1 (App Router)
- **Engine:** React 19 (Uso de Server Actions, `use` hook e melhorias de Hydration)
- **Linguagem:** TypeScript 5.x (Strict mode ativado)
- **Estilização:** **Tailwind CSS v4** (Motor de alto desempenho baseado em CSS Variables)

### Bibliotecas de Suporte
- **UI Kit:** shadcn/ui (Radix UI) + Framer Motion 12 (Animações fluidas).
- **Data Fetching:** TanStack Query v5 (Gerenciamento de cache e estado assíncrono).
- **Matemática Financeira:** `decimal.js`.
  - *Regra de Ouro:* Proibido o uso do tipo `number` primitivo para cálculos de moeda, taxas ou saldos. Utilize sempre `new Decimal()`.
- **Formulários & Validação:** React Hook Form + **Zod**.
- **Visualização:** Recharts (Gráficos de projeção e composição de ativos).
- **Feedback & UX:** Sonner (Toasts), Vaul (Gavetas/Drawers) e Lucide React (Ícones).

---

## 3. Arquitetura e System Design

O projeto segue os princípios de **Clean Architecture**, garantindo que a lógica de negócio (cálculos financeiros) seja independente da interface ou do framework.

### Estrutura de Pastas
```text
src/
├── core/                 # DOMÍNIO (Lógica Pura - Framework Agnostic)
│   ├── domain/           # Entidades, Interfaces e Schemas de validação (Zod)
│   ├── use-cases/        # Regras de negócio isoladas (Ex: CalculateCompoundInterest.ts)
│   └── utils/            # Helpers matemáticos e formatadores financeiros
├── app/                  # CAMADA DE APRESENTAÇÃO (Next.js)
│   ├── (auth)/           # Grupos de rotas (Ex: Login, Register)
│   ├── actions/          # Server Actions (Validadas com Zod no servidor)
│   └── api/              # Route Handlers para integrações externas
├── components/           # COMPONENTES DE INTERFACE
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── charts/           # Abstrações de visualização de dados
│   └── dashboard/        # Componentes específicos de negócio
├── hooks/                # Hooks customizados e integração com TanStack Query
└── lib/                  # Configurações de terceiros (Prisma, Fetcher, etc.)