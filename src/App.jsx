import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Pages/LandingPages';
import LoginPage from './Pages/LoginPage';
import DashboardPage from './Pages/DashboardPage'; // Import file tunggal tadi
import NotifikasiPage from './Pages/NotifikasiPage';
import ProfileData from './Pages/ProfileData';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Route Dinamis: Parameter :role bisa diisi 'guru' atau 'siswa' */}
                <Route path="/:role/dashboard" element={<DashboardPage />} />
                <Route path="/:role/notifikasi" element={<NotifikasiPage />} />
                <Route path="/:role/profil" element={<ProfileData />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}