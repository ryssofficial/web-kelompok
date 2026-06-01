import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "../Components/DashboardLayout";
import { StyledCard, DataTable, HappyHuesTheme, StyledButton } from "../Components/BaseComponents";
import { CookieManager } from "../Services/CookiesFactory/BaseCookies";
import { GoogleCookieFactory } from "../Services/CookiesFactory/GoogleCookieFactory";
import { AxiosConfig } from "../API/AxiosConfig";

const manager = new CookieManager();

const StatHighlight = ({ label, value, icon, color, subtext }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
                fontSize: '28px', backgroundColor: color, width: '60px', height: '60px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `3px solid ${HappyHuesTheme.stroke}`, boxShadow: `4px 4px 0px ${HappyHuesTheme.stroke}`, borderRadius: '8px'
            }}>
                {icon}
            </div>
            <p style={{ margin: 0, color: HappyHuesTheme.paragraph, fontWeight: '900', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                {label}
            </p>
        </div>
        <div>
            <h2 style={{ margin: 0, fontSize: '42px', color: HappyHuesTheme.stroke, lineHeight: '1.1' }}>{value}</h2>
            {subtext && <small style={{ color: HappyHuesTheme.secondary, fontWeight: 'bold', fontSize: '13px' }}>{subtext}</small>}
        </div>
    </div>
);

export default function DashboardPage() {
    const { role } = useParams();
    const isGuru = role === 'guru';
    
    const [lastVisit, setLastVisit] = useState("Ini kunjungan pertamamu!");
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        stats: {},
        jadwal: [],
        notifikasi: []
    });

    useEffect(() => {
        const previousVisitCookie = manager.get("LAST_VISIT");
        if (previousVisitCookie) { setLastVisit(`Kunjungan terakhir: ${decodeURIComponent(previousVisitCookie)}`); }
        const roleCookie = GoogleCookieFactory.createCookie("preference", "USER_ROLE", role);
        manager.save(roleCookie);

        const now = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
        const visitCookie = GoogleCookieFactory.createCookie("preference", "LAST_VISIT", now);
        manager.save(visitCookie);

        const fetchDashboardData = async () => {
            try {
                const endpoint = isGuru ? "dashboard/guru" : "dashboard/siswa";
                const response = await AxiosConfig.get(endpoint);
                if (response.success) { setDashboardData(response.data);}
            } catch (error) {
                console.error("Gagal mengambil data dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [role]);

    const determineScheduleStatus = (jamMulai, jamSelesai) => {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes(); 
        const getMinutes = (timeStr) => {
            if(!timeStr) return 0;
            const [hours, minutes] = timeStr.split(':').map(Number);
            return (hours * 60) + minutes;
        };

        const start = getMinutes(jamMulai);
        const end = getMinutes(jamSelesai);
        if (currentTime < start) return "Belum Mulai";
        if (currentTime >= start && currentTime <= end) return "Berlangsung";
        
        return "Selesai";
    };

    const renderStats = () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '40px' }}>
            {isGuru ? (
                <>
                    <StyledCard accentColor={HappyHuesTheme.highlight}>
                        <StatHighlight label="Kehadiran Siswa" value={dashboardData.stats.kehadiran || "0%"} icon="📍" color={HappyHuesTheme.highlight} subtext="Berdasarkan presensi hari ini" />
                    </StyledCard>
                    <StyledCard accentColor={HappyHuesTheme.tertiary}>
                        <StatHighlight label="Total Kelas" value={dashboardData.stats.totalKelas || "0"} icon="⏳" color={HappyHuesTheme.tertiary} subtext="Yang Anda ampu saat ini" />
                    </StyledCard>
                    <StyledCard accentColor={HappyHuesTheme.secondary}>
                        <StatHighlight label="Tugas Aktif" value={dashboardData.stats.tugasAktif || "0"} icon="📚" color={HappyHuesTheme.secondary} subtext="Perlu dinilai" />
                    </StyledCard>
                </>
            ) : (
                <>
                    <StyledCard accentColor={HappyHuesTheme.highlight}>
                        <StatHighlight label="Tabungan Anda" value={`Rp ${parseInt(dashboardData.stats.saldoTabungan || 0).toLocaleString('id-ID')}`} icon="💰" color={HappyHuesTheme.highlight} subtext="Sisa saldo saat ini" />
                    </StyledCard>
                    <StyledCard accentColor={HappyHuesTheme.secondary}>
                        <StatHighlight label="Tugas Baru" value={dashboardData.stats.tugasBaru || "0"} icon="📝" color={HappyHuesTheme.secondary} subtext="Belum dikerjakan" />
                    </StyledCard>
                    <StyledCard accentColor={HappyHuesTheme.tertiary}>
                        <StatHighlight label="Persentase Hadir" value={dashboardData.stats.persentaseHadir || "0%"} icon="📅" color={HappyHuesTheme.tertiary} subtext="Semester ini" />
                    </StyledCard>
                </>
            )}
        </div>
    );

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: HappyHuesTheme.background }}><h2 style={{ color: HappyHuesTheme.stroke }}>Memuat Data Dashboard...</h2></div>;
    }

    return (
        <DashboardLayout role={isGuru ? "Guru" : "Siswa"} activeMenu="Dashboard">
            <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                <style>
                    {`
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(15px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}
                </style>
                
                <div style={{ marginBottom: '20px' }}>
                    <h1 style={{ color: HappyHuesTheme.stroke, marginBottom: '5px' }}>
                        Halo, {isGuru ? 'Bapak/Ibu Guru' : 'Siswa'}! 👋
                    </h1>
                    <p style={{ color: HappyHuesTheme.paragraph, marginTop: 0, fontWeight: 'bold' }}>
                        {lastVisit}
                    </p>
                </div>
                
                {renderStats()}
                
                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '30px', alignItems: 'start' }}>
                    <StyledCard title={isGuru ? "Jadwal Mengajar Hari Ini" : "Jadwal Pelajaran Hari Ini"}>
                        <DataTable 
                            headers={["Waktu", "Mata Pelajaran", isGuru ? "Kelas" : "Ruangan", "Status"]} 
                            data={dashboardData.jadwal.length > 0 ? dashboardData.jadwal.map(j => [
                                `${j.jamMulai.slice(0, 5)} - ${j.jamSelesai.slice(0, 5)}`,
                                j.mataPelajaran,
                                isGuru ? `${j.kelas}${j.kategori}` : `Kelas ${j.kelas}${j.kategori}`,
                                determineScheduleStatus(j.jamMulai, j.jamSelesai)
                            ]) : [["-", "Tidak ada jadwal hari ini", "-", "-"]]}
                        />
                    </StyledCard>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <StyledCard title="Notifikasi Terbaru" accentColor={HappyHuesTheme.secondary}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {dashboardData.notifikasi.length > 0 ? dashboardData.notifikasi.map((notif, index) => (
                                    <div key={index} style={{ 
                                        borderLeft: `5px solid ${index % 2 === 0 ? HappyHuesTheme.highlight : HappyHuesTheme.tertiary}`, 
                                        paddingLeft: '15px',
                                        backgroundColor: 'rgba(255, 137, 6, 0.1)',
                                        padding: '10px 15px'
                                    }}>
                                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '15px' }}>{notif.judul}</p>
                                        <small style={{ color: HappyHuesTheme.paragraph, fontSize: '13px' }}>{notif.pesan}</small>
                                    </div>
                                )) : (
                                    <p style={{ fontSize: '13px', color: HappyHuesTheme.paragraph }}>Tidak ada pemberitahuan baru.</p>
                                )}
                                <StyledButton label="Lihat Semua Notifikasi" fullWidth fontSize="13px" />
                            </div>
                        </StyledCard>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}