import { create } from "zustand";

const useAuthStore = create((set) => ({
    isAuthenticated: false,
    username: "",
    accessToken: null,
    refreshToken: null,
    login: (accessToken, refreshToken, username) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("username", username);
        set({ accessToken, refreshToken, username, isAuthenticated: true });
    },
    logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");
        set({ accessToken: null, refreshToken: null, username: null, isAuthenticated: false });
    },
}));

export default useAuthStore;
