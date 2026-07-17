create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  brand text not null,
  category text not null,
  price text not null,
  score numeric(3,1) not null default 0 check (score >= 0 and score <= 10),
  best_for text not null,
  description text not null,
  image text not null,
  pros jsonb not null default '[]'::jsonb,
  cons jsonb not null default '[]'::jsonb,
  specs jsonb not null default '{}'::jsonb,
  affiliate_url text not null,
  verdict text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_slug_idx on public.products(slug);
create index if not exists products_status_idx on public.products(status);
create index if not exists products_category_idx on public.products(category);
create index if not exists products_featured_idx on public.products(featured);

alter table public.products enable row level security;

drop policy if exists "published products are public" on public.products;
create policy "published products are public"
on public.products for select
to anon, authenticated
using (status = 'published');
