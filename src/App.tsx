import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ApiTest from "./api/ApiTest";
import WelcomePage from "./login/WelcomePage";
import RegisterPage from "./login/RegisterPage";
import LoginPage from "./login/LoginPage";
import ConfirmEmailPage from "./login/ConfirmEmailPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Główny ekran startowy z logo Wine 🍷 */}
                <Route path="/" element={<WelcomePage />} />

                {/* Nowy widok rejestracji z dynamicznymi regułami haseł */}
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/confirm-email" element={<ConfirmEmailPage />} />

                {/* Nowy widok logowania w React Web */}
                <Route path="/login" element={<LoginPage />} />



                {/* Poprzednia ścieżka do sprawdzania połączenia ze Spring Bootem */}
                <Route path="/test" element={
                    <div className="App">
                        <header className="App-header">
                            <h2>API Test Panel</h2>
                            <ApiTest />
                        </header>
                    </div>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;