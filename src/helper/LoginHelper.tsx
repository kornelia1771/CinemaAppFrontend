import {
    devAdminEmail, devAdminPassword, devUserEmail, devUserPassword,
    devRegisterPassword, devRegisterName, devRegisterSurname
} from '../config/devData';
import {
    RegistrationErrorTitle,
    EmailAlreadyInUse, WeakPassword, InvalidEmailFormat, RegistrationFailedMessage
} from '../strings/loginStrings';
import {AuthApi} from "../api/AuthApi";

// export const decodeJWT = (token: string) => {
//     try {
//         if (!token) return null;
//
//         const parts = token.split('.');
//         if (parts.length !== 3) {
//             throw new Error('Invalid JWT token structure');
//         }
//
//         const base64Url = parts[1];
//         // Replace URL-safe characters back to standard Base64
//         let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//
//         // Add padding if missing
//         while (base64.length % 4) {
//             base64 += '=';
//         }
//
//         // Decode base64 string to raw binary string
//         const binaryString = atob(base64);
//         const bytes = new Uint8Array(binaryString.length);
//
//         for (let i = 0; i < binaryString.length; i++) {
//             bytes[i] = binaryString.charCodeAt(i);
//         }
//
//         // Properly decode binary bytes as UTF-8 string to support special characters
//         const decodedString = new TextDecoder().decode(bytes);
//         return JSON.parse(decodedString);
//     } catch (error) {
//         console.error('Failed to decode JWT safely:', error);
//         return null;
//     }
// };

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

// export const handleSignIn = async (
//     email: string,
//     password: string,
//     isFormValid: boolean,
//     setLoading: (loading: boolean) => void,
//     setShowValidationError: (show: boolean) => void,
//     navigate: (path: string) => void // Zmiana z typowania nawigacji RN na funkcję webową
// ) => {
//     if (!isFormValid) {
//         setShowValidationError(true);
//         return;
//     }
//
//
// };

export const handleSignIn = async (
    email: string,
    password: string,
    isFormValid: boolean,
    setLoading: (loading: boolean) => void,
    setShowValidationError: (show: boolean) => void,
    setApiError: (message: string | null) => void, // Added hook to forward backend messages to page UI
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
        const response = await AuthApi.login({ email, password });

        // Save token to browser storage
        localStorage.setItem("token", response.token);

        // Decode the JWT to handle role routing based on your Spring Boot claims
        const decodedClaims = decodeJWT(response.token);
        // if (decodedClaims) {
        //     console.log(`User: ${decodedClaims.firstName} ${decodedClaims.lastName} (${decodedClaims.sub})`);
        //     console.log("All decoded JWT Claims:", decodedClaims);
        // }
        if (decodedClaims) {
            console.log(`First Name: ${decodedClaims.firstName}`);
            console.log(`Last Name: ${decodedClaims.lastName}`);
            console.log(`Email (Subject): ${decodedClaims.sub}`);
            console.log("All decoded JWT Claims:", decodedClaims);
        }

        if (decodedClaims && decodedClaims.roles) {
            const roles: string[] = decodedClaims.roles;

            if (roles.includes("ROLE_ADMIN") || roles.includes("ADMIN")) {
                navigate("/adminHome"); // Route matching your admin console path
            } else {
                navigate("/home");
            }
        } else {
            // Default path if claims are missing
            navigate("/home");
        }

    } catch (error: any) {
        // Captures backend messages: "Account is not active...", "Invalid email or password." etc.
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
    await handleSignIn(devAdminEmail, devAdminPassword, true, setLoading, () => {}, setApiError, navigate);
};

export const handleDevUserSignIn = async (
    setLoading: (loading: boolean) => void,
    setApiError: (message: string | null) => void,
    navigate: (path: string) => void
) => {
    await handleSignIn(devUserEmail, devUserPassword, true, setLoading, () => {}, setApiError, navigate);
};

