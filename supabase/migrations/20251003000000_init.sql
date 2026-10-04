-- ============================================================================
-- FinForge - Initial Schema
-- ============================================================================
-- Tabelas:
--   profiles, assets, fixed_income_details, transactions, price_cache
-- ============================================================================

-- ----------------------------------------------------------------------------
-- profiles: dados públicos do usuário (1:1 com auth.users)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  base_currency text not null default 'BRL',
  expected_rates jsonb not null default '{
    "STOCK": 0.12,
    "ETF": 0.10,
    "FII": 0.10,
    "CRYPTO": 0.20,
    "FIXED_INCOME": 0.11,
    "CASH": 0.01
  }'::jsonb,
  ipca_annual numeric not null default 4.5,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- assets: ativos da carteira do usuário
-- ----------------------------------------------------------------------------
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ticker text not null,
  name text not null,
  type text not null check (type in ('STOCK','ETF','FII','CRYPTO','FIXED_INCOME','CASH')),
  currency text not null default 'BRL' check (currency in ('BRL','USD')),
  exchange text,
  sector text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, ticker, type)
);

create index if not exists idx_assets_user_id on public.assets(user_id);
create index if not exists idx_assets_type on public.assets(type);

-- ----------------------------------------------------------------------------
-- fixed_income_details: detalhes específicos de renda fixa (1:1 opcional)
-- ----------------------------------------------------------------------------
create table if not exists public.fixed_income_details (
  asset_id uuid primary key references public.assets(id) on delete cascade,
  kind text not null check (kind in ('CDB','LCI','LCA','TESOURO','DEBENTURE','CRI','CRA','LC','OTHER')),
  indexer text not null check (indexer in ('PRE','CDI','IPCA','SELIC','OTHER')),
  rate numeric not null, -- ex: 110 = 110% do CDI; 13.5 = 13.5% a.a. prefixado; 6 = IPCA+6%
  maturity_date date,
  issuer text,
  current_value numeric -- valor atualizado manualmente (RF não tem cotação de mercado)
);

-- ----------------------------------------------------------------------------
-- transactions: compras, vendas, dividendos, aportes em caixa
-- ----------------------------------------------------------------------------
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  asset_id uuid not null references public.assets(id) on delete cascade,
  type text not null check (type in ('BUY','SELL','DIVIDEND','INCOME','SPLIT','BONUS')),
  quantity numeric not null default 0,
  unit_price numeric not null default 0,
  total numeric not null default 0, -- quantity * unit_price + fees (em moeda da transação)
  fees numeric not null default 0,
  currency text not null default 'BRL' check (currency in ('BRL','USD')),
  date date not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_transactions_user_id on public.transactions(user_id);
create index if not exists idx_transactions_asset_id on public.transactions(asset_id);
create index if not exists idx_transactions_date on public.transactions(date desc);

-- ----------------------------------------------------------------------------
-- price_cache: cache de cotações (compartilhado, leitura pública)
-- ----------------------------------------------------------------------------
create table if not exists public.price_cache (
  symbol text not null,
  currency text not null,
  price numeric not null,
  source text not null,
  updated_at timestamptz not null default now(),
  primary key (symbol, currency)
);

create index if not exists idx_price_cache_updated_at on public.price_cache(updated_at desc);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.assets enable row level security;
alter table public.fixed_income_details enable row level security;
alter table public.transactions enable row level security;
alter table public.price_cache enable row level security;

-- profiles: usuário só vê/edita o próprio perfil
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- assets: isolamento por user_id
drop policy if exists "assets_select_own" on public.assets;
create policy "assets_select_own" on public.assets
  for select using (auth.uid() = user_id);

drop policy if exists "assets_insert_own" on public.assets;
create policy "assets_insert_own" on public.assets
  for insert with check (auth.uid() = user_id);

drop policy if exists "assets_update_own" on public.assets;
create policy "assets_update_own" on public.assets
  for update using (auth.uid() = user_id);

drop policy if exists "assets_delete_own" on public.assets;
create policy "assets_delete_own" on public.assets
  for delete using (auth.uid() = user_id);

-- fixed_income_details: usuário só vê detalhes de ativos próprios
drop policy if exists "fixed_income_select_own" on public.fixed_income_details;
create policy "fixed_income_select_own" on public.fixed_income_details
  for select using (
    exists (select 1 from public.assets a where a.id = asset_id and a.user_id = auth.uid())
  );

drop policy if exists "fixed_income_insert_own" on public.fixed_income_details;
create policy "fixed_income_insert_own" on public.fixed_income_details
  for insert with check (
    exists (select 1 from public.assets a where a.id = asset_id and a.user_id = auth.uid())
  );

drop policy if exists "fixed_income_update_own" on public.fixed_income_details;
create policy "fixed_income_update_own" on public.fixed_income_details
  for update using (
    exists (select 1 from public.assets a where a.id = asset_id and a.user_id = auth.uid())
  );

drop policy if exists "fixed_income_delete_own" on public.fixed_income_details;
create policy "fixed_income_delete_own" on public.fixed_income_details
  for delete using (
    exists (select 1 from public.assets a where a.id = asset_id and a.user_id = auth.uid())
  );

-- transactions: isolamento por user_id
drop policy if exists "transactions_select_own" on public.transactions;
create policy "transactions_select_own" on public.transactions
  for select using (auth.uid() = user_id);

drop policy if exists "transactions_insert_own" on public.transactions;
create policy "transactions_insert_own" on public.transactions
  for insert with check (auth.uid() = user_id);

drop policy if exists "transactions_update_own" on public.transactions;
create policy "transactions_update_own" on public.transactions
  for update using (auth.uid() = user_id);

drop policy if exists "transactions_delete_own" on public.transactions;
create policy "transactions_delete_own" on public.transactions
  for delete using (auth.uid() = user_id);

-- price_cache: leitura pública, escrita apenas service_role (via API route)
drop policy if exists "price_cache_select_public" on public.price_cache;
create policy "price_cache_select_public" on public.price_cache
  for select using (true);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Atualizar updated_at automaticamente
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_assets_updated_at on public.assets;
create trigger trg_assets_updated_at
  before update on public.assets
  for each row execute function public.set_updated_at();

-- ============================================================================
-- AUTO-CRIAR PROFILE NO SIGNUP
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();