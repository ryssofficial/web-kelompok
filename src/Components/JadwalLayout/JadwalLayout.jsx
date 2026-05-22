import React, { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { HappyHuesTheme, NAV_CONFIG } from "../BaseComponents";

export const JadwalContext = createContext(null);
export const useJadwal = () => useContext(JadwalContext);
export const HARI_LIST = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const SidebarItem = ({ icon, label, isActive, onClick, isDanger }) => {
    const [isHovered, setIsHovered] = useState(false);

    let bgColor = 'transparent';
    if (isActive)              bgColor = HappyHuesTheme.button;
    else if (isHovered && isDanger) bgColor = HappyHuesTheme.secondary;
    else if (isHovered)        bgColor = HappyHuesTheme.tertiary;

    const textColor = (isActive || isHovered)
        ? HappyHuesTheme.buttonText
        : HappyHuesTheme.stroke;

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                display        : 'flex',
                alignItems     : 'center',
                gap            : '15px',
                padding        : '12px 20px',
                marginBottom   : '10px',
                cursor         : 'pointer',
                backgroundColor: bgColor,
                color          : textColor,
                border         : `3px solid ${(isActive || isHovered) ? HappyHuesTheme.stroke : 'transparent'}`,
                transform      : (isActive || isHovered) ? 'translate(-4px, -4px)' : 'none',
                boxShadow      : (isActive || isHovered) ? `4px 4px 0px ${HappyHuesTheme.stroke}` : 'none',
                transition     : 'all 0.15s ease-in-out',
                fontWeight     : 'bold',
                borderRadius   : '4px',
            }}
        >
            <span style={{ fontSize: '22px' }}>{icon}</span>
            <span style={{ fontSize: '15px', letterSpacing: '0.5px' }}>{label}</span>
        </div>
    );
};

const HariTab = ({ hari, isActive, jumlah, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const active = isActive || isHovered;

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                padding        : '10px 20px',
                fontWeight     : 'bold',
                fontSize       : '13px',
                textTransform  : 'uppercase',
                letterSpacing  : '1px',
                cursor         : 'pointer',
                border         : `3px solid ${HappyHuesTheme.stroke}`,
                backgroundColor: isActive
                    ? HappyHuesTheme.button
                    : isHovered
                        ? HappyHuesTheme.tertiary
                        : HappyHuesTheme.main,
                color          : active ? HappyHuesTheme.buttonText : HappyHuesTheme.stroke,
                transform      : active ? 'translate(-2px, -2px)' : 'none',
                boxShadow      : active
                    ? `4px 4px 0px ${HappyHuesTheme.stroke}`
                    : `2px 2px 0px ${HappyHuesTheme.stroke}`,
                transition     : 'all 0.12s ease-in-out',
                display        : 'flex',
                alignItems     : 'center',
                gap            : '8px',
                whiteSpace     : 'nowrap',
            }}
        >
            {hari}
            {jumlah > 0 && (
                <span style={{
                    backgroundColor: isActive ? HappyHuesTheme.background : HappyHuesTheme.highlight,
                    color          : HappyHuesTheme.buttonText,
                    borderRadius   : '50%',
                    width          : '22px',
                    height         : '22px',
                    display        : 'inline-flex',
                    alignItems     : 'center',
                    justifyContent : 'center',
                    fontSize       : '11px',
                    fontWeight     : '900',
                    border         : `2px solid ${HappyHuesTheme.stroke}`,
                }}>
                    {jumlah}
                </span>
            )}
        </button>
    );
};

/**
 * Props:
 *  @param {string}   role       - 'Guru' | 'Siswa'
 *  @param {string}   activeMenu - label menu yang sedang aktif di sidebar
 *  @param {Array}    jadwalData - array semua jadwal (dari JadwalManager)
 *  @param {string}   activeHari - hari yang sedang ditampilkan
 *  @param {Function} onHariChange - callback saat tab hari diklik
 *  @param {ReactNode} children  - konten utama (tabel jadwal, dsb.)
 */
