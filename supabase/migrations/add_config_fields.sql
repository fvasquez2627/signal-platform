-- Extended client & product configuration for URL-driven onboarding

ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS brand_url text,
ADD COLUMN IF NOT EXISTS primary_category text,
ADD COLUMN IF NOT EXISTS target_demographic text,
ADD COLUMN IF NOT EXISTS primary_platforms jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS certifications jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS key_brand_claims jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS suggested_competitors text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS internal_notes text;

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS key_ingredients jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS approved_claims jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS restricted_claims jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS price_tier text,
ADD COLUMN IF NOT EXISTS internal_notes text,
ADD COLUMN IF NOT EXISTS tags jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS competitor_sources jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS certifications jsonb DEFAULT '[]';
