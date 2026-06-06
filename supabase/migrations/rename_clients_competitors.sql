-- Align clients table with app: brand-level competitors column is suggested_competitors
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS suggested_competitors text[] DEFAULT '{}';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'clients'
      AND column_name = 'competitors'
  ) THEN
    UPDATE public.clients
    SET suggested_competitors = competitors
    WHERE suggested_competitors = '{}'::text[]
      AND competitors IS NOT NULL
      AND competitors <> '{}'::text[];

    ALTER TABLE public.clients DROP COLUMN competitors;
  END IF;
END $$;
