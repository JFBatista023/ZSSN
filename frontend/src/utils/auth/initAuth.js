import useAuthStore from "../stores/authStore";

const InitAuth = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const username = localStorage.getItem("username");


    if (accessToken && refreshToken) {
        return useAuthStore.getState().login(accessToken, refreshToken, username);
    }

    return null;
};

export { InitAuth };
