// ============================================
// Alprint — Product Service
// TODO: Replace mock data with real API calls
// Endpoint: GET /api/v1/products, GET /api/v1/products/:slug
// ============================================

import { Product, FilterState } from '../types';

// Placeholder image generator using SVG data URIs for consistent mockups
function placeholderProduct(type: string, color: string, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="700" viewBox="0 0 600 700">
    <rect width="600" height="700" fill="${color}"/>
    <rect x="150" y="150" width="300" height="400" rx="8" fill="white" opacity="0.9"/>
    <text x="300" y="340" font-family="Inter, sans-serif" font-size="16" fill="#1C1B1A" text-anchor="middle" opacity="0.6">${type}</text>
    <text x="300" y="370" font-family="Inter, sans-serif" font-size="12" fill="#6B6560" text-anchor="middle">${label}</text>
    <text x="300" y="400" font-family="Inter, sans-serif" font-size="10" fill="#9B9590" text-anchor="middle">Product Mockup</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const PRODUCTS: Product[] = [
  // T-Shirts
  {
    id: 'prod-1',
    slug: 'classic-crew-tee',
    name: 'Classic Crew Tee',
    description: 'A timeless crew-neck tee in premium combed cotton. Soft hand-feel, pre-shrunk, and built to last. Print your design on the front, back, or both.',
    price: 24.99,
    originalPrice: 32.99,
    discount: 24,
    categorySlug: 't-shirts',
    subcategorySlug: 'crew-neck',
    colors: [
      { id: 'c1', name: 'White', hex: '#FFFFFF', image: placeholderProduct('T-Shirt', '#FFFFFF', 'White'), inStock: true },
      { id: 'c2', name: 'Black', hex: '#1C1B1A', image: placeholderProduct('T-Shirt', '#1C1B1A', 'Black'), inStock: true },
      { id: 'c3', name: 'Heather Grey', hex: '#B0AAA0', image: placeholderProduct('T-Shirt', '#B0AAA0', 'Heather Grey'), inStock: true },
      { id: 'c4', name: 'Navy', hex: '#2C3E50', image: placeholderProduct('T-Shirt', '#2C3E50', 'Navy'), inStock: false },
    ],
    sizes: [
      { label: 'XS', value: 'xs', inStock: true },
      { label: 'S', value: 's', inStock: true },
      { label: 'M', value: 'm', inStock: true },
      { label: 'L', value: 'l', inStock: true },
      { label: 'XL', value: 'xl', inStock: true },
      { label: '2XL', value: '2xl', inStock: true },
    ],
    images: [
      placeholderProduct('T-Shirt', '#FFFFFF', 'Front View'),
      placeholderProduct('T-Shirt', '#FFFFFF', 'Back View'),
      placeholderProduct('T-Shirt', '#FFFFFF', 'Detail'),
    ],
    isFeatured: true,
    customizable: true,
  },
  {
    id: 'prod-2',
    slug: 'oversized-essential-tee',
    name: 'Oversized Essential Tee',
    description: 'Relaxed fit, dropped shoulders, and extra length. The perfect canvas for bold, oversized prints.',
    price: 29.99,
    categorySlug: 't-shirts',
    subcategorySlug: 'oversized',
    colors: [
      { id: 'c5', name: 'Cream', hex: '#F5F0E8', image: placeholderProduct('T-Shirt', '#F5F0E8', 'Cream'), inStock: true },
      { id: 'c6', name: 'Sage', hex: '#8B9E8B', image: placeholderProduct('T-Shirt', '#8B9E8B', 'Sage'), inStock: true },
      { id: 'c7', name: 'Charcoal', hex: '#4A4A4A', image: placeholderProduct('T-Shirt', '#4A4A4A', 'Charcoal'), inStock: true },
    ],
    sizes: [
      { label: 'S', value: 's', inStock: true },
      { label: 'M', value: 'm', inStock: true },
      { label: 'L', value: 'l', inStock: true },
      { label: 'XL', value: 'xl', inStock: true },
    ],
    images: [placeholderProduct('T-Shirt', '#F5F0E8', 'Front')],
    isNew: true,
    customizable: true,
  },
  // Hoodies
  {
    id: 'prod-3',
    slug: 'premium-fleece-hoodie',
    name: 'Premium Fleece Hoodie',
    description: 'Heavyweight 380gsm fleece with a brushed interior. Kangaroo pocket, ribbed cuffs, and a double-lined hood. Built for comfort and custom printing.',
    price: 54.99,
    categorySlug: 'hoodies',
    subcategorySlug: 'pullover',
    colors: [
      { id: 'c8', name: 'Black', hex: '#1C1B1A', image: placeholderProduct('Hoodie', '#1C1B1A', 'Black'), inStock: true },
      { id: 'c9', name: 'Oatmeal', hex: '#D4C9B8', image: placeholderProduct('Hoodie', '#D4C9B8', 'Oatmeal'), inStock: true },
      { id: 'c10', name: 'Forest', hex: '#2D4A3E', image: placeholderProduct('Hoodie', '#2D4A3E', 'Forest'), inStock: true },
    ],
    sizes: [
      { label: 'S', value: 's', inStock: true },
      { label: 'M', value: 'm', inStock: true },
      { label: 'L', value: 'l', inStock: true },
      { label: 'XL', value: 'xl', inStock: true },
      { label: '2XL', value: '2xl', inStock: true },
    ],
    images: [
      placeholderProduct('Hoodie', '#1C1B1A', 'Front'),
      placeholderProduct('Hoodie', '#1C1B1A', 'Back'),
    ],
    isFeatured: true,
    customizable: true,
  },
  {
    id: 'prod-4',
    slug: 'zip-up-hoodie',
    name: 'Zip-Up Hoodie',
    description: 'Full-zip hoodie with metal zipper, split kangaroo pockets, and a clean silhouette.',
    price: 59.99,
    categorySlug: 'hoodies',
    subcategorySlug: 'zip-up',
    colors: [
      { id: 'c11', name: 'Slate', hex: '#5A5A5A', image: placeholderProduct('Hoodie', '#5A5A5A', 'Slate'), inStock: true },
      { id: 'c12', name: 'Navy', hex: '#2C3E50', image: placeholderProduct('Hoodie', '#2C3E50', 'Navy'), inStock: true },
    ],
    sizes: [
      { label: 'S', value: 's', inStock: true },
      { label: 'M', value: 'm', inStock: true },
      { label: 'L', value: 'l', inStock: true },
      { label: 'XL', value: 'xl', inStock: false },
    ],
    images: [placeholderProduct('Hoodie', '#5A5A5A', 'Front')],
    customizable: true,
  },
  // Mugs
  {
    id: 'prod-5',
    slug: 'classic-ceramic-mug',
    name: 'Classic Ceramic Mug',
    description: '11oz glossy ceramic mug with a comfortable C-handle. Dishwasher and microwave safe. Full-wrap or single-side printing available.',
    price: 14.99,
    categorySlug: 'mugs',
    subcategorySlug: 'classic',
    colors: [
      { id: 'c13', name: 'White', hex: '#FFFFFF', image: placeholderProduct('Mug', '#FFFFFF', 'White'), inStock: true },
      { id: 'c14', name: 'Black', hex: '#1C1B1A', image: placeholderProduct('Mug', '#1C1B1A', 'Black'), inStock: true },
    ],
    sizes: [
      { label: '11oz', value: '11oz', inStock: true },
    ],
    images: [
      placeholderProduct('Mug', '#FFFFFF', 'Front'),
      placeholderProduct('Mug', '#FFFFFF', 'Side'),
    ],
    isFeatured: true,
    customizable: true,
  },
  {
    id: 'prod-6',
    slug: 'large-photo-mug',
    name: 'Large Photo Mug',
    description: '15oz mug with extra room for your favorite photos. Full-wrap printing for a panoramic effect.',
    price: 18.99,
    categorySlug: 'mugs',
    subcategorySlug: 'large',
    colors: [
      { id: 'c15', name: 'White', hex: '#FFFFFF', image: placeholderProduct('Mug', '#FFFFFF', 'White'), inStock: true },
    ],
    sizes: [
      { label: '15oz', value: '15oz', inStock: true },
    ],
    images: [placeholderProduct('Mug', '#FFFFFF', 'Front')],
    customizable: true,
  },
  // Bottles
  {
    id: 'prod-7',
    slug: 'insulated-steel-bottle',
    name: 'Insulated Steel Bottle',
    description: 'Double-wall vacuum insulated stainless steel. Keeps drinks cold for 24hrs or hot for 12hrs. Laser-engraved or printed designs.',
    price: 34.99,
    categorySlug: 'bottles',
    subcategorySlug: 'insulated',
    colors: [
      { id: 'c16', name: 'Silver', hex: '#C0C0C0', image: placeholderProduct('Bottle', '#C0C0C0', 'Silver'), inStock: true },
      { id: 'c17', name: 'Matte Black', hex: '#2A2A2A', image: placeholderProduct('Bottle', '#2A2A2A', 'Matte Black'), inStock: true },
      { id: 'c18', name: 'Rose Gold', hex: '#B76E79', image: placeholderProduct('Bottle', '#B76E79', 'Rose Gold'), inStock: true },
    ],
    sizes: [
      { label: '500ml', value: '500ml', inStock: true },
      { label: '750ml', value: '750ml', inStock: true },
    ],
    images: [placeholderProduct('Bottle', '#C0C0C0', 'Front')],
    isFeatured: true,
    customizable: true,
  },
  // Photo Gifts
  {
    id: 'prod-8',
    slug: 'modern-photo-frame',
    name: 'Modern Photo Frame',
    description: 'Minimalist frame with a slim profile. Available in multiple sizes. Print your photo directly onto the backing or use a real photo insert.',
    price: 22.99,
    categorySlug: 'photo-gifts',
    subcategorySlug: 'frames',
    colors: [
      { id: 'c19', name: 'Natural Oak', hex: '#C4A97D', image: placeholderProduct('Frame', '#C4A97D', 'Oak'), inStock: true },
      { id: 'c20', name: 'Walnut', hex: '#5C4033', image: placeholderProduct('Frame', '#5C4033', 'Walnut'), inStock: true },
      { id: 'c21', name: 'White', hex: '#FFFFFF', image: placeholderProduct('Frame', '#FFFFFF', 'White'), inStock: true },
    ],
    sizes: [
      { label: '5×7"', value: '5x7', inStock: true },
      { label: '8×10"', value: '8x10', inStock: true },
      { label: '11×14"', value: '11x14', inStock: true },
    ],
    images: [placeholderProduct('Frame', '#C4A97D', 'Front')],
    customizable: true,
  },
  // Accessories
  {
    id: 'prod-9',
    slug: 'classic-baseball-cap',
    name: 'Classic Baseball Cap',
    description: 'Six-panel cap with a curved visor and adjustable strap. Embroidered or printed customization.',
    price: 19.99,
    categorySlug: 'accessories',
    subcategorySlug: 'caps',
    colors: [
      { id: 'c22', name: 'Black', hex: '#1C1B1A', image: placeholderProduct('Cap', '#1C1B1A', 'Black'), inStock: true },
      { id: 'c23', name: 'White', hex: '#FFFFFF', image: placeholderProduct('Cap', '#FFFFFF', 'White'), inStock: true },
      { id: 'c24', name: 'Khaki', hex: '#C3B091', image: placeholderProduct('Cap', '#C3B091', 'Khaki'), inStock: true },
    ],
    sizes: [
      { label: 'One Size', value: 'one-size', inStock: true },
    ],
    images: [placeholderProduct('Cap', '#1C1B1A', 'Front')],
    customizable: true,
  },
  {
    id: 'prod-10',
    slug: 'custom-keychain',
    name: 'Custom Keychain',
    description: 'Acrylic or metal keychains with your photo, name, or design. Double-sided printing available.',
    price: 9.99,
    categorySlug: 'accessories',
    subcategorySlug: 'keychains',
    colors: [
      { id: 'c25', name: 'Clear Acrylic', hex: '#E8E8E8', image: placeholderProduct('Keychain', '#E8E8E8', 'Clear'), inStock: true },
      { id: 'c26', name: 'Silver Metal', hex: '#C0C0C0', image: placeholderProduct('Keychain', '#C0C0C0', 'Silver'), inStock: true },
      { id: 'c27', name: 'Gold Metal', hex: '#D4AF37', image: placeholderProduct('Keychain', '#D4AF37', 'Gold'), inStock: true },
    ],
    sizes: [
      { label: 'Small', value: 'sm', inStock: true },
      { label: 'Large', value: 'lg', inStock: true },
    ],
    images: [placeholderProduct('Keychain', '#C0C0C0', 'Front')],
    isNew: true,
    customizable: true,
  },
  {
    id: 'prod-11',
    slug: 'v-neck-tee',
    name: 'V-Neck Everyday Tee',
    description: 'A flattering V-neck cut in soft ringspun cotton. Great for subtle, elegant prints.',
    price: 26.99,
    categorySlug: 't-shirts',
    subcategorySlug: 'v-neck',
    colors: [
      { id: 'c28', name: 'White', hex: '#FFFFFF', image: placeholderProduct('T-Shirt', '#FFFFFF', 'White'), inStock: true },
      { id: 'c29', name: 'Burgundy', hex: '#722F37', image: placeholderProduct('T-Shirt', '#722F37', 'Burgundy'), inStock: true },
    ],
    sizes: [
      { label: 'XS', value: 'xs', inStock: true },
      { label: 'S', value: 's', inStock: true },
      { label: 'M', value: 'm', inStock: true },
      { label: 'L', value: 'l', inStock: true },
      { label: 'XL', value: 'xl', inStock: true },
    ],
    images: [placeholderProduct('T-Shirt', '#FFFFFF', 'Front')],
    customizable: true,
  },
  {
    id: 'prod-12',
    slug: 'travel-mug',
    name: 'Travel Tumbler',
    description: 'Spill-proof lid, double-wall insulation. Perfect for your morning commute with a custom design.',
    price: 24.99,
    categorySlug: 'mugs',
    subcategorySlug: 'travel',
    colors: [
      { id: 'c30', name: 'White', hex: '#FFFFFF', image: placeholderProduct('Tumbler', '#FFFFFF', 'White'), inStock: true },
      { id: 'c31', name: 'Black', hex: '#1C1B1A', image: placeholderProduct('Tumbler', '#1C1B1A', 'Black'), inStock: true },
    ],
    sizes: [
      { label: '16oz', value: '16oz', inStock: true },
    ],
    images: [placeholderProduct('Tumbler', '#FFFFFF', 'Front')],
    customizable: true,
  },
];

// TODO: Replace with fetch(`${API_URL}/api/v1/products?category=${categorySlug}&...`)
export async function getProducts(
  categorySlug?: string,
  filters?: Partial<FilterState>
): Promise<Product[]> {
  await new Promise((r) => setTimeout(r, 400));
  let results = [...PRODUCTS];

  if (categorySlug) {
    results = results.filter((p) => p.categorySlug === categorySlug);
  }

  if (filters) {
    if (filters.colors && filters.colors.length > 0) {
      results = results.filter((p) =>
        p.colors.some((c) => filters.colors!.includes(c.name.toLowerCase()))
      );
    }
    if (filters.priceRange) {
      results = results.filter(
        (p) => p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1]
      );
    }
    if (filters.productTypes && filters.productTypes.length > 0) {
      results = results.filter((p) =>
        filters.productTypes!.includes(p.subcategorySlug || '')
      );
    }
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        default:
          results.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      }
    }
  }

  return results;
}

// TODO: Replace with fetch(`${API_URL}/api/v1/products/:slug`)
export async function getProductBySlug(slug: string): Promise<Product | null> {
  await new Promise((r) => setTimeout(r, 200));
  return PRODUCTS.find((p) => p.slug === slug) || null;
}

// TODO: Replace with fetch(`${API_URL}/api/v1/products/featured`)
export async function getFeaturedProducts(): Promise<Product[]> {
  await new Promise((r) => setTimeout(r, 300));
  return PRODUCTS.filter((p) => p.isFeatured);
}

// TODO: Replace with fetch(`${API_URL}/api/v1/products/new`)
export async function getNewProducts(): Promise<Product[]> {
  await new Promise((r) => setTimeout(r, 300));
  return PRODUCTS.filter((p) => p.isNew);
}
