import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import LandingPage from './Pages/LandingPages';
import LoginPage from './Pages/LoginPage';
import DashboardPage from './Pages/DashboardPage';
import NotifikasiPage from './Pages/NotifikasiPage';
import JadwalPage from './Pages/JadwalPage';

// ✅ Wrapper kecil — ambil :role dari URL, kapitalisasi, kirim ke JadwalPage
const JadwalPageWrapper = () => {
    const { role } = useParams();                                           // 'guru' atau 'siswa'
    const roleProp = role.charAt(0).toUpperCase() + role.slice(1);          // → 'Guru' atau 'Siswa'
    return <JadwalPage role={roleProp} />;
};

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/:role/dashboard"         element={<DashboardPage />} />
                <Route path="/:role/notifikasi"        element={<NotifikasiPage />} />

                {/* ✅ Dua route jadwal — sesuai path yang dibuat otomatis oleh sidebar */}
                <Route path="/:role/jadwal-mengajar"  element={<JadwalPageWrapper />} />
                <Route path="/:role/jadwal-pelajaran" element={<JadwalPageWrapper />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}