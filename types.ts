
export interface NavItem {
  label: string;
  path: string;
  subItems?: NavItem[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

export enum SectionType {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  PRODUCTS = 'PRODUCTS',
  PROCESS = 'PROCESS',
  CONTACT = 'CONTACT'
}

// --- Admin & CMS Types ---

export interface Post {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string;
  status: 'Published' | 'Draft';
  views: number;
  content?: string; // HTML or Markdown content
}

export type BorderRadiusSize = 'rounded-none' | 'rounded-md' | 'rounded-xl' | 'rounded-full';

export interface SiteConfig {
  siteName: string;
  siteDescription: string;
  primaryColor: string; // The signature brand color
  borderRadius: BorderRadiusSize; // Global border radius setting
  seoKeywords: string;
  contactEmail: string;
  logoUrl?: string | null; // URL or Base64 string of the uploaded logo
}

export interface Certification {
  id: string;
  title: string;
  imageUrl: string;
}

// Flexible key-value store for page texts and images
export interface ContentMap {
  [key: string]: string; 
  // Example: 'home_hero_title': 'The Future of...'
  // 'home_hero_bg': 'https://...'
}

export type Language = 'KOR' | 'ENG' | 'JPN';
