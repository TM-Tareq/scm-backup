// src/store/useCartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) => {
        set((state) => {
          const existing = state.cart.find((item) => item.product.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { product, quantity: 1 }] };
        });
      },

      removeFromCart: (productId) => {
        set((state) => {
          const existing = state.cart.find((item) => item.product.id === productId);
          if (existing && existing.quantity > 1) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === productId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              ),
            };
          }
          return { cart: state.cart.filter((item) => item.product.id !== productId) };
        });
      },

      removeItemCompletely: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
      },

      cartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      totalPrice: () => {
        return get().cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;