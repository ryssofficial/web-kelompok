import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import LandingPage from './Pages/LandingPages';
import LoginPage from './Pages/LoginPage';
import DashboardPage from './Pages/DashboardPage';
import NotifikasiPage from './Pages/NotifikasiPage';
import ProfileData from './Pages/ProfileData';
import JadwalPage from './Pages/JadwalPage';

// ✅ Wrapper kecil — ambil :role dari URL, kapitalisasi, kirim ke JadwalPage
const JadwalPageWrapper = () => {
    const { role } = useParams();                                           // 'guru' atau 'siswa'
    const roleProp = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Siswa'; // → 'Guru' atau 'Siswa'
    return <JadwalPage role={roleProp} />;
};
import KeuanganPage from './Pages/KeuanganPage';
import AbsensiFitur from './Pages/AbsensiFitur';
import NilaiTugasFitur from './Pages/NilaiTugasFitur';

const KeuanganPageWrapper = () => {
    const {role} = useParams();
    const roleProp = role.charAt(0).toUpperCase() + role.slice(1);        // → 'Guru' atau 'Siswa'
    return <KeuanganPage role={roleProp} />;
};

const AbsensiFiturWrapper = () => {
    const { role } = useParams();
    const roleProp = role.charAt(0).toUpperCase() + role.slice(1); // → 'Guru' atau 'Siswa'
    return <AbsensiFitur role={roleProp} />;
};


export default function App() {
    return (
        <Router>
            <Routes>
                {/* Auth & Landing */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                
                {/* Core Dashboard */}
                <Route path="/:role/dashboard" element={<DashboardPage />} />
                <Route path="/:role/notifikasi" element={<NotifikasiPage />} />

                <Route path="/:role/profil" element={<ProfileData />} />
=======

                {/* Fitur Jadwal Dinamis Berdasarkan Role Sidebar */}
                <Route path="/:role/jadwal-mengajar" element={<JadwalPageWrapper />} />
                <Route path="/:role/jadwal-pelajaran" element={<JadwalPageWrapper />} />
                
                {/* Fallback route jadwal static jika diperlukan */}
                <Route path="/jadwal" element={<JadwalPage role="Guru" />} />

                {/* Redirect jika path tidak ditemukan */}
                <Route path="/:role/kas-kelas" element={<KeuanganPageWrapper />} />
                <Route path="/:role/validasi-tabungan" element={<KeuanganPageWrapper />} />
                <Route path="/:role/data-kas" element={<KeuanganPageWrapper />} />

                <Route path="/:role/presensi" element={<AbsensiFiturWrapper />} />
                <Route path="/:role/data-presensi" element={<AbsensiFiturWrapper />} />
                <Route path="/:role/tugas-saya" element={<NilaiTugasFitur />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}