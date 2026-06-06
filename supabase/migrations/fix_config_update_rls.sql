-- Ensure config columns exist (idempotent)
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
ADD COLUMN IF NOT EXISTS target_demographic text,
ADD COLUMN IF NOT EXISTS primary_benefit text,
ADD COLUMN IF NOT EXISTS content_angles jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS seasonal_peaks jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS primary_platforms jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS product_url text,
ADD COLUMN IF NOT EXISTS brand_url text,
ADD COLUMN IF NOT EXISTS key_ingredients jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS approved_claims jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS restricted_claims jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS price_tier text,
ADD COLUMN IF NOT EXISTS internal_notes text,
ADD COLUMN IF NOT EXISTS tags jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS competitor_sources jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS certifications jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS compliance_notes text;

-- Products: allow any client member to update products for their client
DROP POLICY IF EXISTS "Client users can update products" ON public.products;

CREATE POLICY "Client users can update products"
ON public.products
FOR UPDATE
USING (
  public.is_admin()
  OR client_id IN (
    SELECT client_id FROM public.client_users
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  public.is_admin()
  OR client_id IN (
    SELECT client_id FROM public.client_users
    WHERE user_id = auth.uid()
  )
);

-- Clients: allow managers and client admins to update their client
DROP POLICY IF EXISTS "Client managers can update clients" ON public.clients;

CREATE POLICY "Client managers can update clients"
ON public.clients
FOR UPDATE
USING (
  public.is_admin()
  OR id IN (
    SELECT client_id FROM public.client_users
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'manager')
  )
)
WITH CHECK (
  public.is_admin()
  OR id IN (
    SELECT client_id FROM public.client_users
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'manager')
  )
);
