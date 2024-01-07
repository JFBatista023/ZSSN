import { jwtDecode } from "jwt-decode";

export const tokenIsValid = (token) => {
    try {
        const decodedToken = jwtDecode(token);

        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
            return false;
        }

        return true;
    } catch (error) {
        console.log("Invalid Token");
    }
};
