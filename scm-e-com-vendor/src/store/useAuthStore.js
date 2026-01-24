import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true,

    checkAuth: async () => {
        set({ loading: true });
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                set({ user: null, isAuthenticated: false, loading: false });
                return;
            }

            // We use the same /auth/me endpoint but we check role in component usually
            const res = await axios.get(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Ideally fetch vendor status too, but for now user role is enough for initial check
            // We might need to fetch vendor status here to block routes
            if (res.data.user.role === 'vendor') {
                // Fetch vendor details to get status
                try {
                    const vendorRes = await axios.get(`${API_URL}/vendor/status`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const vendorStatus = vendorRes.data.status;
                    set({
                        user: { ...res.data.user, vendorStatus },
                        isAuthenticated: true,
                        loading: false
                    });
                } catch (vErr) {
                    // If vendor profile doesn't exist yet (e.g. step 2 not done), status is 'none'
                    set({
                        user: { ...res.data.user, vendorStatus: 'none' },
                        isAuthenticated: true,
                        loading: false
                    });
                }
            } else {
                // If user is customer/admin, they shouldn't belong here, but for now we let them stay logged in
                // or we can logout functionality
                set({ user: res.data.user, isAuthenticated: true, loading: false });
            }
        } catch (error) {
            set({ user: null, isAuthenticated: false, loading: false });
            localStorage.removeItem('token');
        }
    },

    register: async (formData) => {
        set({ loading: true });
        try {
            // Register as vendor
            const res = await axios.post(`${API_URL}/auth/register`, { ...formData, role: 'vendor' });

            // After register, we might need to create profile
            const token = res.data.token;
            localStorage.setItem('token', token);

            set({ user: res.data.user, isAuthenticated: true, loading: false });
            toast.success('Registration successful! Please setup your store.');

            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            set({ loading: false });
            return false;
        }
    },

    login: async (formData) => {
        set({ loading: true });
        try {
            const res = await axios.post(`${API_URL}/auth/login`, formData);
            if (res.data.user.role !== 'vendor') {
                toast.error('Access denied. Vendor account required.');
                set({ loading: false });
                return false;
            }

            localStorage.setItem('token', res.data.token);
            set({ user: res.data.user, isAuthenticated: true, loading: false });
            toast.success('Welcome back!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            set({ loading: false });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
        toast.success('Logged out');
    },

    createStoreProfile: async (storeData) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/vendor/register`, {
                store_name: storeData.storeName,
                store_description: storeData.description,
                address: storeData.address
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Store profile created!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create store');
            return false;
        }
    },
    createStore: async (storeData) => {
        return useAuthStore.getState().createStoreProfile(storeData);
    }
}));

export default useAuthStore;
