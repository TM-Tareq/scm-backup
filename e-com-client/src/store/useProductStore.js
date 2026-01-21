import { create } from 'zustand';
import api from '../config/api';

const useProductStore = create((set) => ({
    products: [],
    loading: false,
    error: null,

    fetchProducts: async () => {
        set({ loading: true });
        try {
            const res = await api.get('/products');
            set({ products: res.data, loading: false });
        } catch (error) {
            console.error(error);
            set({ error: error.message, loading: false });
        }
    },

    getMinPrice: () => {
        // Helper if needed
        return 0;
    },
    getMaxPrice: () => {
        // Helper if needed
        return 10000;
    }
}));

export default useProductStore;
