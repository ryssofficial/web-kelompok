import React, { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "../Components//DashboardLayout";
import { StyledButton, StyledCard, HappyHuesTheme, PageContainer } from "../Components/BaseComponents";
import { DeleteButton } from "../Components/Button/DeleteButton";
import { NotifikasiResponse } from "../API/ArisFitur/NotifikasiResponse";

// ─────────────────────────────────────────────
// Helper: format tanggal ke format lokal Indonesia
// ─────────────────────────────────────────────
const formatTanggal = (isoString) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// ─────────────────────────────────────────────
// Komponen: satu baris notifikasi
// ─────────────────────────────────────────────
const NotifItem = ({ notif, onRead, onDelete }) => {
    const isUnread = !notif.is_read;

    const containerStyle = {
        display: "flex",
        alignItems: "flex-start",
        gap: "16px",
        padding: "18px 20px",
        marginBottom: "12px",
        backgroundColor: isUnread ? "#fff8f0" : HappyHuesTheme.main,
        border: `3px solid ${isUnread ? HappyHuesTheme.highlight : HappyHuesTheme.stroke}`,
        boxShadow: isUnread
            ? `6px 6px 0px ${HappyHuesTheme.highlight}`
            : `4px 4px 0px ${HappyHuesTheme.stroke}`,
        transition: "all 0.15s ease-in-out",
        position: "relative",
    };

    const dotStyle = {
        width: "12px",
        height: "12px",
        minWidth: "12px",
        borderRadius: "50%",
        backgroundColor: isUnread ? HappyHuesTheme.secondary : "transparent",
        border: `2px solid ${isUnread ? HappyHuesTheme.secondary : HappyHuesTheme.paragraph}`,
        marginTop: "5px",
    };

    return (
        <div style={containerStyle}>
            {/* Dot indikator belum/sudah dibaca */}
            <div style={dotStyle} title={isUnread ? "Belum dibaca" : "Sudah dibaca"} />

            {/* Konten notifikasi */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                    <p style={{
                        margin: 0,
                        fontWeight: "900",
                        fontSize: "15px",
                        color: HappyHuesTheme.stroke,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                    }}>
                        {notif.judul}
                    </p>
                    <span style={{
                        fontSize: "11px",
                        color: HappyHuesTheme.paragraph,
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                    }}>
                        🕐 {formatTanggal(notif.tanggal_notif)}
                    </span>
                </div>
                <p style={{
                    margin: "8px 0 0 0",
                    color: HappyHuesTheme.stroke,
                    fontSize: "14px",
                    lineHeight: "1.6",
                }}>
                    {notif.pesan}
                </p>
            </div>

            {/* Aksi */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                {isUnread && (
                    <StyledButton
                        label="✓ Tandai Dibaca"
                        color={HappyHuesTheme.tertiary}
                        padding="6px 12px"
                        fontSize="11px"
                        onClick={() => onRead(notif.id_notif)}
                    />
                )}
                <DeleteButton id={notif.id_notif} onDelete={onDelete} />
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// Komponen: Empty state
// ─────────────────────────────────────────────
const EmptyState = () => (
    <div style={{
        textAlign: "center",
        padding: "60px 20px",
        color: HappyHuesTheme.paragraph,
    }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔔</div>
        <p style={{ fontWeight: "bold", fontSize: "18px", textTransform: "uppercase", letterSpacing: "1px" }}>
            Tidak Ada Notifikasi
        </p>
        <p style={{ fontSize: "14px", marginTop: "8px" }}>
            Semua notifikasi akan muncul di sini.
        </p>
    </div>
);

// ─────────────────────────────────────────────
// Komponen: Loading skeleton
// ─────────────────────────────────────────────
const LoadingSkeleton = () => (
    <div>
        {[1, 2, 3].map((i) => (
            <div key={i} style={{
                height: "80px",
                marginBottom: "12px",
                backgroundColor: "#f0f0f0",
                border: `3px solid ${HappyHuesTheme.stroke}`,
                boxShadow: `4px 4px 0px ${HappyHuesTheme.stroke}`,
                animation: "pulse 1.4s ease-in-out infinite",
                opacity: 1 - i * 0.2,
            }} />
        ))}
        <style>{`@keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }`}</style>
    </div>
);

// ─────────────────────────────────────────────
// Halaman Utama: NotifikasiPage
// ─────────────────────────────────────────────
const NotifikasiPage = ({ role = "Guru" }) => {
    const [notifikasi, setNotifikasi] = useState([]);
    const [filter, setFilter] = useState("semua"); // "semua" | "belum" | "sudah"
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // ── Fetch ──────────────────────────────────
    const fetchNotifikasi = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await NotifikasiResponse.getAll();
            // Backend mengembalikan array; normalkan jika perlu
            setNotifikasi(Array.isArray(data) ? data : data?.data ?? []);
        } catch (err) {
            setError("Gagal memuat notifikasi. Silakan coba lagi.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifikasi();
    }, [fetchNotifikasi]);

    // ── Tandai satu sebagai dibaca ─────────────
    const handleMarkAsRead = async (id) => {
        try {
            await NotifikasiResponse.markAsRead(id);
            setNotifikasi((prev) =>
                prev.map((n) => (n.id_notif === id ? { ...n, is_read: true } : n))
            );
        } catch (err) {
            alert("Gagal menandai notifikasi. Silakan coba lagi.");
            console.error(err);
        }
    };

    // ── Tandai semua sebagai dibaca ────────────
    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return;
        setActionLoading(true);
        try {
            await NotifikasiResponse.markAllAsRead();
            setNotifikasi((prev) => prev.map((n) => ({ ...n, is_read: true })));
        } catch (err) {
            alert("Gagal menandai semua notifikasi. Silakan coba lagi.");
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    // ── Hapus ──────────────────────────────────
    const handleDelete = async (id) => {
        if (!window.confirm("Hapus notifikasi ini?")) return;
        try {
            await NotifikasiResponse.delete(id);
            setNotifikasi((prev) => prev.filter((n) => n.id_notif !== id));
        } catch (err) {
            alert("Gagal menghapus notifikasi. Silakan coba lagi.");
            console.error(err);
        }
    };

    // ── Derived state ──────────────────────────
    const unreadCount = notifikasi.filter((n) => !n.is_read).length;

    const filtered = notifikasi.filter((n) => {
        if (filter === "belum") return !n.is_read;
        if (filter === "sudah") return n.is_read;
        return true;
    });

    // ── Filter tabs ────────────────────────────
    const filterTabs = [
        { key: "semua", label: `Semua (${notifikasi.length})` },
        { key: "belum", label: `Belum Dibaca (${unreadCount})` },
        { key: "sudah", label: `Sudah Dibaca (${notifikasi.length - unreadCount})` },
    ];

    const tabStyle = (key) => ({
        padding: "10px 20px",
        fontWeight: "bold",
        fontSize: "13px",
        cursor: "pointer",
        border: `3px solid ${HappyHuesTheme.stroke}`,
        backgroundColor: filter === key ? HappyHuesTheme.highlight : HappyHuesTheme.main,
        color: filter === key ? HappyHuesTheme.buttonText : HappyHuesTheme.stroke,
        boxShadow: filter === key ? `4px 4px 0px ${HappyHuesTheme.stroke}` : "none",
        transform: filter === key ? "translate(-2px, -2px)" : "none",
        transition: "all 0.1s ease-in-out",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    });

    // ──────────────────────────────────────────
    return (
        <DashboardLayout role={role} activeMenu="Notifikasi">
            <PageContainer>

                {/* ── Header aksi ── */}
                <StyledCard
                    title={`🔔 Notifikasi ${unreadCount > 0 ? `(${unreadCount} baru)` : ""}`}
                    accentColor={HappyHuesTheme.highlight}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                        {/* Filter tabs */}
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {filterTabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setFilter(tab.key)}
                                    style={tabStyle(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Aksi bulk */}
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            <StyledButton
                                label={actionLoading ? "Memproses..." : "✓ Tandai Semua Dibaca"}
                                type="primary"
                                onClick={handleMarkAllAsRead}
                                style={{ opacity: unreadCount === 0 || actionLoading ? 0.5 : 1 }}
                            />
                            <StyledButton
                                label="🔄 Refresh"
                                type="secondary"
                                onClick={fetchNotifikasi}
                                style={{ opacity: loading ? 0.5 : 1 }}
                            />
                        </div>
                    </div>
                </StyledCard>

                {/* ── Error state ── */}
                {error && (
                    <div style={{
                        padding: "16px 20px",
                        marginBottom: "20px",
                        backgroundColor: "#fff0f0",
                        border: `3px solid ${HappyHuesTheme.secondary}`,
                        boxShadow: `4px 4px 0px ${HappyHuesTheme.stroke}`,
                        color: HappyHuesTheme.secondary,
                        fontWeight: "bold",
                        fontSize: "14px",
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* ── Daftar notifikasi ── */}
                <StyledCard accentColor={HappyHuesTheme.tertiary}>
                    {loading ? (
                        <LoadingSkeleton />
                    ) : filtered.length === 0 ? (
                        <EmptyState />
                    ) : (
                        filtered.map((notif) => (
                            <NotifItem
                                key={notif.id_notif}
                                notif={notif}
                                onRead={handleMarkAsRead}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </StyledCard>

            </PageContainer>
        </DashboardLayout>
    );
};

export default NotifikasiPage;