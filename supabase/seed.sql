-- YouTheory client
INSERT INTO public.clients
(id, name, brand_voice, compliance_notes)
VALUES (
  'a0000000-0000-4000-8000-000000000001',
  'YouTheory',
  'Clean, science-backed, approachable. Real results for real people. Never clinical or cold — always human and encouraging.',
  'No disease claims. FDA disclaimer required on all health claims. No before/after medical claims. Ingredient claims must be substantiated.'
) ON CONFLICT (id) DO NOTHING;

-- All Products (brand level)
INSERT INTO public.products
(id, client_id, name, keywords, competitors,
target_demographic, primary_benefit,
content_angles, seasonal_peaks,
primary_platforms, brand_url)
VALUES (
  'b0000000-0000-4000-8000-000000000001',
  'a0000000-0000-4000-8000-000000000001',
  'All Products',
  ARRAY['youtheory', 'supplements', 'wellness', 'vitamins', 'health supplements'],
  ARRAY['Vital Proteins', 'Garden of Life', 'Sports Research', 'Ancient Nutrition', 'NeoCell', 'Nature Made', 'Natrol'],
  'Women 30-55, health-conscious, active lifestyle',
  'Complete wellness from within',
  '["brand story", "product education", "lifestyle integration", "clinical credibility"]'::jsonb,
  '["January", "May", "September"]'::jsonb,
  '["tiktok", "meta", "google", "amazon"]'::jsonb,
  'https://www.youtheory.com'
) ON CONFLICT (id) DO NOTHING;

-- Collagen Peptides
INSERT INTO public.products
(id, client_id, name, keywords, competitors,
target_demographic, primary_benefit,
content_angles, seasonal_peaks,
primary_platforms, product_url, brand_url)
VALUES (
  'b0000000-0000-4000-8000-000000000002',
  'a0000000-0000-4000-8000-000000000001',
  'Collagen Peptides',
  ARRAY['collagen peptides', 'marine collagen', 'bovine collagen', 'collagen powder', 'collagen supplement', 'type 1 collagen', 'type 2 collagen', 'collagen for skin', 'collagen for joints', 'collagen coffee'],
  ARRAY['Vital Proteins', 'NeoCell', 'Sports Research', 'Garden of Life Collagen', 'Ancient Nutrition Collagen', 'Great Lakes Collagen'],
  'Women 28-45, fitness and beauty focused',
  'Skin elasticity, joint support, hair and nail strength',
  '["morning routine integration", "before/after transformation", "clinical credibility", "mixability demo", "collagen coffee trend"]'::jsonb,
  '["January new year", "May summer skin prep", "September back to routine"]'::jsonb,
  '["tiktok", "meta", "instagram", "google"]'::jsonb,
  'https://www.youtheory.com/collections/collagen',
  'https://www.youtheory.com'
) ON CONFLICT (id) DO NOTHING;

-- Hyaluronic Acid
INSERT INTO public.products
(id, client_id, name, keywords, competitors,
target_demographic, primary_benefit,
content_angles, seasonal_peaks,
primary_platforms, product_url, brand_url)
VALUES (
  'b0000000-0000-4000-8000-000000000003',
  'a0000000-0000-4000-8000-000000000001',
  'Hyaluronic Acid',
  ARRAY['hyaluronic acid supplement', 'oral hyaluronic acid', 'HA supplement', 'hyaluronic acid for skin', 'hyaluronic acid for joints', 'skin hydration supplement', 'hyaluronic acid pills'],
  ARRAY['Solgar Hyaluronic Acid', 'NOW Foods HA', 'Nature''s Bounty Hyaluronic Acid', 'Doctor''s Best HA', 'Jarrow Hyaluronic Acid', 'Life Extension HA'],
  'Women 40-65, anti-aging and joint health focused',
  'Deep skin hydration and joint lubrication from within',
  '["skin hydration from within", "joint fluid support", "anti-aging education", "vs topical HA", "dermatologist angle"]'::jsonb,
  '["January anti-aging resolutions", "March spring skin", "October dry season prep"]'::jsonb,
  '["meta", "google", "instagram", "tiktok"]'::jsonb,
  'https://www.youtheory.com/collections/hyaluronic-acid/products/hyaluronic-acid',
  'https://www.youtheory.com'
) ON CONFLICT (id) DO NOTHING;

