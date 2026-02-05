# FinForge 🔥

> Suíte de ferramentas financeiras de alta precisão para planejamento de independência financeira (FIRE) e simulações de investimento.

## 🎯 Sobre o Projeto

FinForge é uma aplicação financeira construída com foco em **precisão matemática absoluta** e **Clean Architecture**. Utilizamos `decimal.js` para garantir zero erros de ponto flutuante em todos os cálculos monetários.

### ✨ Funcionalidades

- 📊 **Calculadora de Juros Compostos**: Simule o crescimento do seu patrimônio com aportes recorrentes
- 🔥 **Planejador FIRE**: Calcule quanto você precisa para se aposentar e viver de renda passiva
- 📈 **Gráficos Interativos**: Visualize a evolução do seu patrimônio ao longo do tempo
- 💯 **Precisão Absoluta**: Uso de `decimal.js` para cálculos sem erros de arredondamento

## 🛠 Stack Tecnológica

- **Framework**: Next.js 16.1 (App Router)
- **Engine**: React 19 (Server Components)
- **Linguagem**: TypeScript 5.x (Strict mode)
- **Estilização**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **Animações**: Framer Motion 12
- **Gráficos**: Recharts
- **Matemática**: decimal.js
- **Validação**: Zod
- **Formulários**: React Hook Form

## 📁 Arquitetura

O projeto segue os princípios de **Clean Architecture**, separando claramente:

```
src/
├── core/                    # 🎯 DOMÍNIO (Lógica Pura)
│   ├── domain/              # Entidades e tipos
│   ├── use-cases/           # Regras de negócio isoladas
│   └── utils/               # Helpers matemáticos
├── components/              # 🎨 UI Components
│   ├── ui/                  # Componentes base (shadcn)
│   ├── charts/              # Componentes de visualização
│   └── dashboard/           # Componentes de negócio
├── hooks/                   # Custom hooks
└── lib/                     # Configurações e utilitários

app/                         # 📄 Camada de Apresentação (Next.js)
├── compound-interest/       # Calculadora de Juros Compostos
├── fire-planner/            # Planejador FIRE
└── page.tsx                 # Home page
```

### 🎯 Princípios da Arquitetura

1. **Independência de Framework**: A lógica de negócio (core) é totalmente isolada do React/Next.js
2. **Testabilidade**: Use-cases puros podem ser testados sem UI
3. **Precisão**: Uso obrigatório de `Decimal` para todos os cálculos financeiros
4. **Type Safety**: TypeScript strict mode + validação com Zod

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📚 Estrutura de Cálculos

### Juros Compostos

Fórmula implementada:
```
A = P(1 + r)^n + PMT × [(1 + r)^n - 1] / r
```

Onde:
- A = Montante final
- P = Capital inicial
- r = Taxa de juros por período
- n = Número de períodos
- PMT = Aporte mensal

### FIRE Number

Baseado na Trinity Study e regra dos 4%:
```
FIRE Number = Despesas Anuais / Taxa de Retirada Segura
```

Considera:
- Inflação (IPCA médio histórico)
- Taxa real de retorno (descontada inflação)
- Aportes mensais recorrentes
- Simulação ano a ano até a meta

## 🔒 Garantia de Precisão

```typescript
// ❌ NUNCA faça isso (ponto flutuante impreciso)
const result = 0.1 + 0.2; // 0.30000000000000004

// ✅ SEMPRE use Decimal
import Decimal from 'decimal.js';
const result = new Decimal(0.1).plus(0.2); // 0.3
```

Todos os cálculos monetários usam `decimal.js` para garantir precisão de até 20 casas decimais.

## 🎨 Componentização

Os componentes seguem a estrutura do shadcn/ui com customizações:

- **Card**: Container base para seções
- **Input**: Campos de formulário com validação
- **Button**: Botões com variantes de estilo
- **Label**: Labels acessíveis para formulários
- **Charts**: Gráficos construídos com Recharts

## 🧪 Próximos Passos

- [ ] Adicionar testes unitários (Vitest)
- [ ] Implementar conversor de taxas
- [ ] Adicionar calculadora de poder de compra
- [ ] Implementar comparador de investimentos
- [ ] Adicionar suporte a múltiplas moedas

## 📄 Licença

MIT

---
