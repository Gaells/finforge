# Supabase

Crie um projeto em https://supabase.com e rode a migration `supabase/migrations/20251003000000_init.sql` no SQL Editor do painel.

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## Estrutura

- `supabase/migrations/` — arquivos SQL versionados
- `src/lib/supabase/client.ts` — client para componentes do browser
- `src/lib/supabase/server.ts` — client para Server Components / Server Actions
- `src/lib/supabase/middleware.ts` — refresh de sessão (chamado por `middleware.ts` na raiz)
- `src/lib/supabase/types.ts` — tipos manuais (regeneráveis com `supabase gen types`)

## Auth

Email/senha habilitado por padrão no Supabase. Para desabilitar confirmação de email durante desenvolvimento: Authentication → Providers → Email → "Confirm email" = OFF.