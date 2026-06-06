export type BrandDiscovery = {
  name: string;
  brand_voice: string;
  compliance_notes: string;
  primary_category: string;
  target_demographic: string;
  primary_platforms: string[];
  suggested_competitors: string[];
  certifications: string[];
  key_brand_claims: string[];
  brand_url: string;
};

export type ProductDiscovery = {
  name: string;
  primary_benefit: string;
  key_ingredients: string[];
  target_demographic: string;
  keywords: string[];
  competitors: string[];
  content_angles: string[];
  seasonal_peaks: string[];
  primary_platforms: string[];
  price_tier: string;
  certifications: string[];
  approved_claims: string[];
  restricted_claims: string[];
  product_url: string;
  brand_url: string;
};

export type BrandContext = {
  name: string;
  category: string;
};

export type DiscoverError = {
  error: string;
  partial?: Partial<BrandDiscovery | ProductDiscovery>;
};

export type DiscoveryResponse<T> = T & {
  incomplete?: boolean;
  warning?: string;
  error?: string;
};
