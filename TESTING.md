# Testes - FinForge

## 📋 Estrutura de Testes

Este projeto utiliza **Vitest** e **React Testing Library** para garantir a qualidade e confiabilidade do código.

## 🚀 Executando os Testes

```bash
# Executar todos os testes
npm test

# Executar com UI interativa
npm run test:ui

# Executar com cobertura de código
npm run test:coverage

# Modo watch (reexecuta ao modificar arquivos)
npm test -- --watch
```

## 📁 Organização

```
src/
├── core/
│   └── services/
│       └── __tests__/          # Testes dos serviços
│           ├── SimpleInterest.test.ts
│           ├── rateConverter.test.ts
│           └── compoundInterest.test.ts
├── hooks/
│   └── __tests__/              # Testes dos hooks customizados
│       ├── useSimpleInterestCalculator.test.ts
│       ├── useCompoundInterestCalculator.test.ts
│       └── useRateConverter.test.ts
└── components/
    └── calculator/
        └── __tests__/          # Testes dos componentes
            ├── SliderInputField.test.tsx
            ├── ResultCard.test.tsx
            └── BreakdownRow.test.tsx
```

## 🧪 Tipos de Testes

### 1. Testes de Serviços (Lógica de Negócio)
Testam os cálculos financeiros puros, sem dependências do React:
- `SimpleInterest.test.ts` - Cálculos de juros simples
- `rateConverter.test.ts` - Conversão de taxas
- `compoundInterest.test.ts` - Juros compostos

**Exemplo:**
```typescript
it('should calculate simple interest correctly', () => {
  const result = calculateSimpleInterest({
    principal: new Decimal(10000),
    rate: new Decimal(10),
    time: 2,
    timeUnit: 'years',
  })
  
  expect(result.interest.toNumber()).toBe(2000)
})
```

### 2. Testes de Hooks
Testam a lógica de estado e efeitos usando `renderHook`:
- Inicialização com valores padrão
- Atualização de estado e recálculo
- Valores computados (useMemo)

**Exemplo:**
```typescript
it('should update principal and recalculate', () => {
  const { result } = renderHook(() => useSimpleInterestCalculator())
  
  act(() => {
    result.current.setPrincipal(20000)
  })
  
  expect(result.current.principal).toBe(20000)
  expect(result.current.result.interest.toNumber()).toBe(2000)
})
```

### 3. Testes de Componentes
Testam a renderização e interação do usuário:
- Renderização correta de props
- Interações do usuário (clicks, inputs)
- Estilos condicionais
- Acessibilidade

**Exemplo:**
```typescript
it('should call onChange when input value changes', async () => {
  const onChange = vi.fn()
  render(<SliderInputField {...props} onChange={onChange} />)
  
  const input = screen.getByRole('spinbutton')
  await user.type(input, '75')
  
  expect(onChange).toHaveBeenCalled()
})
```

## 📊 Cobertura de Testes

O projeto visa manter alta cobertura de código:

- ✅ **Serviços:** 100% - Toda lógica financeira testada
- ✅ **Hooks:** 90%+ - Estado e computações testados
- ✅ **Componentes:** 80%+ - Renderização e interações

### Visualizar Cobertura

Após executar `npm run test:coverage`, abra:
```
coverage/index.html
```

## 🎯 Boas Práticas

### 1. AAA Pattern (Arrange-Act-Assert)
```typescript
it('should calculate correctly', () => {
  // Arrange
  const input = { principal: 10000, rate: 10 }
  
  // Act
  const result = calculate(input)
  
  // Assert
  expect(result).toBe(1000)
})
```

### 2. Testes Descritivos
- Use nomes claros e descritivos
- Um conceito por teste
- Evite testes muito grandes

### 3. Mocking Estratégico
- Mock apenas dependências externas
- Use `vi.fn()` para funções spy
- Evite mockar a lógica sendo testada

### 4. Valores de Teste Realistas
- Use valores que reflitam casos reais
- Teste edge cases (zero, negativos, muito grandes)
- Inclua casos de erro

## 🔧 Configuração

### vitest.config.ts
```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

### Setup Global
Arquivo `src/test/setup.ts` configura:
- Matchers do jest-dom
- Cleanup automático após cada teste
- Extensões do expect

## 🐛 Debugging

### 1. Testes com UI
```bash
npm run test:ui
```
Interface visual para depuração interativa.

### 2. Debug Individual
```bash
npm test -- SliderInputField
```

### 3. Console no Teste
```typescript
it('debug test', () => {
  const { debug } = render(<Component />)
  debug() // Imprime o DOM
})
```

## 📚 Recursos

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

## ✅ Checklist para Novos Testes

- [ ] Testa o caso de uso principal
- [ ] Testa casos extremos (edge cases)
- [ ] Testa tratamento de erros
- [ ] Nome do teste é claro e descritivo
- [ ] Não possui dependências de outros testes
- [ ] Rápido de executar (< 100ms idealmente)
- [ ] Não usa valores hardcoded sem explicação
