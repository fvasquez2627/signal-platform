export type UserRole = "admin" | "manager" | "viewer";

export type SignalType =
  | "news"
  | "social"
  | "competitor"
  | "seo"
  | "trend"
  | "other";

export type DraftStatus = "draft" | "review" | "approved" | "published";

export interface Profile {
  id: string;
  role: UserRole;
  created_at: string;
}

export interface Client {
  id: string;
  name: string;
  brand_voice: string | null;
  compliance_notes: string | null;
  brand_url?: string | null;
  primary_category?: string | null;
  target_demographic?: string | null;
  primary_platforms?: string[] | null;
  certifications?: string[] | null;
  key_brand_claims?: string[] | null;
  competitors?: string[] | null;
  internal_notes?: string | null;
  created_at?: string;
}

export interface Product {
  id: string;
  client_id: string;
  name: string;
  keywords: string[] | null;
  competitors: string[] | null;
  target_demographic?: string | null;
  primary_benefit?: string | null;
  content_angles?: string[] | null;
  seasonal_peaks?: string[] | null;
  primary_platforms?: string[] | null;
  product_url?: string | null;
  brand_url?: string | null;
  key_ingredients?: string[] | null;
  approved_claims?: string[] | null;
  restricted_claims?: string[] | null;
  price_tier?: string | null;
  internal_notes?: string | null;
  tags?: string[] | null;
  compliance_notes?: string | null;
  competitor_sources?: Record<string, "auto" | "manual"> | null;
  certifications?: string[] | null;
  created_at?: string;
}

export interface Signal {
  id: string;
  product_id: string;
  type: SignalType;
  source: string | null;
  title: string;
  body: string | null;
  score: number | null;
  created_at: string;
}

export interface ContentDraft {
  id: string;
  product_id: string;
  platform: string;
  hook: string | null;
  body: string | null;
  cta: string | null;
  status: DraftStatus;
  created_at?: string;
  updated_at?: string;
}

export interface Integration {
  id: string;
  client_id: string;
  platform: string;
  encrypted_key: string | null;
  connected: boolean;
  created_at?: string;
}

export interface ClientUser {
  id: string;
  client_id: string;
  user_id: string;
  role: UserRole;
  created_at?: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      clients: { Row: Client; Insert: Partial<Client>; Update: Partial<Client> };
      products: { Row: Product; Insert: Partial<Product>; Update: Partial<Product> };
      signals: { Row: Signal; Insert: Partial<Signal>; Update: Partial<Signal> };
      content_drafts: {
        Row: ContentDraft;
        Insert: Partial<ContentDraft>;
        Update: Partial<ContentDraft>;
      };
      integrations: {
        Row: Integration;
        Insert: Partial<Integration>;
        Update: Partial<Integration>;
      };
      client_users: {
        Row: ClientUser;
        Insert: Partial<ClientUser>;
        Update: Partial<ClientUser>;
      };
    };
  };
}
