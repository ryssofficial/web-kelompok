import React, { useState } from "react";
import { HappyHuesTheme } from "../BaseComponents";

export const NotificationCustom = ({ 
    title, 
    message, 
    type = 'info', 
    variant = 'floating', 
    position = 'top-right', 
    width = '350px',
    isClosable = true,
    onClose,
    onClick,
    duration = null, 
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const typeColors = {
        info: HappyHuesTheme.highlight,
        success: '#2cb67d', 
        error: HappyHuesTheme.tertiary, 
        warning: '#fef6e4' 
    };

    const accentColor = typeColors[type] || typeColors.info;
    const positionStyles = {
        'top-right': { top: '20px', right: '20px' },
        'top-left': { top: '20px', left: '20px' },
        'bottom-right': { bottom: '20px', right: '20px' },
        'bottom-left': { bottom: '20px', left: '20px' },
    };

    if (!isVisible) return null;

    const baseStyle = {
        width: width,
        backgroundColor: HappyHuesTheme.main,
        border: `3px solid ${HappyHuesTheme.stroke}`,
        padding: '16px',
        boxShadow: `6px 6px 0px ${HappyHuesTheme.stroke}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 9999,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease', 
        position: variant === 'floating' ? 'fixed' : 'relative',
        ...(variant === 'floating' ? positionStyles[position] : { marginBottom: '20px' })
    };

    const handleClose = (e) => {
        e.stopPropagation();
        setIsVisible(false);
        if (onClose) onClose();
    };

    return (
        <div 
            style={baseStyle} 
            onClick={onClick}
            onMouseEnter={(e) => onClick && (e.currentTarget.style.transform = 'translate(-2px, -2px)')}
            onMouseLeave={(e) => onClick && (e.currentTarget.style.transform = 'translate(0, 0)')}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                    fontWeight: 'bold', 
                    textTransform: 'uppercase', 
                    color: accentColor,
                    fontSize: '0.9rem',
                    letterSpacing: '1px'
                }}>
                    {title}
                </span>
                {isClosable && (
                    <button 
                        onClick={handleClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            color: HappyHuesTheme.stroke
                        }}
                    >
                        ×
                    </button>
                )}
            </div>
            
            <p style={{ 
                margin: 0, 
                color: HappyHuesTheme.paragraph, 
                fontSize: '0.95rem',
                lineHeight: '1.4'
            }}>
                {message}
            </p>

            <div style={{ 
                height: '4px', 
                backgroundColor: accentColor, 
                width: '100%', 
                marginTop: '4px',
                border: `1px solid ${HappyHuesTheme.stroke}`
            }} />
        </div>
    );
};