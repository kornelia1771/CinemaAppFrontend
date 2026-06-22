import {
    devAdminEmail, devAdminPassword, devUserEmail, devUserPassword,
} from '../config/devData';
import {AuthApi} from "../api/AuthApi";

export const decodeJWT = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
    }
};

export const handleSignIn = async (
    email: string,
    password: string,
    isFormValid: boolean,
    setLoading: (loading: boolean) => void,
    setShowValidationError: (show: boolean) => void,
    setApiError: (message: string | null) => void,
    navigate: (path: string) => void
) => {
    if (!isFormValid) {
        setShowValidationError(true);
        return;
    }

    setLoading(true);
    setApiError(null);
    setShowValidationError(false);

    try {
        const response = await AuthApi.login({email, password});

        localStorage.setItem("token", response.token);
        const decodedClaims = decodeJWT(response.token);

        if (decodedClaims) {
            console.log(`First Name: ${decodedClaims.firstName}`);
            console.log(`Last Name: ${decodedClaims.lastName}`);
            console.log(`Email (Subject): ${decodedClaims.sub}`);
            console.log("All decoded JWT Claims:", decodedClaims);
        }

        if (decodedClaims && decodedClaims.roles) {
            const roles: string[] = decodedClaims.roles;

            if (roles.includes("ADMIN")) {
                navigate("/adminHome");
            } else {
                navigate("/home");
            }
        } else {
            navigate("/home");
        }

    } catch (error: any) {
        setApiError(error.message || "Invalid email or password setup.");
    } finally {
        setLoading(false);
    }
};

export const handleAdminSignIn = async (
    setLoading: (loading: boolean) => void,
    setApiError: (message: string | null) => void,
    navigate: (path: string) => void
) => {
    await handleSignIn(devAdminEmail, devAdminPassword, true, setLoading, () => {
    }, setApiError, navigate);
};

export const handleDevUserSignIn = async (
    setLoading: (loading: boolean) => void,
    setApiError: (message: string | null) => void,
    navigate: (path: string) => void
) => {
    await handleSignIn(devUserEmail, devUserPassword, true, setLoading, () => {
    }, setApiError, navigate);
};

export const capitalizeFirst = (s: string) => {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
};