import React, { useEffect, useState } from 'react';
import {BASE_URL} from "./ApiHttp";

interface BackendStatus {
    status: string;
    framework: string;
    java: string;
}

export default function ApiTest() {
    const [data, setData] = useState<BackendStatus | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        fetch(`${BASE_URL}/status`)
            .then((response) => {
                if (!response.ok) throw new Error('Błąd sieci');
                return response.json();
            })
            .then((data: BackendStatus) => setData(data))
            .catch((err) => setError(err.message));
    }, []);

    if (error) return <p style={{ color: 'red' }}>Błąd: {error}</p>;
    if (!data) return <p>Ładowanie danych...</p>;

    return (
        <div style={{ background: '#333', padding: '10px', borderRadius: '5px', fontSize: '16px' }}>
            <p>Status: {data.status} | Backend: {data.framework} (Java {data.java})</p>
        </div>
    );
}