// export const handleAdminSignIn = async (
//     setLoading: (loading: boolean) => void,
//     navigate: (path: string) => void
// ) => {
//     await handleSignIn(devAdminEmail, devAdminPassword, true, setLoading, () => {}, navigate);
// };
//
// export const handleDevUserSignIn = async (
//     setLoading: (loading: boolean) => void,
//     navigate: (path: string) => void
// ) => {
//     await handleSignIn(devUserEmail, devUserPassword, true, setLoading, () => {}, setApiError, navigate);
// };

// export const handleResetPassword = async (
//     email: string,
//     isFormValid: boolean,
//     setLoading: (loading: boolean) => void,
//     setShowValidationError: (show: boolean) => void,
//     navigate: (path: string) => void
// ) => {
//     if (!isFormValid) {
//         setShowValidationError(true);
//         return;
//     }
//
//
// };

export const capitalizeFirst = (s: string) => {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
};

// export const handleSignUp = async (
//     name: string,
//     surname: string,
//     email: string,
//     password: string,
//     isFormValid: boolean,
//     setLoading: (loading: boolean) => void,
//     setTouchedName: (touched: boolean) => void,
//     setTouchedSurname: (touched: boolean) => void,
//     setTouchedEmail: (touched: boolean) => void,
//     setTouchedPassword: (touched: boolean) => void,
//     setTouchedConfirm: (touched: boolean) => void,
//     setShowValidationError: (show: boolean) => void,
//     navigate: (path: string) => void
// ) => {
//     setLoading(true);
//     try {
//         if (!isFormValid) {
//             setTouchedName(true);
//             setTouchedSurname(true);
//             setTouchedEmail(true);
//             setTouchedPassword(true);
//             setTouchedConfirm(true);
//             setShowValidationError(true);
//             setLoading(false);
//             return;
//         }
//
//         const req = { name: capitalizeFirst(name), surname: capitalizeFirst(surname), email, password };
//         // const resp = await apiRegister(req as any);
//
//         // if (resp && resp.token) {
//         //     alert(`${RegistrationSuccessTitle}\n${RegistrationSuccessMessage}`);
//         //     setTimeout(() => {
//         //         navigate('/login');
//         //     }, 1500);
//         // } else {
//         //     const msg = resp && resp.message ? resp.message : RegistrationFailedMessage;
//         //     alert(`${RegistrationErrorTitle}\n${msg}`);
//         // }
//     } catch (err: any) {
//         console.error('Sign up failed:', err.code, err.message);
//         let msg = RegistrationFailedMessage;
//         if (err.code === 'auth/email-already-in-use') msg = EmailAlreadyInUse;
//         else if (err.code === 'auth/weak-password') msg = WeakPassword;
//         else if (err.code === 'auth/invalid-email') msg = InvalidEmailFormat;
//
//         alert(`${RegistrationErrorTitle}\n${msg}`);
//     } finally {
//         setLoading(false);
//     }
// };

// export const handleDevSignUp = async (
//     setName: (name: string) => void,
//     setSurname: (surname: string) => void,
//     setEmail: (email: string) => void,
//     setPassword: (password: string) => void,
//     setConfirm: (confirm: string) => void,
//     setLoading: (loading: boolean) => void,
//     navigate: (path: string) => void
// ) => {
//     const n = Math.floor(Math.random() * 50) + 1;
//     const devEmail = `${n}@wp.pl`;
//
//     setName(devRegisterName);
//     setSurname(devRegisterSurname);
//     setEmail(devEmail);
//     setPassword(devRegisterPassword);
//     setConfirm(devRegisterPassword);
//
//     await handleSignUp(
//         devRegisterName,
//         devRegisterSurname,
//         devEmail,
//         devRegisterPassword,
//         true,
//         setLoading,
//         () => {},
//         () => {},
//         () => {},
//         () => {},
//         () => {},
//         () => {},
//         navigate
//     );
// };