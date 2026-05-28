create table if not exists contact_submissions (
  id bigserial primary key,
  name text not null,
  email text not null,
  message text not null,
  subject text,
  source text,
  created_at timestamptz not null default now()
);

create table if not exists page_views (
  slug text primary key,
  views bigint not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists stats_cache (
  cache_key text primary key,
  stats jsonb not null,
  updated_at timestamptz not null default now()
);
