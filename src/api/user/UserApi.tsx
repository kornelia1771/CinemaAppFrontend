import {BASE_URL} from "../ApiHttp";

export const getUserData = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/user/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) throw new Error('Failed to get data');
    return response.json();
};

export const updateUserData = async (firstName: string, lastName: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/user/profile`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName })
    });

    if (!response.ok) throw new Error('Failed to update data');
    return response.json();
};