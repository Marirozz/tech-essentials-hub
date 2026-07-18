-- Ejecuta este archivo una sola vez en Supabase SQL Editor
-- si ya habías ejecutado schema.sql antes de añadir el administrador de guías.

create table if not exists public.guides (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,
  excerpt text not null,
  image text not null,
  minutes integer not null default 8 check (minutes > 0),
  introduction text not null default '',
  selection_criteria text not null default '',
  how_to_choose text not null default '',
  faq jsonb not null default '[]'::jsonb,
  conclusion text not null default '',
  affiliate_notice text not null default 'Este artículo puede contener enlaces de afiliado. Tech Essentials Hub podría recibir una comisión si realizas una compra mediante alguno de ellos, sin costo adicional para ti.',
  meta_title text,
  meta_description text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.guide_products (
  guide_id uuid not null references public.guides(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  position integer not null default 0,
  badge text,
  note text,
  primary key (guide_id, product_id)
);

create index if not exists guides_slug_idx on public.guides(slug);
create index if not exists guides_status_idx on public.guides(status);
create index if not exists guides_category_idx on public.guides(category);
create index if not exists guides_featured_idx on public.guides(featured);
create index if not exists guide_products_guide_idx on public.guide_products(guide_id, position);
create index if not exists guide_products_product_idx on public.guide_products(product_id);

alter table public.guides enable row level security;
alter table public.guide_products enable row level security;

drop policy if exists "published guides are public" on public.guides;
create policy "published guides are public"
on public.guides for select
to anon, authenticated
using (status = 'published');

drop policy if exists "published guide products are public" on public.guide_products;
create policy "published guide products are public"
on public.guide_products for select
to anon, authenticated
using (
  exists (
    select 1 from public.guides
    where guides.id = guide_products.guide_id
      and guides.status = 'published'
  )
);
