# SIGNAL

Multi-client content intelligence platform built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.local.example` to `.env.local` and fill in your project URL and anon key
3. Run the schema in `supabase/schema.sql` via the Supabase SQL Editor

### 3. Create a user

Sign up via the `/login` page, then promote your user to admin in the SQL editor:

```sql
update public.profiles set role = 'admin' where id = 'YOUR_USER_UUID';

-- Optional: link user to demo client
insert into public.client_users (client_id, user_id, role)
values ('a0000000-0000-4000-8000-000000000001', 'YOUR_USER_UUID', 'admin');
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Supabase auth** — email/password login, protected routes, middleware redirect
- **Role-based navigation** — admin (all), manager (no settings), viewer (overview only)
- **App shell** — sidebar (desktop), bottom nav (mobile), top bar with client/product selectors
- **Summary / Detail toggle** — on every page
- **Dark theme** — SIGNAL color palette with Syne + Instrument Sans fonts

## Project structure

```
src/
  app/
    (app)/          # Protected routes with app shell
    login/          # Public login page
    auth/callback/  # OAuth / magic link callback
  components/
    layout/         # Sidebar, TopBar, MobileNav, PageHeader
    auth/           # Login form, sign out
  context/          # App-wide client/product state
  lib/
    supabase/       # Browser, server, middleware clients
    auth/           # Session helpers
    navigation.ts   # Role-based nav config
supabase/
  schema.sql        # Full database schema + RLS
```

## Roles

| Role    | Navigation access                          |
|---------|--------------------------------------------|
| admin   | All pages including Settings               |
| manager | All except Settings                        |
| viewer  | Overview (`/dashboard`) only               |
