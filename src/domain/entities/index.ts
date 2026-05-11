// Domain Layer - Entities
// Core business objects that are independent of any framework or database

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  socialLinks?: SocialLinks;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface Skill {
  name: string;
  category: SkillCategory;
  icon?: string;
  proficiency?: number; // 1-100
}

export type SkillCategory = 'frontend' | 'backend' | 'tools' | 'other';

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  isCurrentRole?: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

// Street Vendor
export type VendorCategory = 'food' | 'drinks' | 'goods' | 'services';

export type VendorType = 'fried rice' | 'noodles' | 'snacks' | 'drinks' | 'goods' | 'services';

export interface StreetVendor {
  id: string;
  name: string;
  description: string;
  category: VendorCategory;
  vendorType: VendorType;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  rating: number;
  priceRange: string;
  startTime: string; // e.g., "16:00"
  endTime: string;   // e.g., "21:00"
  isOpen: boolean;  // computed from time
  isVisible: boolean;
  imageUrl?: string;
  phone?: string;
}

// Role types
export type Role = 'customer' | 'vendor' | 'admin';

export interface MockAccount {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  vendorId?: string; // if role is vendor, link to their primary vendor data
  vendorId2?: string; // second warung (vendor can have up to 2)
}
