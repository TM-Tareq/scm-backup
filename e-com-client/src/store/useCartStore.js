import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useAuthStore from './useAuthStore';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [], // [{ product, quantity }] -> initially null

      fetchCart: async ()=> {
        try {
          const token = localStorage.getItem('token')
          if(!token) return;

          const response = await axios.get('http://localhost:5000/api/auth/cart', {
            headers: { Authorization: `Bearer ${token}`},
          });
          set({ cart: response.data.cartItems || [] })
        } catch(err) {
          console.error('Fetch cart failed: ', err);
        }
      },

      addToCart: async (product, quantity = 1) => {
        set((state) => {
          const existing = state.cart.find((item) => item.product.id === product.id);

          if (existing) {
            return {
              cart: state.cart.map(item=> item.product.id === product.id ? {...item, quantity: item.quantity + quantity} : item)
            };
          }

          return { 
            cart: [...state.cart, { product, quantity}] 
          };
        });

        // Saving into backend
        try {
          await axios.post(
            'http://localhost:5000/api/cart/add',
            {productId: product.id, quantity: 1},
            {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
          );
        } catch(err) {
          console.error('Add to cart backend failed', err);
        }
      },

      removeFromCart: async (productId) => {
        set((state)=> {
          const existing = state.cart.find((item)=> item.product.id === productId);
          let updatedCart;

          if(existing && existing.quantity > 1) {
            updatedCart = state.cart.map((item)=>
              item.product.id === productId ? {...item, quantity: item.quantity - 1} : item
            );
          } else {
            updatedCart = state.cart.filter((item)=> item.product.id !== productId);
          }
          return {cart: updatedCart};
        });

        // Updating into backend
        try {
          await axios.post(
            'http://localhost:5000/api/cart/remove',
            {productId},
            {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
          );
        } catch(err) {
          console.err('Remove from cart failed:', err);
        }
      },

      removeItemCompletely: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
      },

      cartCount: () => get().cart.reduce((count, item) => {
  const qty = item?.quantity || 0;
  return count + qty;
}, 0),

      totalPrice: () => {
        return get().cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },

      clearCartOnLogout: ()=> set({cart: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);

// cart clear after logout
useAuthStore.subscribe((state)=> {
  if(!state.user) {
    useCartStore.getState().clearCartOnLogout();
  }
})

export default useCartStore;