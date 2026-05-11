import { Utensils, Coffee, Package, Wrench } from 'lucide-react';
import type { VendorCategory } from '../../../../domain/entities';

export const markerColors = {
  open: '#22c55e',
  openingSoon: '#eab308',
  closed: '#9ca3af',
} as const;

export const categoryIcons = {
  food: Utensils,
  drinks: Coffee,
  goods: Package,
  services: Wrench,
} as const;

export const categoryColors: Record<VendorCategory, string> = {
  food: 'text-orange-600',
  drinks: 'text-blue-600',
  goods: 'text-green-600',
  services: 'text-purple-600',
};

export const categoryBgColors: Record<VendorCategory, string> = {
  food: 'bg-orange-100',
  drinks: 'bg-blue-100',
  goods: 'bg-green-100',
  services: 'bg-purple-100',
};