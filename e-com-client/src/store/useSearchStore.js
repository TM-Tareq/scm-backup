// src/store/useSearchStore.js
import { create } from 'zustand';

const useSearchStore = create((set, get) => ({
  searchQuery: '',
  selectedCategory: 'All',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  clearSearch: () => set({ searchQuery: '', selectedCategory: 'All' }),

  syncFromUrl: (location) => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    const cat = params.get('cat') || 'All';
    set({ searchQuery: q, selectedCategory: cat });
  },

  // For Updating URL
  updateUrl: (navigate) => {
    const { searchQuery, selectedCategory } = get();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedCategory !== 'All') params.set('cat', selectedCategory);

    const newUrl = params.toString() ? `/?${params.toString()}` : '/';
    navigate(newUrl, { replace: true });
  },
}));

export default useSearchStore;