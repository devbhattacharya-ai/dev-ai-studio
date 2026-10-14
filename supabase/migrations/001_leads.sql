-- Run this in the Supabase SQL Editor after creating your project

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  phone text,
  business text,
  message text not null,
  source text default 'website',
  status text default 'new',
  notes text
);

-- Enable Row Level Security
alter table public.leads enable row level security;

-- Allow anonymous inserts (public form)
create policy "Anyone can insert leads"
  on public.leads
  for insert
  to anon
  with check (true);

-- Only authenticated users can read (your admin login)
create policy "Authenticated users can view leads"
  on public.leads
  for select
  to authenticated
  using (true);

-- Optional: allow service role full access (already default)
