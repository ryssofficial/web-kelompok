import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Pages/LandingPages';
import LoginPage from './Pages/LoginPage';
import { JadwalPage } from "./Pages/JadwalPage";
import DashboardPage from './Pages/DashboardPage'; // Import file tunggal tadi

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/jadwal" element={<JadwalPage />} />

                {/* Route Dinamis: Parameter :role bisa diisi 'guru' atau 'siswa' */}
                <Route path="/:role/dashboard" element={<DashboardPage />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}