-- Ashwagandha
INSERT INTO public.products
(id, client_id, name, keywords, competitors,
target_demographic, primary_benefit,
content_angles, seasonal_peaks,
primary_platforms, product_url, brand_url)
VALUES (
  'b0000000-0000-4000-8000-000000000004',
  'a0000000-0000-4000-8000-000000000001',
  'Ashwagandha',
  ARRAY['ashwagandha supplement', 'KSM-66 ashwagandha', 'stress relief supplement', 'adaptogen supplement', 'ashwagandha for anxiety', 'ashwagandha for sleep', 'ashwagandha for cortisol'],
  ARRAY['Goli Ashwagandha', 'Nature Made Ashwagandha', 'Organic India Ashwagandha', 'KSM-66 brand', 'Moon Juice Ashwagandha', 'Nutranize Zone'],
  'Women and Men 25-45, stress and performance focused',
  'Stress reduction, cortisol balance, better sleep and focus',
  '["cortisol and stress education", "sleep improvement", "work performance", "adaptogen explainer", "morning vs night timing"]'::jsonb,
  '["January stress reset", "August back to school stress", "November holiday stress"]'::jsonb,
  '["tiktok", "meta", "google", "youtube"]'::jsonb,
  'https://www.youtheory.com/collections/ashwagandha',
  'https://www.youtheory.com'
) ON CONFLICT (id) DO NOTHING;

-- Turmeric
INSERT INTO public.products
(id, client_id, name, keywords, competitors,
target_demographic, primary_benefit,
content_angles, seasonal_peaks,
primary_platforms, product_url, brand_url)
VALUES (
  'b0000000-0000-4000-8000-000000000005',
  'a0000000-0000-4000-8000-000000000001',
  'Turmeric',
  ARRAY['turmeric supplement', 'turmeric curcumin', 'curcumin supplement', 'anti-inflammatory supplement', 'turmeric for joints', 'turmeric for inflammation', 'black pepper turmeric'],
  ARRAY['Qunol Turmeric', 'Nature''s Bounty Turmeric', 'Garden of Life Turmeric', 'Doctor''s Best Curcumin', 'Gaia Herbs Turmeric', 'New Chapter Turmeric'],
  'Men and Women 45-65, joint health and inflammation focused',
  'Natural anti-inflammatory support for joints and whole body',
  '["joint pain education", "anti-inflammatory lifestyle", "turmeric vs ibuprofen angle", "golden milk recipe", "absorption and bioavailability"]'::jsonb,
  '["January joint health resolutions", "May outdoor activity season", "October arthritis awareness"]'::jsonb,
  '["meta", "google", "facebook", "youtube"]'::jsonb,
  'https://www.youtheory.com/collections/turmeric',
  'https://www.youtheory.com'
) ON CONFLICT (id) DO NOTHING;

-- Biotin
INSERT INTO public.products
(id, client_id, name, keywords, competitors,
target_demographic, primary_benefit,
content_angles, seasonal_peaks,
primary_platforms, product_url, brand_url)
VALUES (
  'b0000000-0000-4000-8000-000000000006',
  'a0000000-0000-4000-8000-000000000001',
  'Biotin',
  ARRAY['biotin supplement', 'biotin for hair growth', 'biotin for nails', 'biotin 5000mcg', 'biotin 10000mcg', 'hair growth supplement', 'hair skin nails vitamin'],
  ARRAY['Nature''s Bounty Biotin', 'Natrol Biotin', 'Sports Research Biotin', 'Jarrow Biotin', 'Olly Hair Vitamins', 'Nutrafol'],
  'Women 18-40, hair and nail beauty focused',
  'Stronger hair, nails, and skin from within',
  '["hair growth transformation", "nail strength before/after", "biotin dosage education", "hair loss causes", "beauty from within"]'::jsonb,
  '["January hair goals", "April spring beauty refresh", "September back to school beauty"]'::jsonb,
  '["tiktok", "instagram", "meta", "pinterest"]'::jsonb,
  'https://www.youtheory.com/collections/biotin',
  'https://www.youtheory.com'
) ON CONFLICT (id) DO NOTHING;
