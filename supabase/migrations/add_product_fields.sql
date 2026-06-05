ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS target_demographic text,
ADD COLUMN IF NOT EXISTS primary_benefit text,
ADD COLUMN IF NOT EXISTS content_angles jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS seasonal_peaks jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS primary_platforms jsonb DEFAULT '["tiktok","meta","google"]',
ADD COLUMN IF NOT EXISTS product_url text,
ADD COLUMN IF NOT EXISTS brand_url text;
