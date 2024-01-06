import { create } from "zustand";

const useAuthStore = create((set) => ({
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    login: (accessToken, refreshToken) => set({ accessToken, refreshToken, isAuthenticated: true }),
    logout: () => set({ accessToken: null, refreshToken: null, isAuthenticated: false }),
}));

export default useAuthStore;
