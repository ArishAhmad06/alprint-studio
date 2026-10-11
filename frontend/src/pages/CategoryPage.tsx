import { useState, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useCategory } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/product/ProductCard';
import { Button, EmptyState, Skeleton } from '../components/ui';
import { FilterState } from '../types';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const subSlug = searchParams.get('sub');

  const { data: category, loading: catLoading, error: catError } = useCategory(slug || '');
  const [filters, setFilters] = useState<Partial<FilterState>>({
    sortBy: 'featured',
    priceRange: [0, 200],
    colors: [],
    productTypes: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  const { data: products, loading: prodLoading, error: prodError } = useProducts(slug, filters);

  // Filter by subcategory if specified
  const filteredProducts = useMemo(() => {
    let result = products;
    if (subSlug) {
      result = result.filter((p) => p.subcategorySlug === subSlug);
    }
    return result;
  }, [products, subSlug]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const allColors = useMemo(() => {
    const colorSet = new Set<string>();
    products.forEach((p) => p.colors.forEach((c) => colorSet.add(c.name)));
    return Array.from(colorSet);
  }, [products]);

  const allTypes = useMemo(() => {
    if (!category) return [];
    return category.children;
  }, [category]);

  if (catLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-16">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-4 w-96 mb-8" />
        <Skeleton className="h-64 w-full mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5]" />
          ))}
        </div>
      </div>
    );
  }

  if (catError || !category) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-16">
        <EmptyState
          title="Category not found"
          description="The category you're looking for doesn't exist or has been removed."
          action={<Link to="/"><Button>Back to Home</Button></Link>}
        />
      </div>
    );
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-xs text-muted">
          <li><Link to="/" className="hover:text-ink transition-colors">Home</Link></li>
          <li><span className="text-border">/</span></li>
          <li className="text-ink font-medium">{category.name}</li>
          {subSlug && (
            <>
              <li><span className="text-border">/</span></li>
              <li className="text-ink font-medium">
                {category.children.find((c) => c.slug === subSlug)?.name}
              </li>
            </>
          )}
        </ol>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl lg:text-5xl font-light text-ink">{category.name}</h1>
        <p className="text-muted mt-2 max-w-lg">{category.description}</p>
      </div>

      {/* Banner */}
      <div className="relative aspect-[3/1] md:aspect-[4/1] rounded-[var(--radius-card)] overflow-hidden border border-border mb-8" style={{ backgroundColor: category.tint }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="font-serif text-2xl lg:text-4xl text-ink/20">{category.name}</p>
            <p className="text-xs text-muted mt-2 font-mono">Category Banner — Placeholder</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">{filteredProducts.length} products</span>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-[var(--radius-sm)] hover:bg-ink/5 transition-colors lg:hidden"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
            Filters
          </button>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-xs text-muted hidden sm:block">Sort by</label>
          <select
            id="sort"
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
            className="px-3 py-2 text-sm border border-border rounded-[var(--radius-sm)] bg-surface focus:outline-none focus:ring-2 focus:ring-vermilion/30"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        {/* Filters Sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="space-y-6 sticky top-24">
            {/* Subcategory filter */}
            {allTypes.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Type</h3>
                <div className="space-y-2">
                  {allTypes.map((type) => (
                    <label key={type.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.productTypes?.includes(type.slug) || false}
                        onChange={(e) => {
                          const current = filters.productTypes || [];
                          setFilters({
                            ...filters,
                            productTypes: e.target.checked
                              ? [...current, type.slug]
                              : current.filter((t) => t !== type.slug),
                          });
                        }}
                        className="w-4 h-4 rounded border-border text-vermilion focus:ring-vermilion/30"
                      />
                      <span className="text-sm text-muted group-hover:text-ink transition-colors">
                        {type.name}
                      </span>
                      <span className="text-xs text-muted-light ml-auto">({type.productCount})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Color filter */}
            <div>
              <h3 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {allColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      const current = filters.colors || [];
                      setFilters({
                        ...filters,
                        colors: current.includes(color.toLowerCase())
                          ? current.filter((c) => c !== color.toLowerCase())
                          : [...current, color.toLowerCase()],
                      });
                    }}
                    className={`px-2 py-1 text-xs border rounded-full transition-colors ${
                      filters.colors?.includes(color.toLowerCase())
                        ? 'border-vermilion text-vermilion bg-vermilion/5'
                        : 'border-border text-muted hover:border-ink/30'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Price filter */}
            <div>
              <h3 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Price</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange?.[0] || ''}
                  onChange={(e) => setFilters({ ...filters, priceRange: [Number(e.target.value) || 0, filters.priceRange?.[1] || 200] })}
                  className="w-20 px-2 py-1.5 text-sm border border-border rounded-[var(--radius-sm)] focus:outline-none focus:ring-2 focus:ring-vermilion/30"
                />
                <span className="text-muted">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange?.[1] || ''}
                  onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange?.[0] || 0, Number(e.target.value) || 200] })}
                  className="w-20 px-2 py-1.5 text-sm border border-border rounded-[var(--radius-sm)] focus:outline-none focus:ring-2 focus:ring-vermilion/30"
                />
              </div>
            </div>

            {/* Clear filters */}
            {(filters.colors?.length || filters.productTypes?.length) && (
              <button
                onClick={() => setFilters({ sortBy: 'featured', priceRange: [0, 200], colors: [], productTypes: [] })}
                className="text-xs text-vermilion hover:text-vermilion-dark transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* Product Grid */}
        <div>
          {prodLoading ? (
            <ProductGrid products={[]} loading />
          ) : prodError ? (
            <EmptyState
              title="Something went wrong"
              description="We couldn't load the products. Please try again."
              action={<Button onClick={() => window.location.reload()}>Retry</Button>}
            />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try adjusting your filters or browse a different category."
              action={
                <Button variant="ghost" onClick={() => setFilters({ sortBy: 'featured', priceRange: [0, 200], colors: [], productTypes: [] })}>
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <>
              <ProductGrid products={displayedProducts} />
              {hasMore && (
                <div className="text-center mt-10">
                  <Button variant="ghost" onClick={() => setVisibleCount((c) => c + 12)}>
                    Load More ({filteredProducts.length - visibleCount} remaining)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
