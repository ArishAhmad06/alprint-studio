import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { ColorSwatch, Badge } from '../ui';
import { useCartStore } from '../../store/cart';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const defaultColor = product.colors[0];
  const defaultSize = product.sizes.find((s) => s.inStock) || product.sizes[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (defaultColor && defaultSize) {
      addItem({
        productId: product.id,
        product,
        color: defaultColor,
        size: defaultSize,
        quantity: 1,
      });
    }
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block bg-surface rounded-[var(--radius-card)] border border-border overflow-hidden transition-all duration-300 hover:shadow-lift hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] bg-paper overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {product.isNew && <Badge variant="new">New</Badge>}
          {product.discount && <Badge variant="sale">-{product.discount}%</Badge>}
        </div>
        {/* Quick Add */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-3 right-3 px-3 py-2 bg-ink text-white text-xs font-medium rounded-[var(--radius-sm)] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 hover:bg-vermilion"
          aria-label={`Quick add ${product.name} to cart`}
        >
          Quick Add
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-medium text-sm text-ink group-hover:text-vermilion transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-semibold text-ink">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
        {/* Color swatches */}
        <div className="flex items-center gap-1.5 mt-3">
          {product.colors.slice(0, 4).map((color) => (
            <ColorSwatch key={color.id} color={color} size="sm" />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[10px] text-muted ml-1">+{product.colors.length - 4}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ============================================
// Product Grid
// ============================================
export function ProductGrid({ products, loading }: { products: Product[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-surface rounded-[var(--radius-card)] border border-border overflow-hidden">
            <div className="aspect-[4/5] bg-border-light animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-border-light rounded animate-pulse w-3/4" />
              <div className="h-3 bg-border-light rounded animate-pulse w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
