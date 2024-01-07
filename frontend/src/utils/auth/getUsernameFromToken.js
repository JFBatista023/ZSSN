import { jwtDecode } from "jwt-decode";

export const getUsernameFromToken = (token) => {
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken["username"];
    } catch (error) {
        console.log("Invalid Token");
    }
};
