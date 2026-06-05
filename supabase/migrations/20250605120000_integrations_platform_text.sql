-- Allow integration keys from src/lib/integrations/config.ts
alter table public.integrations
  alter column platform type text using platform::text;

create unique index if not exists idx_integrations_client_platform
  on public.integrations (client_id, platform);
