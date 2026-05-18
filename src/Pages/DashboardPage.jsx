import React from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "../Components/DashboardLayout";
import { StyledCard, DataTable, HappyHuesTheme, StyledButton } from "../Components/BaseComponents";

// Komponen Statistik yang diperbarui agar lebih modern
const StatHighlight = ({ label, value, icon, color, subtext }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
                fontSize: '28px',
                backgroundColor: color,
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `3px solid ${HappyHuesTheme.stroke}`,
                boxShadow: `4px 4px 0px ${HappyHuesTheme.stroke}`,
                borderRadius: '8px'
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

    const renderStats = () => (
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '30px', 
            marginBottom: '40px' 
        }}>
            {isGuru ? (
                <>
                    <StyledCard accentColor={HappyHuesTheme.highlight}>
                        <StatHighlight label="Kehadiran" value="28/32" icon="📍" color={HappyHuesTheme.highlight} subtext="+2 siswa dari kemarin" />
                    </StyledCard>
                    <StyledCard accentColor={HappyHuesTheme.tertiary}>
                        <StatHighlight label="Validasi Tabungan" value="15" icon="⏳" color={HappyHuesTheme.tertiary} subtext="Perlu segera dicek" />
                    </StyledCard>
                    <StyledCard accentColor={HappyHuesTheme.secondary}>
                        <StatHighlight label="Tugas Tertunda" value="8" icon="📚" color={HappyHuesTheme.secondary} subtext="Deadline besok pagi" />
                    </StyledCard>
                </>
            ) : (
                <>
                    <StyledCard accentColor={HappyHuesTheme.highlight}>
                        <StatHighlight label="Tabungan Anda" value="Rp 750k" icon="💰" color={HappyHuesTheme.highlight} subtext="Mendekati target bulan ini!" />
                    </StyledCard>
                    <StyledCard accentColor={HappyHuesTheme.secondary}>
                        <StatHighlight label="Tugas Aktif" value="3" icon="📝" color={HappyHuesTheme.secondary} subtext="1 tugas segera berakhir" />
                    </StyledCard>
                    <StyledCard accentColor={HappyHuesTheme.tertiary}>
                        <StatHighlight label="Presensi" value="95%" icon="📅" color={HappyHuesTheme.tertiary} subtext="Pertahankan kehadiranmu!" />
                    </StyledCard>
                </>
            )}
        </div>
    );

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
                
                {renderStats()}
                
                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '30px', alignItems: 'start' }}>
                    {/* Kolom Kiri: Tabel Jadwal */}
                    <StyledCard title={isGuru ? "Jadwal Mengajar Hari Ini" : "Jadwal Pelajaran Hari Ini"}>
                        <DataTable 
                            headers={["Waktu", "Mata Pelajaran", isGuru ? "Kelas" : "Ruang", "Status"]} 
                            data={isGuru ? [
                                ["07:30 - 09:00", "Matematika", "XII-A", "Selesai"],
                                ["09:00 - 10:30", "Fisika", "XI-B", "Berlangsung"]
                            ] : [
                                ["07:30 - 09:00", "B. Indonesia", "R.102", "Selesai"],
                                ["09:00 - 10:30", "Seni Budaya", "Lab Seni", "Berlangsung"]
                            ]}
                        />
                    </StyledCard>

                    {/* Kolom Kanan: Notifikasi */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <StyledCard title="Notifikasi Terbaru" accentColor={HappyHuesTheme.secondary}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ 
                                    borderLeft: `5px solid ${HappyHuesTheme.highlight}`, 
                                    paddingLeft: '15px',
                                    backgroundColor: 'rgba(255, 137, 6, 0.1)',
                                    padding: '10px 15px'
                                }}>
                                    <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '15px' }}>Pengumuman Ujian</p>
                                    <small style={{ color: HappyHuesTheme.paragraph, fontSize: '13px' }}>Ujian tengah semester akan dimulai Senin depan. Persiapkan dirimu!</small>
                                </div>
                                <StyledButton label="Lihat Semua Notifikasi" fullWidth fontSize="13px" />
                            </div>
                        </StyledCard>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}