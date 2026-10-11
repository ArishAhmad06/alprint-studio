// ============================================
// Alprint — Category Service
// TODO: Replace mock data with real API calls
// Endpoint: GET /api/v1/categories
// ============================================

import { Category } from '../types';

const CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    slug: 't-shirts',
    name: 'T-Shirts',
    description: 'Premium cotton tees, printed with your designs.',
    image: '/images/cat-tshirts.jpg',
    tint: '#F0E8E0',
    children: [
      { id: 'sub-1a', slug: 'crew-neck', name: 'Crew Neck', productCount: 12 },
      { id: 'sub-1b', slug: 'v-neck', name: 'V-Neck', productCount: 8 },
      { id: 'sub-1c', slug: 'oversized', name: 'Oversized', productCount: 6 },
    ],
  },
  {
    id: 'cat-2',
    slug: 'hoodies',
    name: 'Hoodies',
    description: 'Cozy fleece hoodies with custom prints.',
    image: '/images/cat-hoodies.jpg',
    tint: '#E8E4E0',
    children: [
      { id: 'sub-2a', slug: 'pullover', name: 'Pullover', productCount: 10 },
      { id: 'sub-2b', slug: 'zip-up', name: 'Zip-Up', productCount: 6 },
    ],
  },
  {
    id: 'cat-3',
    slug: 'mugs',
    name: 'Mugs',
    description: 'Ceramic mugs with photo-quality prints.',
    image: '/images/cat-mugs.jpg',
    tint: '#E8E0D8',
    children: [
      { id: 'sub-3a', slug: 'classic', name: 'Classic 11oz', productCount: 8 },
      { id: 'sub-3b', slug: 'large', name: 'Large 15oz', productCount: 5 },
      { id: 'sub-3c', slug: 'travel', name: 'Travel Mug', productCount: 4 },
    ],
  },
  {
    id: 'cat-4',
    slug: 'bottles',
    name: 'Bottles',
    description: 'Stainless steel bottles with your artwork.',
    image: '/images/cat-bottles.jpg',
    tint: '#E0E4E8',
    children: [
      { id: 'sub-4a', slug: 'insulated', name: 'Insulated', productCount: 6 },
      { id: 'sub-4b', slug: 'sport', name: 'Sport', productCount: 4 },
    ],
  },
  {
    id: 'cat-5',
    slug: 'photo-gifts',
    name: 'Photo Gifts',
    description: 'Frames, prints, and keepsakes with your photos.',
    image: '/images/cat-photogifts.jpg',
    tint: '#E8E8E0',
    children: [
      { id: 'sub-5a', slug: 'frames', name: 'Photo Frames', productCount: 10 },
      { id: 'sub-5b', slug: 'canvas', name: 'Canvas Prints', productCount: 6 },
      { id: 'sub-5c', slug: 'posters', name: 'Posters', productCount: 8 },
    ],
  },
  {
    id: 'cat-6',
    slug: 'accessories',
    name: 'Accessories',
    description: 'Caps, keychains, and more personalized items.',
    image: '/images/cat-accessories.jpg',
    tint: '#E4E0E8',
    children: [
      { id: 'sub-6a', slug: 'caps', name: 'Caps', productCount: 8 },
      { id: 'sub-6b', slug: 'keychains', name: 'Keychains', productCount: 12 },
      { id: 'sub-6c', slug: 'tote-bags', name: 'Tote Bags', productCount: 5 },
    ],
  },
];

// TODO: Replace with fetch(`${API_URL}/api/v1/categories`)
export async function getCategories(): Promise<Category[]> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 300));
  return CATEGORIES;
}

// TODO: Replace with fetch(`${API_URL}/api/v1/categories/:slug`)
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  await new Promise((r) => setTimeout(r, 200));
  return CATEGORIES.find((c) => c.slug === slug) || null;
}
