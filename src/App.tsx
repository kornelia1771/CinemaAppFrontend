import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ApiTest from "./api/ApiTest";
import WelcomePage from "./pages/login/WelcomePage";
import RegisterPage from "./pages/login/RegisterPage";
import LoginPage from "./pages/login/LoginPage";
import ConfirmEmailPage from "./pages/login/ConfirmEmailPage";
import HomePage from "./pages/user/HomePage";
import AdminHomePage from "./pages/admin/AdminHomePage";
import ProfilePage from "./pages/user/ProfilePage";
import MovieDetailsPage from "./pages/user/MovieDetailsPage";

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

                <Route path="/home" element={<HomePage />} />
                {/*<Route path="/movie" element={<MovieDetailsPage />} />*/}
                <Route path="/movie/:id" element={<MovieDetailsPage />} />

                <Route path="/profile" element={<ProfilePage />} />

                <Route path="/adminHome" element={<AdminHomePage />} />
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