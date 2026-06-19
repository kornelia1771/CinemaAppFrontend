import {BASE_URL} from "./ApiHttp";

export const getUserData = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/user/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // TO JEST KLUCZOWE
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) throw new Error('Błąd pobierania danych');
    return response.json();
};

export const updateUserData = async (firstName: string, lastName: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/user/profile`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`, // TO JEST KLUCZOWE
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName })
    });

    if (!response.ok) throw new Error('Błąd aktualizacji danych');
    return response.json();
};