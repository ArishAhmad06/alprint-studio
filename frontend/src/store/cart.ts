// ============================================
// Alprint — Cart Store (Zustand + localStorage)
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CartState } from '../types';

let idCounter = 0;
function generateId(): string {
  return `cart-${Date.now()}-${++idCounter}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        // Check if same product + color + size + design already in cart
        const existingIndex = items.findIndex(
          (i) =>
            i.productId === item.productId &&
            i.color.id === item.color.id &&
            i.size.value === item.size.value &&
            JSON.stringify(i.design) === JSON.stringify(item.design)
        );

        if (existingIndex >= 0) {
          const updated = [...items];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + item.quantity,
          };
          set({ items: updated });
        } else {
          set({ items: [...items, { ...item, id: generateId() }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    {
      name: 'alprint-cart',
    }
  )
);
