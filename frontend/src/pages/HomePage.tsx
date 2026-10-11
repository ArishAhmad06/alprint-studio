import { Link } from 'react-router-dom';
import { Button, CropMarks, RegistrationDivider, PantoneChip } from '../components/ui';
import { ProductGrid } from '../components/product/ProductCard';
import { useFeaturedProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';

export default function HomePage() {
  const { data: featured, loading: featuredLoading } = useFeaturedProducts();
  const { data: categories } = useCategories();

  return (
    <main>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text */}
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-2 mb-6">
                <PantoneChip color="#E8451E" label="PMS 172C" />
                <span className="text-xs font-mono text-muted tracking-wider uppercase">Est. 2026</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.1] text-ink">
                Your Ideas.{' '}
                <span className="italic text-vermilion">Your Style.</span>{' '}
                Your Print.
              </h1>
              <p className="mt-6 text-base lg:text-lg text-muted max-w-lg leading-relaxed">
                Create personalized products that feel uniquely yours. Discover designs you love or bring your own ideas to life.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link to="/customize">
                  <Button size="lg">Create Your Own</Button>
                </Link>
                <Link to="/category/t-shirts">
                  <Button variant="ghost" size="lg">Explore Collection</Button>
                </Link>
              </div>
            </div>

            {/* Hero composition */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative crop-mark p-4 lg:p-8">
                <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-[var(--radius-card)] overflow-hidden border border-border bg-[#E8E4E0]">
                  <img
                    src="https://image.qwenlm.ai/generated-images/d1fb3fee-acdc-461e-b41d-809854b53592/_result.png"
                    alt="Product collection — t-shirt, hoodie, and mug arranged on warm paper background"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-3 left-3 text-[9px] font-mono text-white/60 bg-ink/40 px-2 py-0.5 rounded">
                    HERO — Product Collection
                  </span>
                </div>
                {/* Halftone accent */}
                <div className="absolute -top-4 -right-4 w-24 h-24 halftone-bg rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SHOP BY CATEGORY ========== */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-mono text-muted tracking-wider uppercase">Browse</span>
            <h2 className="font-serif text-3xl lg:text-4xl font-light text-ink mt-1">Shop by Category</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group relative aspect-square rounded-[var(--radius-card)] border border-border overflow-hidden transition-all duration-300 hover:shadow-lift hover:-translate-y-1"
              style={{ backgroundColor: cat.tint }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 bg-white/80 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <CategoryIcon slug={cat.slug} />
                </div>
                <h3 className="font-medium text-sm text-ink text-center">{cat.name}</h3>
                <span className="text-[10px] text-muted mt-1">{cat.children.length} styles</span>
              </div>
              <CropMarks />
            </Link>
          ))}
        </div>
      </section>

      <RegistrationDivider className="max-w-[1440px] mx-auto px-4 lg:px-8" />

      {/* ========== FEATURED PRODUCTS ========== */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-mono text-muted tracking-wider uppercase">Curated</span>
            <h2 className="font-serif text-3xl lg:text-4xl font-light text-ink mt-1">Featured Products</h2>
          </div>
          <Link to="/category/t-shirts" className="text-sm text-vermilion hover:text-vermilion-dark transition-colors hidden sm:block">
            View all →
          </Link>
        </div>
        <ProductGrid products={featured} loading={featuredLoading} />
      </section>

      {/* ========== DESIGN INSPIRATION ========== */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-16 lg:py-24">
          <div className="mb-12">
            <span className="text-xs font-mono text-muted tracking-wider uppercase">Inspiration</span>
            <h2 className="font-serif text-3xl lg:text-4xl font-light text-ink mt-1">Design Ideas</h2>
          </div>
          {/* Asymmetric editorial grid */}
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            {/* Large feature */}
            <div className="col-span-12 md:col-span-7 relative aspect-[16/10] bg-[#F0E8E0] rounded-[var(--radius-card)] overflow-hidden border border-border group">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-40 h-48 bg-white rounded-lg shadow-soft mx-auto flex items-center justify-center">
                    <span className="font-serif text-2xl text-ink/20">Typography</span>
                  </div>
                  <p className="mt-4 text-sm font-medium text-ink">Minimal Typography Tees</p>
                  <p className="text-xs text-muted mt-1">Clean type on premium cotton</p>
                </div>
              </div>
              <CropMarks />
            </div>
            {/* Two stacked */}
            <div className="col-span-12 md:col-span-5 grid grid-rows-2 gap-4">
              <div className="relative aspect-[16/9] md:aspect-auto bg-[#E8E4E0] rounded-[var(--radius-card)] overflow-hidden border border-border">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-24 bg-white rounded-lg shadow-soft mx-auto flex items-center justify-center">
                      <span className="text-xs text-ink/20">Photo</span>
                    </div>
                    <p className="mt-2 text-xs font-medium text-ink">Photo Mugs</p>
                  </div>
                </div>
              </div>
              <div className="relative aspect-[16/9] md:aspect-auto bg-[#E0E4E8] rounded-[var(--radius-card)] overflow-hidden border border-border">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-28 bg-white rounded-lg shadow-soft mx-auto flex items-center justify-center">
                      <span className="text-xs text-ink/20">Graphic</span>
                    </div>
                    <p className="mt-2 text-xs font-medium text-ink">Graphic Hoodies</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Bottom row */}
            <div className="col-span-6 md:col-span-4 relative aspect-square bg-[#E8E8E0] rounded-[var(--radius-card)] overflow-hidden border border-border">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-lg shadow-soft mx-auto flex items-center justify-center">
                    <span className="text-[10px] text-ink/20">Gift</span>
                  </div>
                  <p className="mt-2 text-xs font-medium text-ink">Personalized Gifts</p>
                </div>
              </div>
            </div>
            <div className="col-span-6 md:col-span-4 relative aspect-square bg-[#E4E0E8] rounded-[var(--radius-card)] overflow-hidden border border-border">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white rounded-full shadow-soft mx-auto flex items-center justify-center">
                    <span className="text-[10px] text-ink/20">Name</span>
                  </div>
                  <p className="mt-2 text-xs font-medium text-ink">Name Keychains</p>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-4 relative aspect-square bg-[#F0E8E0] rounded-[var(--radius-card)] overflow-hidden border border-border">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Link to="/customize" className="block">
                    <div className="w-16 h-16 bg-vermilion rounded-lg shadow-soft mx-auto flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </div>
                    <p className="mt-2 text-xs font-medium text-vermilion">Start Creating</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-12">
          <span className="text-xs font-mono text-muted tracking-wider uppercase">Process</span>
          <h2 className="font-serif text-3xl lg:text-4xl font-light text-ink mt-1">How It Works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {[
            {
              step: '01',
              title: 'Choose Your Product',
              description: 'Browse our collection of premium blanks — tees, hoodies, mugs, bottles, and more.',
              preview: (
                <div className="w-full aspect-[4/3] bg-paper rounded-[var(--radius-sm)] border border-border p-4 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-2 w-full max-w-[200px]">
                    {['Tee', 'Hoodie', 'Mug', 'Bottle', 'Frame', 'Cap'].map((item) => (
                      <div key={item} className="aspect-square bg-surface rounded border border-border flex items-center justify-center">
                        <span className="text-[8px] text-muted">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            },
            {
              step: '02',
              title: 'Personalize It',
              description: 'Add your text, upload images, pick colors, and arrange your design.',
              preview: (
                <div className="w-full aspect-[4/3] bg-paper rounded-[var(--radius-sm)] border border-border p-4 flex flex-col items-center justify-center gap-2">
                  <div className="w-full max-w-[180px] aspect-[3/4] bg-white rounded border border-border flex items-center justify-center">
                    <span className="font-serif text-lg text-vermilion italic">Your Text</span>
                  </div>
                  <div className="flex gap-1">
                    {['#1C1B1A', '#E8451E', '#2C3E50', '#8B9E8B'].map((c) => (
                      <div key={c} className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              ),
            },
            {
              step: '03',
              title: 'Preview & Order',
              description: 'Review your creation, adjust if needed, and place your order.',
              preview: (
                <div className="w-full aspect-[4/3] bg-paper rounded-[var(--radius-sm)] border border-border p-4 flex flex-col items-center justify-center gap-3">
                  <div className="w-full max-w-[180px] aspect-[3/4] bg-white rounded border border-border flex items-center justify-center relative">
                    <span className="font-serif text-sm text-ink/40">Final Preview</span>
                    <div className="absolute top-1 right-1 w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                  </div>
                  <div className="w-full max-w-[180px] px-3 py-2 bg-vermilion text-white text-[10px] font-medium rounded text-center">
                    Add to Cart — $24.99
                  </div>
                </div>
              ),
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mb-6">{item.preview}</div>
              <span className="text-xs font-mono text-vermilion">{item.step}</span>
              <h3 className="font-serif text-xl text-ink mt-2">{item.title}</h3>
              <p className="text-sm text-muted mt-2 max-w-xs mx-auto">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <RegistrationDivider className="max-w-[1440px] mx-auto px-4 lg:px-8" />

      {/* ========== BRAND STORY ========== */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-mono text-muted tracking-wider uppercase">Our Story</span>
            <h2 className="font-serif text-3xl lg:text-4xl font-light text-ink mt-2 leading-tight">
              Printing is personal.{' '}
              <span className="italic">Your products should be too.</span>
            </h2>
            <div className="mt-6 space-y-4 text-muted text-sm leading-relaxed">
              <p>
                We started Alprint because we believed personalized products shouldn't feel cheap or generic. Every item we make is printed with care — on premium blanks, with archival-quality inks, and finished by hand.
              </p>
              <p>
                Whether it's a gift for someone special, merch for your community, or a one-of-one piece just for you — we give you the tools and the materials to make something that matters.
              </p>
              <p>
                No minimums. No compromises. Just your ideas, brought to life.
              </p>
            </div>
            <Link to="/customize" className="inline-block mt-8">
              <Button>Start Creating</Button>
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-square bg-[#E8E4E0] rounded-[var(--radius-card)] border border-border flex items-center justify-center relative overflow-hidden">
              <div className="text-center">
                <div className="w-32 h-32 bg-white/80 rounded-full mx-auto flex items-center justify-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-ink/30">
                    <path d="M12 19l7-7 3 3-7 7-3-3z" />
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                    <path d="M2 2l7.586 7.586" />
                    <circle cx="11" cy="11" r="2" />
                  </svg>
                </div>
                <p className="mt-4 text-xs text-muted font-mono">Brand image placeholder</p>
              </div>
              <CropMarks />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 halftone-bg rounded-full" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Simple category icons (SVG)
function CategoryIcon({ slug }: { slug: string }) {
  const icons: Record<string, JSX.Element> = {
    't-shirts': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink/60">
        <path d="M6 3h12l3 4-3 1v13H6V8L3 7l3-4z" />
        <path d="M9 3c0 1.7 1.3 3 3 3s3-1.3 3-3" />
      </svg>
    ),
    'hoodies': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink/60">
        <path d="M6 4h12l4 5-3 1v11H5V10l-3-1 4-5z" />
        <path d="M9 4c0 1.7 1.3 3 3 3s3-1.3 3-3" />
        <path d="M10 11h4v4h-4z" />
      </svg>
    ),
    'mugs': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink/60">
        <rect x="3" y="5" width="14" height="14" rx="2" />
        <path d="M17 9h3a2 2 0 012 2v2a2 2 0 01-2 2h-3" />
      </svg>
    ),
    'bottles': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink/60">
        <path d="M9 2h6v3l2 3v12a2 2 0 01-2 2H9a2 2 0 01-2-2V8l2-3V2z" />
        <path d="M9 2h6" />
      </svg>
    ),
    'photo-gifts': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink/60">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
    'accessories': (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink/60">
        <path d="M12 2L8 6h8l-4-4z" />
        <circle cx="12" cy="14" r="8" />
        <path d="M12 10v4l2 2" />
      </svg>
    ),
  };
  return icons[slug] || icons['t-shirts'];
}
