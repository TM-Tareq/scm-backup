import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set)=> ({
            user: null,
            token: null,

            login: (userData, token)=> set({user: userData, token}),
            logout: ()=> set({ user: null, token: null}),
            updateProfile: (updateUser)=> set((state)=> ({user: {...state.user, ...updateUser} })),
        }),
        {
            name: 'auth-storage', // save at localstorage
        }
    )
);

export default useAuthStore;
