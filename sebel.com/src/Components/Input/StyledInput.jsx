import { HappyHuesTheme } from "../BaseComponents";

export const StyledInput = ({ label, type = "text", placeholder, ...props }) => (
    <div style={{ marginBottom: '20px', width: '100%' }}>
        {label && (
            <label style={{ 
                display: 'block', 
                color: HappyHuesTheme.headline, 
                fontWeight: 'bold', 
                marginBottom: '8px',
                textTransform: 'uppercase',
                fontSize: '0.85rem'
            }}>
                {label}
            </label>
        )}
        <input 
            type={type}
            placeholder={placeholder}
            {...props}
            style={{
                width: '100%',
                padding: '12px 15px',
                backgroundColor: HappyHuesTheme.main,
                border: `3px solid ${HappyHuesTheme.stroke}`,
                boxShadow: `4px 4px 0px ${HappyHuesTheme.stroke}`,
                outline: 'none',
                fontWeight: 'bold',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
            }}
        />
    </div>
);

