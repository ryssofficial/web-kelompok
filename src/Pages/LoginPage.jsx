import React, { useState, useEffect } from "react";                            
import { useNavigate, useLocation } from "react-router-dom";             
import {                            
    PageContainer,                          
    StyledCard, 
    StyledButton,                           
    HappyHuesTheme                          
} from "../Components/BaseComponents";                          
import { NotificationCustom } from "../Components/Notifications/NotificationCustom"                         
import { LoginLogic } from "../Logic/LoginLogic";                           
import { GoogleButton } from "../Components/Button/GoogleButton";

//Form Input
const FormInputFactory = ({ isSiswa, identifier, setIdentifier, password, setPassword }) => {
    const inputStyle = {
        width: '100%',
        padding: '12px',
        marginBottom: '16px',
        border: `3px solid ${HappyHuesTheme.stroke}`,
        backgroundColor: HappyHuesTheme.main,
        color: HappyHuesTheme.background,
        fontWeight: 'bold',
        boxSizing: 'border-box'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        color: HappyHuesTheme.paragraph,
        fontWeight: 'bold'
    };

    const formConfig = isSiswa ? {
        label: "Nomor Induk Siswa (NIS)",
        type: "number", 
        MozAppearance: 'textfield',
        placeholder: "Masukkan NIS Anda...",
    } : {
        label: "Alamat Email",
        type: "email",
        placeholder: "contoh@gmail.com",
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <style>
                {`
                    input::-webkit-outer-spin-button,
                    input::-webkit-inner-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                    }
                `}
            </style>
            <label style={labelStyle}>{formConfig.label}</label>
            <input 
                type={formConfig.type}
                placeholder={formConfig.placeholder}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={inputStyle}
            />

            <label style={labelStyle}>Password</label>
            <input 
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
            />
        </div>
    );
};

export default function LoginPage() {
    const location = useLocation();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState(null); 
    const navigate = useNavigate();
    const [isSiswa, setIsSiswa] = useState(() => {
        if (location.state?.role === 'guru') return false;
        return true;
    });
    const getLogin = (e) => {
        e.preventDefault();
        const result = isSiswa 
            ? LoginLogic.Siswa(identifier, password) 
            : LoginLogic.Guru(identifier, password);
        if (result.success) {
            setNotification({
                type: 'success',
                title: 'Login Berhasil',
                message: `Selamat datang, ${isSiswa ? 'Siswa' : 'Guru'}!`
            });
            
            setTimeout(() => {
                navigate(isSiswa ? '/siswa/dashboard' : '/guru/dashboard');
            }, 1000);
        } else {
            setNotification({
                type: 'error',
                title: 'Login Gagal',
                message: result.errorMsg
            });
        }
    };

    const handleGoogleLogin = () => {
        console.log("Memicu OAuth Google untuk Guru...");
        // Tambahkan logika integrasi Firebase/Google Auth di sini
    };

    const toggleUserType = () => {
        setIsSiswa(!isSiswa);
        setIdentifier('');
        setPassword('');
        setNotification(null);
    };

    useEffect(() => {
        if (location.state?.role) {
            const role = location.state.role;
            setIsSiswa(role === 'siswa');
            document.title = `Login ${role.charAt(0).toUpperCase() + role.slice(1)} | SmartSchool`;
        }
    }, [location.state, setIsSiswa]);

    return (
        <PageContainer>
            {notification && (
                <NotificationCustom 
                    type={notification.type}
                    title={notification.title}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px 0' }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    
                    <StyledCard title={`Login ${isSiswa ? 'Siswa' : 'Guru'}`}>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <StyledButton 
                                label="Siswa" 
                                type={isSiswa ? 'primary' : 'secondary'}
                                onClick={() => !isSiswa && toggleUserType()}
                                fullWidth={true}
                                style={{ opacity: isSiswa ? 1 : 0.6 }}
                            />
                            <StyledButton 
                                label="Guru" 
                                type={!isSiswa ? 'primary' : 'secondary'}
                                onClick={() => isSiswa && toggleUserType()}
                                fullWidth={true}
                                style={{ opacity: !isSiswa ? 1 : 0.6 }}
                            />
                        </div>

                        <form onSubmit={getLogin}>
                            <FormInputFactory 
                                isSiswa={isSiswa}
                                identifier={identifier}
                                setIdentifier={setIdentifier}
                                password={password}
                                setPassword={setPassword}
                            />

                            <StyledButton 
                                label="Masuk Sekarang" 
                                type="primary" 
                                fullWidth={true} 
                                onClick={getLogin}
                                style={{ marginTop: '20px' }}  
                            />
                        </form>

                        {!isSiswa && (
                            <>
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    margin: '25px 0 15px 0',
                                    color: HappyHuesTheme.paragraph
                                }}>
                                    <div style={{ flex: 1, height: '2px', backgroundColor: HappyHuesTheme.stroke }}></div>
                                    <span style={{ padding: '0 10px', fontSize: '12px', fontWeight: 'bold' }}>ATAU</span>
                                    <div style={{ flex: 1, height: '2px', backgroundColor: HappyHuesTheme.stroke }}></div>
                                </div>
                                
                                <GoogleButton onClick={handleGoogleLogin} />
                            </>
                        )}
                    </StyledCard>
                </div>
            </div>
        </PageContainer>
    );
}