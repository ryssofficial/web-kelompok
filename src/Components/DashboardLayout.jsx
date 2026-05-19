import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HappyHuesTheme, NAV_CONFIG } from "./BaseComponents";

const SidebarItem = ({ icon, label, isActive, onClick, isDanger }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Menentukan warna background berdasarkan state
    let bgColor = 'transparent';
    if (isActive) bgColor = HappyHuesTheme.button;
    else if (isHovered && isDanger) bgColor = HappyHuesTheme.secondary;
    else if (isHovered) bgColor = HappyHuesTheme.tertiary;

    // Menentukan warna font agar tidak menyatu dengan background putih
    const textColor = (isActive || isHovered) ? HappyHuesTheme.buttonText : HappyHuesTheme.stroke;

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '12px 20px',
                marginBottom: '10px',
                cursor: 'pointer',
                backgroundColor: bgColor,
                color: textColor,
                border: `3px solid ${isActive || isHovered ? HappyHuesTheme.stroke : 'transparent'}`,
                transform: isActive || isHovered ? 'translate(-4px, -4px)' : 'none',
                boxShadow: isActive || isHovered ? `4px 4px 0px ${HappyHuesTheme.stroke}` : 'none',
                transition: 'all 0.15s ease-in-out',
                fontWeight: 'bold',
                borderRadius: '4px'
            }}
        >
            <span style={{ fontSize: '22px' }}>{icon}</span>
            <span style={{ fontSize: '15px', letterSpacing: '0.5px' }}>{label}</span>
        </div>
    );
};

export const DashboardLayout = ({ role, children, activeMenu }) => {
    const navigate = useNavigate();
    const menus = NAV_CONFIG[role] || [];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: HappyHuesTheme.background, color: HappyHuesTheme.stroke }}>
            <aside style={{
                width: '300px',
                backgroundColor: HappyHuesTheme.main,
                borderRight: `6px solid ${HappyHuesTheme.stroke}`,
                padding: '30px 20px',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 100,
                boxSizing: 'border-box'
            }}>
                <div style={{ 
                    marginBottom: '40px',
                    padding: '20px 15px',
                    backgroundColor: HappyHuesTheme.highlight,
                    border: `4px solid ${HappyHuesTheme.stroke}`,
                    boxShadow: `6px 6px 0px ${HappyHuesTheme.stroke}`,
                    textAlign: 'center',
                    transform: 'rotate(-1deg)'
                }}>
                    <h2 style={{ margin: 0, fontSize: '26px', color: HappyHuesTheme.buttonText, letterSpacing: '1px' }}>
                        ⚡ SMART
                    </h2>
                    <p style={{ margin: '5px 0 0 0', fontWeight: '900', letterSpacing: '3px', fontSize: '13px', color: HappyHuesTheme.stroke }}>
                        SCHOOL PANEL
                    </p>
                </div>

                <nav style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '5px' }}>
                    {menus.map((item, index) => (
                        <SidebarItem
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            isActive={activeMenu === item.label}
                            onClick={() => {
                                const pagePath = item.label.toLowerCase().replace(/\s+/g, '-');
                                const rolePath = role.toLowerCase();
                                navigate(`/${rolePath}/${pagePath}`);
                            }}
                        />
                    ))}
                </nav>

                <div style={{ borderTop: `4px dashed ${HappyHuesTheme.stroke}`, paddingTop: '20px', marginTop: '20px' }}>
                    <SidebarItem 
                        icon="👤" 
                        label="Profil Saya" 
                        isActive={activeMenu === "Profil Saya"} 
                        onClick={() => {navigate(`/${role.toLowerCase()}/profil`)}}
                    />
                    <SidebarItem 
                        icon="🚪" 
                        label="Keluar" 
                        isDanger={true} 
                        onClick={() => navigate('/')} 
                    />
                </div>
            </aside>

            {/* MAIN CONTENT Area */}
            <main style={{ marginLeft: '300px', width: '100%', padding: '50px', boxSizing: 'border-box' }}>
                <header style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '40px',
                    backgroundColor: HappyHuesTheme.main,
                    padding: '25px 35px',
                    border: `4px solid ${HappyHuesTheme.stroke}`,
                    boxShadow: `8px 8px 0px ${HappyHuesTheme.stroke}`,
                    borderRadius: '8px'
                }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '36px', color: HappyHuesTheme.stroke, textTransform: 'uppercase' }}>
                            {activeMenu}
                        </h1>
                        <p style={{ margin: '5px 0 0 0', color: HappyHuesTheme.paragraph, fontWeight: 'bold' }}>
                            Selamat datang kembali, mari kita mulai hari ini!
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                            backgroundColor: HappyHuesTheme.highlight, 
                            color: HappyHuesTheme.buttonText,
                            padding: '8px 16px', 
                            fontWeight: 'bold', 
                            border: `3px solid ${HappyHuesTheme.stroke}`,
                            display: 'inline-block',
                            marginBottom: '10px',
                            transform: 'rotate(2deg)'
                        }}>
                            {role.toUpperCase()}
                        </div>
                        <p style={{ margin: 0, color: HappyHuesTheme.stroke, fontWeight: 'bold' }}>
                            {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
};