export const JadwalLayout = ({
    role,
    activeMenu,
    jadwalData = [],
    activeHari,
    onHariChange,
    children,
}) => {
    const navigate = useNavigate();
    const menus    = NAV_CONFIG[role] || [];
    const jumlahPerHari = HARI_LIST.reduce((acc, hari) => {
        acc[hari] = jadwalData.filter(j => j.hari === hari).length;
        return acc;
    }, {});

    return (
        <JadwalContext.Provider value={{ jadwalData, activeHari, onHariChange }}>
            <div style={{
                display        : 'flex',
                minHeight      : '100vh',
                backgroundColor: HappyHuesTheme.background,
                color          : HappyHuesTheme.stroke,
            }}>
                <aside style={{
                    width          : '300px',
                    backgroundColor: HappyHuesTheme.main,
                    borderRight    : `6px solid ${HappyHuesTheme.stroke}`,
                    padding        : '30px 20px',
                    display        : 'flex',
                    flexDirection  : 'column',
                    position       : 'fixed',
                    height         : '100vh',
                    zIndex         : 100,
                    boxSizing      : 'border-box',
                }}>
                    <div style={{
                        marginBottom   : '40px',
                        padding        : '20px 15px',
                        backgroundColor: HappyHuesTheme.highlight,
                        border         : `4px solid ${HappyHuesTheme.stroke}`,
                        boxShadow      : `6px 6px 0px ${HappyHuesTheme.stroke}`,
                        textAlign      : 'center',
                        transform      : 'rotate(-1deg)',
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
                                    navigate(`/${role.toLowerCase()}/${pagePath}`);
                                }}
                            />
                        ))}
                    </nav>

                    <div style={{ borderTop: `4px dashed ${HappyHuesTheme.stroke}`, paddingTop: '20px', marginTop: '20px' }}>
                        <SidebarItem
                            icon="👤"
                            label="Profil Saya"
                            isActive={activeMenu === 'Profil Saya'}
                            onClick={() => navigate(`/${role.toLowerCase()}/profil`)}
                        />
                        <SidebarItem
                            icon="🚪"
                            label="Keluar"
                            isDanger
                            onClick={() => navigate('/')}
                        />
                    </div>
                </aside>

                <main style={{
                    marginLeft : '300px',
                    width      : '100%',
                    padding    : '50px',
                    boxSizing  : 'border-box',
                }}>
                    <header style={{
                        display        : 'flex',
                        justifyContent : 'space-between',
                        alignItems     : 'center',
                        marginBottom   : '30px',
                        backgroundColor: HappyHuesTheme.main,
                        padding        : '25px 35px',
                        border         : `4px solid ${HappyHuesTheme.stroke}`,
                        boxShadow      : `8px 8px 0px ${HappyHuesTheme.stroke}`,
                        borderRadius   : '8px',
                    }}>
                        <div>
                            <h1 style={{
                                margin       : 0,
                                fontSize     : '36px',
                                color        : HappyHuesTheme.stroke,
                                textTransform: 'uppercase',
                            }}>
                                📅 {activeMenu}
                            </h1>
                            <p style={{ margin: '5px 0 0 0', color: HappyHuesTheme.paragraph, fontWeight: 'bold' }}>
                                Total <strong>{jadwalData.length}</strong> sesi terjadwal minggu ini
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{
                                backgroundColor: HappyHuesTheme.highlight,
                                color          : HappyHuesTheme.buttonText,
                                padding        : '8px 16px',
                                fontWeight     : 'bold',
                                border         : `3px solid ${HappyHuesTheme.stroke}`,
                                display        : 'inline-block',
                                marginBottom   : '10px',
                                transform      : 'rotate(2deg)',
                            }}>
                                {role.toUpperCase()}
                            </div>
                            <p style={{ margin: 0, color: HappyHuesTheme.stroke, fontWeight: 'bold' }}>
                                {new Date().toLocaleDateString('id-ID', {
                                    day: 'numeric', month: 'long', year: 'numeric',
                                })}
                            </p>
                        </div>
                    </header>

                    <div style={{
                        display        : 'flex',
                        gap            : '10px',
                        flexWrap       : 'wrap',
                        marginBottom   : '30px',
                        padding        : '20px',
                        backgroundColor: HappyHuesTheme.main,
                        border         : `3px solid ${HappyHuesTheme.stroke}`,
                        boxShadow      : `6px 6px 0px ${HappyHuesTheme.stroke}`,
                    }}>
                        <HariTab
                            hari="Semua"
                            isActive={activeHari === 'Semua'}
                            jumlah={jadwalData.length}
                            onClick={() => onHariChange('Semua')}
                        />
                        {HARI_LIST.map(hari => (
                            <HariTab
                                key={hari}
                                hari={hari}
                                isActive={activeHari === hari}
                                jumlah={jumlahPerHari[hari]}
                                onClick={() => onHariChange(hari)}
                            />
                        ))}
                    </div>

                    {children}
                </main>
            </div>
        </JadwalContext.Provider>
    );
};

export default JadwalLayout;