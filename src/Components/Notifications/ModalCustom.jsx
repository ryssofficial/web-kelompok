import React from "react";
import { HappyHuesTheme, StyledButton } from "../BaseComponents";

export const ModalCustom = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    onConfirm, 
    confirmLabel = "Ya, Lanjutkan",
    cancelLabel = "Batal",
    type = "info" // info, danger (untuk hapus)
}) => {
    if (!isOpen) return null;

    // Menutup modal jika area gelap di luar modal di klik
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const accentColor = type === "danger" ? HappyHuesTheme.tertiary : HappyHuesTheme.button;

    return (
        <div 
            onClick={handleOverlayClick}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(15, 14, 23, 0.8)', // Background gelap transparan
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10000,
                backdropFilter: 'blur(4px)' // Efek blur tipis kekinian
            }}
        >
            <div style={{
                backgroundColor: HappyHuesTheme.main,
                border: `4px solid ${HappyHuesTheme.stroke}`,
                boxShadow: `15px 15px 0px ${HappyHuesTheme.stroke}`,
                width: '90%',
                maxWidth: '500px',
                padding: '30px',
                position: 'relative',
                animation: 'modalSlide 0.3s ease-out'
            }}>
                {/* Tombol Close di Pojok */}
                <button 
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '15px',
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    ×
                </button>

                {/* Judul Modal */}
                <h2 style={{ 
                    marginTop: 0, 
                    color: accentColor, 
                    textTransform: 'uppercase',
                    borderBottom: `3px solid ${HappyHuesTheme.stroke}`,
                    paddingBottom: '10px'
                }}>
                    {title}
                </h2>

                {/* Isi Modal */}
                <div style={{ margin: '20px 0', color: HappyHuesTheme.paragraph, fontWeight: 'bold' }}>
                    {children}
                </div>

                {/* Tombol Aksi */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: '15px',
                    marginTop: '30px'
                }}>
                    <StyledButton 
                        label={cancelLabel} 
                        onClick={onClose} 
                        color="#a7a9be" // Warna abu-abu untuk batal
                        padding="8px 15px"
                    />
                    <StyledButton 
                        label={confirmLabel} 
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }} 
                        color={accentColor}
                        padding="8px 15px"
                    />
                </div>
            </div>

            {/* Animasi Sederhana */}
            <style>
                {`
                    @keyframes modalSlide {
                        from { transform: translateY(20px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
};