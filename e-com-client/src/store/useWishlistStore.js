import { create } from 'zustand';
import { persist } from 'zustand/middleware'

const useWishlistStore = create(
    persist(
        (set, get) => ({
            wishlist: [],

            // checking wishlist have or not
            isInWishlist: (productId) => {
                return get().wishlist.some((item)=> item.id === productId);
            },

            // add / remove (toggle)
            toggleWishlist: (product) => {
                set((state) => {
                    const exists = state.wishlist.some((item) => item.id === product.id)
                    if(exists) {
                        // remove it
                        return {
                            wishlist: state.wishlist.filter((item) => item.id !== product.id),
                        };
                    } else {
                        // add this
                        return {
                            wishlist: [...state.wishlist, product],
                        };
                    }
                });
            },

            // remove all if needed
            clearWishlist: ()=> set({wishlist: [] }),

            // how many items into the wishlist
            wishlistCount: () => get().wishlist.length,
        }),
        {
            name: 'wishlist-storage' // localStorage e ei name e save hobe
        }
    )
);

export default useWishlistStore;
