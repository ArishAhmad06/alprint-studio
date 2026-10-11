import React from 'react';

// ============================================
// CropMark — Decorative corner marks
// ============================================
export function CropMarks({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
      <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-ink/20" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-ink/20" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-ink/20" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-ink/20" />
    </div>
  );
}

// ============================================
// Button
// ============================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-[var(--radius-card)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermilion disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-vermilion text-white hover:bg-vermilion-dark active:scale-[0.98]',
    secondary: 'bg-ink text-white hover:bg-ink/90 active:scale-[0.98]',
    ghost: 'bg-transparent text-ink border border-border hover:bg-ink/5',
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  );
}

// ============================================
// ColorSwatch — Pantone-style color selector
// ============================================
interface ColorSwatchProps {
  color: { id: string; name: string; hex: string; inStock: boolean };
  selected?: boolean;
  onSelect?: () => void;
  size?: 'sm' | 'md';
}

export function ColorSwatch({ color, selected = false, onSelect, size = 'md' }: ColorSwatchProps) {
  const sizeClasses = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8';

  return (
    <button
      onClick={onSelect}
      disabled={!color.inStock}
      title={`${color.name}${!color.inStock ? ' (Out of stock)' : ''}`}
      aria-label={`Select ${color.name}${selected ? ' (selected)' : ''}`}
      className={`
        relative ${sizeClasses} rounded-full transition-all duration-200
        ${selected ? 'ring-2 ring-vermilion ring-offset-2 ring-offset-paper' : 'ring-1 ring-border hover:ring-ink/30'}
        ${!color.inStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}
      `}
      style={{ backgroundColor: color.hex }}
    >
      {!color.inStock && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="block w-full h-[1px] bg-ink/40 rotate-45" />
        </span>
      )}
    </button>
  );
}

// ============================================
// PantoneChip — Decorative Pantone-style label
// ============================================
export function PantoneChip({ color, label }: { color: string; label: string }) {
  return (
    <div className="inline-flex flex-col items-center" aria-hidden="true">
      <div
        className="w-8 h-10 rounded-sm border border-border"
        style={{ backgroundColor: color }}
      />
      <span className="text-[8px] font-mono text-muted mt-0.5">{label}</span>
    </div>
  );
}

// ============================================
// Badge
// ============================================
export function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'sale' | 'new' }) {
  const variants = {
    default: 'bg-ink/5 text-ink',
    sale: 'bg-vermilion/10 text-vermilion',
    new: 'bg-ink text-white',
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${variants[variant]}`}>
      {children}
    </span>
  );
}

// ============================================
// Registration Divider
// ============================================
export function RegistrationDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <div className="flex-1 h-px bg-border" />
      <div className="relative w-3 h-3">
        <div className="absolute inset-0 border border-ink/20 rounded-full" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-ink/20" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-ink/20" />
      </div>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

// ============================================
// Skeleton Loader
// ============================================
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-border-light rounded-[var(--radius-sm)] ${className}`} />
  );
}

// ============================================
// Empty State
// ============================================
export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-border-light flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="font-serif text-xl text-ink mb-2">{title}</h3>
      <p className="text-muted text-sm max-w-sm mx-auto mb-6">{description}</p>
      {action}
    </div>
  );
}
