import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../utils/stores/authStore";

const PrivateRoute = () => {
    const { isAuthenticated } = useAuthStore();

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
