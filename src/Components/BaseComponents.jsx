import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const HappyHuesTheme = {
    background: '#0f0e17',
    headline: '#fffffe',
    paragraph: '#a7a9be',
    button: '#ff8906',
    buttonText: '#fffffe',
    secondary: '#f25f4c',
    tertiary: '#e53170',
    stroke: '#000000',
    main: '#fffffe',
    highlight: '#ff8906',
};

export const NAV_CONFIG = {
    Guru: [
        { icon: "📊", label: "Dashboard" }, 
        { icon: "👥", label: "Presensi" }, 
        { icon: "📅", label: "Jadwal Mengajar" }, 
        { icon: "📚", label: "Nilai Tugas" }, 
        { icon: "💰", label: "Validasi Tabungan"}, 
        { icon: "🧾", label: "Kas Kelas"}, 
        { icon: "⚙️", label: "Pengaturan" }, 
        { icon: "🔔", label: "Notifikasi" }, 
    ],
    
    Siswa: [
        { icon: "📊", label: "Dashboard" }, 
        { icon: "📅", label: "Jadwal Pelajaran" }, 
        { icon: "📖", label: "Data Kas" }, 
        { icon: "👥", label: "Data Presensi"}, 
        { icon: "📝", label: "Tugas Saya" }, 
        { icon: "💰", label: "Menabung" }, 
        { icon: "👤", label: "Data Pribadi" }, 
        { icon: "⚙️", label: "Pengaturan" }, 
        { icon: "🔔", label: "Notifikasi" }
    ]
};

export const StyledButton = ({ 
    label, 
    onClick, 
    type = 'primary', 
    fullWidth = false, 
    color, 
    padding,     
    fontSize, 
    style 
}) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    
    const bgColor = color || (type === 'primary' ? HappyHuesTheme.button : HappyHuesTheme.secondary);

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                width: fullWidth ? '100%' : 'auto',
                minWidth: '120px',
                padding: padding || '12px 20px', 
                fontSize: fontSize || '14px', 
                backgroundColor: bgColor,
                color: HappyHuesTheme.buttonText,
                border: `3px solid ${HappyHuesTheme.stroke}`,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transform: isHovered ? 'translate(-2px, -2px)' : 'translate(0, 0)',
                boxShadow: isHovered ? `6px 6px 0px ${HappyHuesTheme.stroke}` : `4px 4px 0px ${HappyHuesTheme.stroke}`,
                transition: 'all 0.1s ease-in-out',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px', 
                ...style 
            }}
        >
            {label}
        </button>
    );
};

export const StyledCard = ({ children, title, accentColor = HappyHuesTheme.tertiary }) => (
    <div style={{
        backgroundColor: HappyHuesTheme.main,
        border: `3px solid ${HappyHuesTheme.stroke}`,
        padding: '24px',
        boxShadow: `10px 10px 0px ${HappyHuesTheme.stroke}`,
        marginBottom: '30px', 
        width: '100%', 
        boxSizing: 'border-box'
    }}>
        {title && (
            <div style={{ borderBottom: `3px solid ${HappyHuesTheme.stroke}`, marginBottom: '20px', paddingBottom: '10px' }}>
                <h3 style={{ margin: 0, color: accentColor, textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h3>
            </div>
        )}
        {children}
    </div>
);

export function DataTable({ headers, data, themeColor = HappyHuesTheme.highlight }) {
    const tableStyle = {
        width: '100%',
        borderCollapse: 'separate', 
        borderSpacing: 0,
        marginTop: '20px',
        border: `3px solid ${HappyHuesTheme.stroke}`,
        boxShadow: `8px 8px 0px ${HappyHuesTheme.stroke}`, 
    };

    const headerStyle = {
        backgroundColor: themeColor,
        color: HappyHuesTheme.buttonText,
        textAlign: 'left',
        textTransform: 'uppercase',
    };

    const cellStyle = {
        padding: '15px',
        border: `1px solid ${HappyHuesTheme.stroke}`, 
        fontWeight: 'bold',
        color: HappyHuesTheme.background
    };

    return (
        <div style={{ overflowX: 'auto' }}> 
            <table style={tableStyle}>
                <thead>
                    <tr style={headerStyle}>
                        {headers.map((head, index) => (
                            <th key={index} style={cellStyle}>{head}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} style={{ backgroundColor: HappyHuesTheme.main }}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} style={cellStyle}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export const PageContainer = ({ children }) => (
    <div style={{ 
        padding: '40px 20px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        minHeight: '100vh'
    }}>
        {children}
    </div>
);