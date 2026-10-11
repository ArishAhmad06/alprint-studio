// ============================================
// Alprint — Typed Models
// ============================================

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  tint: string; // CSS color for category card backgrounds
  children: Subcategory[];
}

export interface Subcategory {
  id: string;
  slug: string;
  name: string;
  productCount: number;
}

export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  image: string;
  inStock: boolean;
}

export interface SizeOption {
  label: string;
  value: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  categorySlug: string;
  subcategorySlug?: string;
  colors: ColorVariant[];
  sizes: SizeOption[];
  images: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  customizable: boolean;
}

export interface DesignSnapshot {
  text?: string;
  font?: string;
  textColor?: string;
  uploadedImage?: string;
  productColor?: string;
  // Future: canvas state, layers, etc.
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  color: ColorVariant;
  size: SizeOption;
  quantity: number;
  design?: DesignSnapshot;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

// API response shapes (for future backend integration)
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface FilterState {
  priceRange: [number, number];
  colors: string[];
  productTypes: string[];
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest';
}
