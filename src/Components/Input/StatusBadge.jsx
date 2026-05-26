import { HappyHuesTheme } from "../BaseComponents";

export const StatusBadge = ({ status, type = 'success' }) => {
    const colors = {
        success: '#2cb67d', // Hadir / Valid
        warning: HappyHuesTheme.highlight, // Izin / Pending
        danger: HappyHuesTheme.tertiary, // Alfa / Ditolak
    };
    
    return (
        <span style={{
            padding: '4px 12px',
            backgroundColor: colors[type],
            border: `2px solid ${HappyHuesTheme.stroke}`,
            fontWeight: 'bold',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            boxShadow: `2px 2px 0px ${HappyHuesTheme.stroke}`,
            display: 'inline-block'
        }}>
            {status}
        </span>
    );
};