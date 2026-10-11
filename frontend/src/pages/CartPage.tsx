import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cart';
import { Button, EmptyState } from '../components/ui';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();

  const shipping = subtotal() >= 50 ? 0 : 5.99;
  const tax = subtotal() * 0.08;
  const total = subtotal() + shipping + tax;

  if (items.length === 0) {
    return (
      <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-16">
        <EmptyState
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Browse our collection and find something you love."
          action={
            <Link to="/category/t-shirts">
              <Button>Start Shopping</Button>
            </Link>
          }
        />
      </main>
    );
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
      <h1 className="font-serif text-3xl lg:text-4xl font-light text-ink mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
        {/* Line Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 bg-surface rounded-[var(--radius-card)] border border-border"
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 lg:w-24 lg:h-24 flex-shrink-0 bg-paper rounded-[var(--radius-sm)] overflow-hidden border border-border">
                <img
                  src={item.color.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="font-medium text-sm text-ink hover:text-vermilion transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted">{item.color.name}</span>
                      <span className="text-border">•</span>
                      <span className="text-xs text-muted">{item.size.label}</span>
                    </div>
                    {item.design && (
                      <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 bg-vermilion/10 text-vermilion rounded">
                        Custom Design
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-muted hover:text-ink transition-colors flex-shrink-0"
                    aria-label="Remove item"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-end justify-between mt-3">
                  {/* Quantity */}
                  <div className="flex items-center border border-border rounded-[var(--radius-sm)]">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 text-sm text-ink hover:bg-ink/5"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 text-sm font-medium border-x border-border">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 text-sm text-ink hover:bg-ink/5"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold text-sm text-ink">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="bg-surface rounded-[var(--radius-card)] border border-border p-6">
            <h2 className="font-serif text-lg text-ink mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="text-ink">${subtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span className="text-ink">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Tax (est.)</span>
                <span className="text-ink">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-semibold">
                <span className="text-ink">Total</span>
                <span className="text-ink">${total.toFixed(2)}</span>
              </div>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-muted mt-3">
                Add ${(50 - subtotal()).toFixed(2)} more for free shipping.
              </p>
            )}
            <Button size="lg" className="w-full mt-6">
              Proceed to Checkout
            </Button>
            <p className="text-[10px] text-muted text-center mt-2">
              Checkout is a placeholder — payment integration pending.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
