import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import LandingPage from './Pages/LandingPages';
import LoginPage from './Pages/LoginPage';
import DashboardPage from './Pages/DashboardPage';
import NotifikasiPage from './Pages/NotifikasiPage';
import KeuanganPage from './Pages/KeuanganPage';

const KeuanganPageWrapper = () => {
    const {role} = useParams();
    const roleProp = role.charAt(0).toUpperCase() + role.slice(1);        // → 'Guru' atau 'Siswa'
    return <KeuanganPage role={roleProp} />;
};
export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Route Dinamis: Parameter :role bisa diisi 'guru' atau 'siswa' */}
                <Route path="/:role/dashboard" element={<DashboardPage />} />
                <Route path="/:role/notifikasi" element={<NotifikasiPage />} />
                <Route path="/:role/kas-kelas"  element={<KeuanganPageWrapper />} />
                <Route path="/:role/validasi-tabungan" element={<KeuanganPageWrapper />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}