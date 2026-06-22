import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from "./pages/login/WelcomePage";
import RegisterPage from "./pages/login/RegisterPage";
import LoginPage from "./pages/login/LoginPage";
import ConfirmEmailPage from "./pages/login/ConfirmEmailPage";
import HomePage from "./pages/user/HomePage";
import AdminHomePage from "./pages/admin/AdminHomePage";
import ProfilePage from "./pages/user/ProfilePage";
import MovieDetailsPage from "./pages/user/MovieDetailsPage";
import BookingPage from "./pages/user/BookingPage";
import TicketsPage from "./pages/user/TicketsPage";
import AdminHallsPage from "./pages/admin/AdminHallsPage";
import AdminMoviesPage from "./pages/admin/AdminMoviesPage";
import AdminScreeningsPage from "./pages/admin/AdminScreeningsPage";
import AdminTicketsPage from "./pages/admin/AdminTicketsPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<WelcomePage />} />

                {/* Nowy widok rejestracji z dynamicznymi regułami haseł */}
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/confirm-email" element={<ConfirmEmailPage />} />

                {/* Nowy widok logowania w React Web */}
                <Route path="/login" element={<LoginPage />} />

                <Route path="/home" element={<HomePage />} />
                {/*<Route path="/movie" element={<MovieDetailsPage />} />*/}
                <Route path="/movie/:id" element={<MovieDetailsPage />} />
                <Route path="/booking/:movieId" element={<BookingPage />} />
                <Route path="/tickets" element={<TicketsPage />} />

                <Route path="/profile" element={<ProfilePage />} />

                <Route path="/adminHome" element={<AdminHomePage />} />
                <Route path="/adminHalls" element={<AdminHallsPage />} />
                <Route path="/adminMovies" element={<AdminMoviesPage />} />
                <Route path="/admin/screenings/:movieId" element={<AdminScreeningsPage />} />
                <Route path="/adminTickets" element={<AdminTicketsPage />} />
                {/* Poprzednia ścieżka do sprawdzania połączenia ze Spring Bootem */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;