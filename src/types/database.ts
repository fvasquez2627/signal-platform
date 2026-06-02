export type UserRole = "admin" | "manager" | "viewer";

export type SignalType =
  | "news"
  | "social"
  | "competitor"
  | "seo"
  | "trend"
  | "other";

export type DraftStatus = "draft" | "review" | "approved" | "published";

export type IntegrationPlatform =
  | "slack"
  | "hubspot"
  | "google_analytics"
  | "semrush"
  | "other";

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
  created_at?: string;
}

export interface Product {
  id: string;
  client_id: string;
  name: string;
  keywords: string[] | null;
  competitors: string[] | null;
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
  platform: IntegrationPlatform;
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
