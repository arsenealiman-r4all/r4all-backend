export type Bindings = {
  DB: D1Database;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: number;
  expires_at: string;
}

export interface Service {
  id?: number;
  title: string;
  description: string;
  icon?: string;
  image_url?: string;
  order_index?: number;
  is_active?: boolean;
}

export interface Project {
  id?: number;
  title: string;
  summary?: string;
  description?: string;
  country?: string;
  city?: string;
  status?: string;
  capacity_kw?: number;
  beneficiaries?: number;
  image_url?: string;
  start_date?: string;
  end_date?: string;
  order_index?: number;
  is_active?: boolean;
}

export interface BlogPost {
  id?: number;
  title: string;
  excerpt?: string;
  content: string;
  author?: string;
  category?: string;
  image_url?: string;
  slug: string;
  is_published?: boolean;
  published_at?: string;
}

export interface Event {
  id?: number;
  title: string;
  description?: string;
  date: string;
  location?: string;
  image_url?: string;
  registration_url?: string;
  is_active?: boolean;
}

export interface Partner {
  id?: number;
  name: string;
  type: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  order_index?: number;
  is_active?: boolean;
}

export interface Course {
  id?: number;
  title: string;
  description?: string;
  duration?: string;
  price?: number;
  certification?: boolean;
  enroll_link?: string;
  image_url?: string;
  order_index?: number;
  is_active?: boolean;
}

export interface Value {
  id?: number;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  order_index?: number;
  is_active?: boolean;
}

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  is_read?: boolean;
  created_at?: string;
}

export interface HeroSection {
  id?: number;
  title: string;
  subtitle?: string;
  image_url?: string;
  cta_text?: string;
  cta_url?: string;
  is_active?: boolean;
}

export interface SiteConfig {
  id?: number;
  key: string;
  value: string;
  type?: string;
}
