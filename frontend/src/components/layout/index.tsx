import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../../store/cart';
import { useCategories } from '../../hooks/useCategories';

// ============================================
// Announcement Bar
// ============================================
export function AnnouncementBar() {
  // TODO: Make editable from admin panel
  const message = 'Free shipping on orders over $50 • Express delivery available';
  return (
    <div className="bg-ink text-white text-center py-2 px-4 text-xs tracking-wide">
      <p>{message}</p>
    </div>
  );
}

// ============================================
// Navigation
// ============================================
export function Navigation() {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const { data: categories } = useCategories();
  const location = useLocation();

  React.useEffect(() => {
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
  }, [location]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-border">
        <nav className="max-w-[1440px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between" aria-label="Main navigation">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-ink hover:bg-ink/5 rounded-[var(--radius-sm)]"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>

          {/* Wordmark */}
          <Link to="/" className="font-serif text-2xl font-semibold tracking-tight text-ink">
            Alprint
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8">
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button className="text-sm font-medium text-ink hover:text-vermilion transition-colors flex items-center gap-1">
                Shop
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {/* Mega Menu */}
              {megaMenuOpen && categories && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4">
                  <div className="bg-surface rounded-[var(--radius-card)] shadow-modal border border-border p-6 w-[600px] grid grid-cols-3 gap-6">
                    {categories.map((cat) => (
                      <div key={cat.id}>
                        <Link
                          to={`/category/${cat.slug}`}
                          className="block font-serif text-sm font-semibold text-ink mb-2 hover:text-vermilion transition-colors"
                        >
                          {cat.name}
                        </Link>
                        <ul className="space-y-1.5">
                          {cat.children.map((sub) => (
                            <li key={sub.id}>
                              <Link
                                to={`/category/${cat.slug}?sub=${sub.slug}`}
                                className="text-xs text-muted hover:text-ink transition-colors"
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {categories?.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="text-sm font-medium text-ink/70 hover:text-ink transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              to="/customize"
              className="text-sm font-medium text-vermilion hover:text-vermilion-dark transition-colors"
            >
              Create Your Own
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-ink hover:bg-ink/5 rounded-[var(--radius-sm)] transition-colors"
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            {/* Account */}
            <Link
              to="/account"
              className="p-2 text-ink hover:bg-ink/5 rounded-[var(--radius-sm)] transition-colors"
              aria-label="Account"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-ink hover:bg-ink/5 rounded-[var(--radius-sm)] transition-colors"
              aria-label={`Cart (${totalItems} items)`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-vermilion text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </nav>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-border bg-surface px-4 py-4">
            <div className="max-w-xl mx-auto relative">
              <input
                type="search"
                placeholder="Search products..."
                className="w-full px-4 py-3 pl-10 bg-paper border border-border rounded-[var(--radius-card)] text-sm focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion"
                autoFocus
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <MobileDrawer onClose={() => setMobileMenuOpen(false)} categories={categories || []} />
      )}
    </>
  );
}

// ============================================
// Mobile Drawer
// ============================================
function MobileDrawer({ onClose, categories }: { onClose: () => void; categories: { id: string; slug: string; name: string; children: { id: string; slug: string; name: string }[] }[] }) {
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      {/* Drawer */}
      <div className="absolute left-0 top-0 bottom-0 w-[300px] max-w-[85vw] bg-surface shadow-modal overflow-y-auto">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <span className="font-serif text-lg font-semibold">Menu</span>
          <button onClick={onClose} className="p-2 hover:bg-ink/5 rounded-[var(--radius-sm)]" aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-4">
          <Link to="/" className="block py-3 text-sm font-medium text-ink border-b border-border-light">Home</Link>
          {categories.map((cat) => (
            <div key={cat.id} className="border-b border-border-light">
              <div className="flex items-center justify-between py-3">
                <Link to={`/category/${cat.slug}`} className="text-sm font-medium text-ink flex-1">
                  {cat.name}
                </Link>
                <button
                  onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
                  className="p-1 hover:bg-ink/5 rounded"
                  aria-label={`Expand ${cat.name}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${expandedCat === cat.id ? 'rotate-180' : ''}`}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </div>
              {expandedCat === cat.id && (
                <ul className="pl-4 pb-2 space-y-2">
                  {cat.children.map((sub) => (
                    <li key={sub.id}>
                      <Link to={`/category/${cat.slug}?sub=${sub.slug}`} className="text-xs text-muted hover:text-ink block py-1">
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <Link to="/customize" className="block py-3 text-sm font-medium text-vermilion">Create Your Own</Link>
          <Link to="/account" className="block py-3 text-sm font-medium text-ink border-t border-border mt-2">Account</Link>
        </nav>
      </div>
    </div>
  );
}

// ============================================
// Footer
// ============================================
export function Footer() {
  return (
    <footer className="bg-ink text-white/80 mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <Link to="/" className="font-serif text-2xl font-semibold text-white">
              Alprint
            </Link>
            <p className="text-sm text-white/60 mt-3 max-w-xs">
              Print shop, reimagined. Create personalized products that feel uniquely yours.
            </p>
            {/* Newsletter */}
            <div className="mt-6">
              <label htmlFor="footer-email" className="text-xs font-medium text-white/80 block mb-2">
                Stay in the loop
              </label>
              <div className="flex">
                <input
                  id="footer-email"
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-l-[var(--radius-sm)] text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-vermilion"
                />
                <button className="px-4 py-2 bg-vermilion text-white text-sm font-medium rounded-r-[var(--radius-sm)] hover:bg-vermilion-dark transition-colors">
                  Join
                </button>
              </div>
              <p className="text-[10px] text-white/40 mt-1">UI only — newsletter not yet connected.</p>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2.5">
              <li><Link to="/category/t-shirts" className="text-sm hover:text-white transition-colors">T-Shirts</Link></li>
              <li><Link to="/category/hoodies" className="text-sm hover:text-white transition-colors">Hoodies</Link></li>
              <li><Link to="/category/mugs" className="text-sm hover:text-white transition-colors">Mugs</Link></li>
              <li><Link to="/category/bottles" className="text-sm hover:text-white transition-colors">Bottles</Link></li>
              <li><Link to="/category/photo-gifts" className="text-sm hover:text-white transition-colors">Photo Gifts</Link></li>
              <li><Link to="/category/accessories" className="text-sm hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">About</h4>
            <ul className="space-y-2.5">
              <li><span className="text-sm">Our Story</span></li>
              <li><span className="text-sm">How It Works</span></li>
              <li><span className="text-sm">Sustainability</span></li>
              <li><span className="text-sm">Careers</span></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2.5">
              <li><span className="text-sm">Contact Us</span></li>
              <li><span className="text-sm">FAQs</span></li>
              <li><span className="text-sm">Shipping & Returns</span></li>
              <li><span className="text-sm">Size Guide</span></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><span className="text-sm">Privacy Policy</span></li>
              <li><span className="text-sm">Terms of Service</span></li>
              <li><span className="text-sm">Cookie Policy</span></li>
            </ul>
            {/* Social */}
            <div className="flex gap-3 mt-6">
              <a href="#" aria-label="Instagram" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" aria-label="Twitter" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" aria-label="Pinterest" className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">© 2026 Alprint. All rights reserved.</p>
          <p className="text-xs text-white/40">Print shop, reimagined.</p>
        </div>
      </div>
    </footer>
  );
}
