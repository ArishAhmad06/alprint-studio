import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/product/ProductCard';
import { Button, ColorSwatch, Badge, EmptyState, Skeleton, RegistrationDivider } from '../components/ui';
import { useCartStore } from '../store/cart';
import { ColorVariant, SizeOption } from '../types';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, loading, error } = useProduct(slug || '');
  const { data: related } = useProducts(product?.categorySlug);

  const addItem = useCartStore((s) => s.addItem);

  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Initialize selections when product loads
  const currentColor = selectedColor || product?.colors[0] || null;
  const currentSize = selectedSize || product?.sizes.find((s) => s.inStock) || null;

  // Current display image (switches with color)
  const displayImage = useMemo(() => {
    if (currentColor?.image) return currentColor.image;
    return product?.images[activeImage] || '';
  }, [currentColor, product, activeImage]);

  const relatedProducts = useMemo(() => {
    return (related || []).filter((p) => p.id !== product?.id).slice(0, 4);
  }, [related, product]);

  const handleAddToCart = () => {
    if (!product || !currentColor || !currentSize) return;
    addItem({
      productId: product.id,
      product,
      color: currentColor,
      size: currentSize,
      quantity,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleColorChange = (color: ColorVariant) => {
    setSelectedColor(color);
    // Don't reset size when changing color
  };

  const handleSizeChange = (size: SizeOption) => {
    setSelectedSize(size);
    // Don't reset color when changing size
  };

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          <Skeleton className="aspect-square" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-16">
        <EmptyState
          title="Product not found"
          description="The product you're looking for doesn't exist or has been removed."
          action={<Link to="/"><Button>Back to Home</Button></Link>}
        />
      </div>
    );
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-xs text-muted flex-wrap">
          <li><Link to="/" className="hover:text-ink transition-colors">Home</Link></li>
          <li><span className="text-border">/</span></li>
          <li><Link to={`/category/${product.categorySlug}`} className="hover:text-ink transition-colors capitalize">{product.categorySlug.replace('-', ' ')}</Link></li>
          <li><span className="text-border">/</span></li>
          <li className="text-ink font-medium">{product.name}</li>
        </ol>
      </nav>

      {/* Product Section */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Gallery */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="relative aspect-square bg-paper rounded-[var(--radius-card)] border border-border overflow-hidden">
            <img
              src={displayImage}
              alt={`${product.name} - ${currentColor?.name || 'default'} view`}
              className="w-full h-full object-cover"
            />
            {product.isNew && (
              <div className="absolute top-4 left-4">
                <Badge variant="new">New</Badge>
              </div>
            )}
            {product.discount && (
              <div className="absolute top-4 right-4">
                <Badge variant="sale">-{product.discount}%</Badge>
              </div>
            )}
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => { setActiveImage(i); setSelectedColor(null); }}
                className={`flex-shrink-0 w-16 h-16 rounded-[var(--radius-sm)] border overflow-hidden transition-all ${
                  activeImage === i && !selectedColor ? 'border-vermilion ring-1 ring-vermilion' : 'border-border hover:border-ink/30'
                }`}
              >
                <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
            {/* Color variant thumbnails */}
            {product.colors.map((color) => (
              <button
                key={color.id}
                onClick={() => handleColorChange(color)}
                className={`flex-shrink-0 w-16 h-16 rounded-[var(--radius-sm)] border overflow-hidden transition-all ${
                  selectedColor?.id === color.id ? 'border-vermilion ring-1 ring-vermilion' : 'border-border hover:border-ink/30'
                }`}
              >
                <img src={color.image} alt={color.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h1 className="font-serif text-2xl lg:text-3xl font-light text-ink">{product.name}</h1>

          {/* Price */}
          <div className="flex items-center gap-3 mt-3">
            <span className="text-2xl font-semibold text-ink">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-muted line-through">${product.originalPrice.toFixed(2)}</span>
                <Badge variant="sale">Save {product.discount}%</Badge>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted leading-relaxed mt-4">{product.description}</p>

          {/* Color Selector */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-ink">
                Color: {currentColor ? <span className="font-normal text-muted">{currentColor.name}</span> : ''}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <ColorSwatch
                  key={color.id}
                  color={color}
                  selected={currentColor?.id === color.id}
                  onSelect={() => handleColorChange(color)}
                />
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-ink">Size</span>
              <button
                onClick={() => setShowSizeGuide(!showSizeGuide)}
                className="text-xs text-vermilion hover:text-vermilion-dark transition-colors underline underline-offset-2"
              >
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => size.inStock && handleSizeChange(size)}
                  disabled={!size.inStock}
                  className={`px-4 py-2.5 text-sm border rounded-[var(--radius-sm)] transition-all ${
                    currentSize?.value === size.value
                      ? 'border-vermilion bg-vermilion/5 text-vermilion font-medium'
                      : size.inStock
                      ? 'border-border text-ink hover:border-ink/40'
                      : 'border-border text-muted/40 cursor-not-allowed line-through'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
            {/* Size Guide Modal */}
            {showSizeGuide && (
              <div className="mt-3 p-4 bg-paper border border-border rounded-[var(--radius-sm)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-ink">Size Guide</span>
                  <button onClick={() => setShowSizeGuide(false)} className="text-muted hover:text-ink">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-1.5 text-muted font-medium">Size</th>
                      <th className="text-left py-1.5 text-muted font-medium">Chest (in)</th>
                      <th className="text-left py-1.5 text-muted font-medium">Length (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['S', '36-38', '28'],
                      ['M', '39-41', '29'],
                      ['L', '42-44', '30'],
                      ['XL', '45-47', '31'],
                      ['2XL', '48-50', '32'],
                    ].map(([size, chest, length]) => (
                      <tr key={size} className="border-b border-border-light">
                        <td className="py-1.5 font-medium">{size}</td>
                        <td className="py-1.5 text-muted">{chest}</td>
                        <td className="py-1.5 text-muted">{length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <span className="text-sm font-medium text-ink block mb-3">Quantity</span>
            <div className="flex items-center border border-border rounded-[var(--radius-sm)] w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2.5 text-ink hover:bg-ink/5 transition-colors"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="px-4 py-2.5 text-sm font-medium text-ink border-x border-border min-w-[40px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2.5 text-ink hover:bg-ink/5 transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Availability */}
          <div className="mt-4">
            {currentColor?.inStock && currentSize?.inStock ? (
              <span className="text-xs text-green-600 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                In Stock — Ready to ship
              </span>
            ) : (
              <span className="text-xs text-red-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                Currently unavailable in this configuration
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              size="lg"
              className="flex-1"
              disabled={!currentColor?.inStock || !currentSize?.inStock}
              onClick={handleAddToCart}
            >
              {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              disabled={!currentColor?.inStock || !currentSize?.inStock}
            >
              Buy Now
            </Button>
          </div>

          {product.customizable && (
            <Link to={`/customize?product=${product.slug}`} className="block mt-3">
              <Button variant="ghost" size="lg" className="w-full">
                Customize This Product
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <>
          <RegistrationDivider className="my-16" />
          <section>
            <h2 className="font-serif text-2xl font-light text-ink mb-8">You Might Also Like</h2>
            <ProductGrid products={relatedProducts} />
          </section>
        </>
      )}
    </main>
  );
}
