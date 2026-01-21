import api from '../config/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware'
import useAuthStore from './useAuthStore';


const useWishlistStore = create(
    persist(
        (set, get) => ({
            wishlist: [],

            isInWishlist: (productId) => get().wishlist.some(item => item.product.id === productId),

            fetchWishlist: async () => {
                try {
                    const response = await api.get('/auth/wishlist');
                    // Transform flat database rows to { product: { ... } } format
                    const formattedWishlist = (response.data.wishlist || []).map(item => ({
                        product: {
                            id: item.product_id,
                            name: item.name,
                            price: item.price,
                            image: item.image
                        }
                    }));
                    set({ wishlist: formattedWishlist });
                } catch (err) {
                    console.error('Fetch wishlist failed:', err);
                }
            },

            addToWishlist: async (product) => {

                set((state) => {
                    const existing = state.wishlist.find((item) => item.product.id === product.id);
                    if (existing) return state;

                    return { wishlist: [...state.wishlist, { product }] }
                });

                try {
                    await api.post('/auth/wishlist/add', { productId: product.id });
                } catch (err) {
                    console.error('Add to wishlist backend failed', err);
                }
            },

            removeFromWishlist: async (productId) => {
                set((state) => ({
                    wishlist: state.wishlist.filter((item) => item.product.id !== productId)
                }));

                try {
                    await api.post('/auth/wishlist/remove', { productId });
                } catch (err) {
                    console.error('Remove from wishlist failed', err);
                }
            },

            toggleWishlist: async (product) => {
                const state = get();

                // চেক করো আছে কি না
                const alreadyInWishlist = state.isInWishlist(product.id);

                if (alreadyInWishlist) {
                    // আছে → রিমুভ করো
                    await state.removeFromWishlist(product.id);
                } else {
                    // নেই → অ্যাড করো
                    await state.addToWishlist(product);
                }
            },

            // checking wishlist have or not
            // isInWishlist: (productId) => {
            //     return get().wishlist.some((item)=> item.id === productId);
            // },

            // // add / remove (toggle)
            // toggleWishlist: (product) => {
            //     set((state) => {
            //         const exists = state.wishlist.some((item) => item.id === product.id)
            //         if(exists) {
            //             // remove it
            //             return {
            //                 wishlist: state.wishlist.filter((item) => item.id !== product.id),
            //             };
            //         } else {
            //             // add this
            //             return {
            //                 wishlist: [...state.wishlist, product],
            //             };
            //         }
            //     });
            // },


            // remove all if needed
            clearWishlistOnLogout: () => set({ wishlist: [] }),

            // how many items into the wishlist
            wishlistCount: () => get().wishlist.length,
        }),
        {
            name: 'wishlist-storage' // localStorage e ei name e save hobe
        }
    )
);

useAuthStore.subscribe((state) => {
    if (!state.user) {
        useWishlistStore.getState().clearWishlistOnLogout()
    }
});

export default useWishlistStore;
