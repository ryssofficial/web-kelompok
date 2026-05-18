import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    HappyHuesTheme, 
    StyledButton, 
    StyledCard 
} from '../Components/BaseComponents';

const LandingPage = () => {
    const navigate = useNavigate();

    const containerStyle = {
        backgroundColor: HappyHuesTheme.background,
        minHeight: '100vh',
        color: HappyHuesTheme.headline,
        fontFamily: 'system-ui, sans-serif',
        padding: '0 20px'
    };

    const heroSectionStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '100px 0 60px 0',
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        maxWidth: '1200px',
        margin: '40px auto'
    };

    return (
        <div style={containerStyle}>
            {/* --- HERO SECTION --- */}
            <header style={heroSectionStyle}>
                <h1 style={{ 
                    fontSize: '4rem', 
                    marginBottom: '10px', 
                    textTransform: 'uppercase',
                    lineHeight: '0.9',
                    color: HappyHuesTheme.headline
                }}>
                    SEBEL <span style={{ color: HappyHuesTheme.button }}>School</span>
                </h1>
                <p style={{ 
                    fontSize: '1.2rem', 
                    color: HappyHuesTheme.paragraph,
                    maxWidth: '600px',
                    marginBottom: '30px'
                }}>
                    Kelola tabungan, presensi, dan nilai tugas dalam satu platform 
                    dengan desain yang berani dan interaktif.
                </p>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <StyledButton 
                        label="Mulai Sekarang" 
                        onClick={() => document.getElementById('roles').scrollIntoView({ behavior: 'smooth' })}
                        padding="15px 40px"
                        fontSize="18px"
                    />
                </div>
            </header>

            <div style={gridStyle}>
                <StyledCard title="Banyak Prestasi" accentColor={HappyHuesTheme.button}>
                    <p style={{color: HappyHuesTheme.stroke}}>Berburu banyak prestasi adalah pencapaian bonus sekolah selain belajar ilmu pengetahuan dan pengembangan potensi diri</p>
                </StyledCard>
                <StyledCard title="Manajemen Transparansi" accentColor={HappyHuesTheme.secondary}>
                    <p style={{color: HappyHuesTheme.stroke}}>Manajemen Sekolah yang menjamin kualitas yang bagus dan menjamin keamanan serta kenyamanan</p>
                </StyledCard>
                <StyledCard title="Fasilitas Lengkap" accentColor={HappyHuesTheme.tertiary}>
                    <p style={{color: HappyHuesTheme.stroke}}>Siswa bisa memantau tugas dan guru bisa memberikan nilai dengan cepat.</p>
                </StyledCard>
            </div>

            <section id="roles" style={{ padding: '80px 0', textAlign: 'center' }}>
                <h2 style={{ 
                    textTransform: 'uppercase', 
                    fontSize: '2.5rem', 
                    marginBottom: '40px' 
                }}>
                    Masuk Sebagai
                </h2>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '40px', 
                    flexWrap: 'wrap' 
                }}>
                    <div style={{ width: '280px' }}>
                        <StyledCard title="GURU" accentColor={HappyHuesTheme.highlight}>
                            <StyledButton 
                                label="Login Guru" 
                                fullWidth={true} 
                                // Kirim state 'guru'
                                onClick={() => navigate('/login', { state: { role: 'guru' } })} 
                            />
                        </StyledCard>
                    </div>

                    <div style={{ width: '280px' }}>
                        <StyledCard title="SISWA" accentColor={HappyHuesTheme.secondary}>
                            <StyledButton 
                                label="Login Siswa" 
                                type="secondary" 
                                fullWidth={true} 
                                // Kirim state 'siswa'
                                onClick={() => navigate('/login', { state: { role   : 'siswa' } })} 
                            />
                        </StyledCard>
                    </div>
                </div>
            </section>

            <footer style={{ 
                textAlign: 'center', 
                padding: '40px', 
                borderTop: `3px solid ${HappyHuesTheme.stroke}`,
                marginTop: '60px',
                color: HappyHuesTheme.paragraph
            }}>
                <p>© 2026 SmartSchool Project. Build with Passion.</p>
            </footer>
        </div>
    );
};

export default LandingPage;