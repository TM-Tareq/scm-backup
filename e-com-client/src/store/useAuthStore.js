import api from '../config/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            loading: true,

            login: (userData, token) => set({ user: userData, token, loading: false }),
            logout: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                set({ user: null, token: null, loading: false })
            },
            updateProfile: async (updateData) => {
                try {
                    const response = await api.put('/auth/profile-update', updateData);
                    set({ user: response.data.user });
                } catch (err) {
                    console.error('Update profile failed', err);
                    throw err;
                }
            },

            // Authentication check in the first load
            checkAuth: async () => {
                const token = localStorage.getItem('token');
                if (!token) {
                    set({ loading: false });
                    return;
                }

                try {
                    const response = await api.get('/auth/me');
                    set({ user: response.data.user, token, loading: false });
                } catch (err) {
                    console.error(err);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'auth-storage', // save at localstorage
            partialize: (state) => ({ user: state.user, token: state.token })
        }
    )
);

export default useAuthStore;
