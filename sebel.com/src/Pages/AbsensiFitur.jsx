import React, { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "../Components//DashboardLayout";
import { StyledButton, StyledCard, HappyHuesTheme, PageContainer } from "../Components/BaseComponents";
import { DeleteButton } from "../Components/Button/DeleteButton";
import { AbsensiResponse } from "../API/MuadzResponse/AbsensiResponse";

// ─────────────────────────────────────────────
// Helper: format tanggal ke format lokal Indonesia
// ─────────────────────────────────────────────
const formatTanggal = (isoString) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

// ─────────────────────────────────────────────
// Helper: style badge status kehadiran
// ─────────────────────────────────────────────
const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
        case "hadir":
            return { bg: "#d4f5d4", color: "#1a6b1a", icon: "✅" };
        case "izin":
            return { bg: "#fff3cd", color: "#856404", icon: "📝" };
        case "sakit":
            return { bg: "#dce8ff", color: "#1a3a8b", icon: "🤒" };
        case "alpha":
        case "alpa":
            return { bg: "#ffd6d6", color: "#8b0000", icon: "❌" };
        default:
            return { bg: "#f0f0f0", color: HappyHuesTheme.stroke, icon: "❓" };
    }
};

// ─────────────────────────────────────────────
// Komponen: satu baris absensi
// ─────────────────────────────────────────────
const AbsensiItem = ({ item, onDelete }) => {
    const statusStyle = getStatusStyle(item.status_kehadiran);

    const containerStyle = {
        display: "flex",
        alignItems: "flex-start",
        gap: "16px",
        padding: "18px 20px",
        marginBottom: "12px",
        backgroundColor: HappyHuesTheme.main,
        border: `3px solid ${HappyHuesTheme.stroke}`,
        boxShadow: `4px 4px 0px ${HappyHuesTheme.stroke}`,
        transition: "all 0.15s ease-in-out",
        position: "relative",
    };

    return (
        <div style={containerStyle}>
            {/* Badge Status */}
            <div style={{
                minWidth: "64px",
                height: "64px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: statusStyle.bg,
                border: `3px solid ${HappyHuesTheme.stroke}`,
                boxShadow: `3px 3px 0px ${HappyHuesTheme.stroke}`,
                flexShrink: 0,
                gap: "2px",
            }}>
                <span style={{ fontSize: "22px" }}>{statusStyle.icon}</span>
                <span style={{
                    fontSize: "9px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: statusStyle.color,
                }}>
                    {item.status_kehadiran ?? "-"}
                </span>
            </div>

            {/* Konten */}
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
                        {item.nama_siswa}
                    </p>
                    <span style={{
                        fontSize: "11px",
                        color: HappyHuesTheme.paragraph,
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                    }}>
                        📅 {formatTanggal(item.tanggal_absensi)}
                    </span>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "8px" }}>
                    <span style={{ fontSize: "13px", color: HappyHuesTheme.paragraph }}>
                        🏫 <strong>Kelas:</strong> {item.kelas}
                    </span>
                    <span style={{ fontSize: "13px", color: HappyHuesTheme.paragraph }}>
                        📖 <strong>Mapel:</strong> {item.mata_pelajaran}
                    </span>
                    {item.keterangan && (
                        <span style={{ fontSize: "13px", color: HappyHuesTheme.paragraph }}>
                            📝 {item.keterangan}
                        </span>
                    )}
                </div>
            </div>

            {/* Aksi */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                <DeleteButton id={item.id_absensi} onDelete={onDelete} />
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
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>📅</div>
        <p style={{ fontWeight: "bold", fontSize: "18px", textTransform: "uppercase", letterSpacing: "1px" }}>
            Tidak Ada Data Absensi
        </p>
        <p style={{ fontSize: "14px", marginTop: "8px" }}>
            Data absensi siswa akan muncul di sini.
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
                height: "90px",
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
// Halaman Utama: AbsensiFitur
// ─────────────────────────────────────────────
const AbsensiFitur = ({ role = "guru" }) => {
    const [absensi, setAbsensi] = useState([]);
    const [filter, setFilter] = useState("semua"); // "semua" | "hadir" | "izin" | "sakit" | "alpha"
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── Fetch ──────────────────────────────────
    const fetchAbsensi = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await AbsensiResponse.getAll();
            setAbsensi(Array.isArray(data) ? data : data?.data ?? []);
        } catch (err) {
            setError("Gagal memuat data absensi. Silakan coba lagi.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAbsensi();
    }, [fetchAbsensi]);

    // ── Hapus ──────────────────────────────────
    const handleDelete = async (id) => {
        if (!window.confirm("Hapus data absensi ini?")) return;
        try {
            await AbsensiResponse.delete(id);
            setAbsensi((prev) => prev.filter((n) => n.id_absensi !== id));
        } catch (err) {
            alert("Gagal menghapus data. Silakan coba lagi.");
            console.error(err);
        }
    };

    // ── Derived state ──────────────────────────
    const countByStatus = (status) =>
        absensi.filter((n) => n.status_kehadiran?.toLowerCase() === status.toLowerCase()).length;

    const hadirCount = countByStatus("hadir");
    const izinCount = countByStatus("izin");
    const sakitCount = countByStatus("sakit");
    const alphaCount = absensi.filter((n) =>
        ["alpha", "alpa"].includes(n.status_kehadiran?.toLowerCase())
    ).length;

    const filtered = absensi.filter((n) => {
        const matchSearch = searchQuery === "" ||
            n.nama_siswa?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.kelas?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.mata_pelajaran?.toLowerCase().includes(searchQuery.toLowerCase());

        if (filter === "semua") return matchSearch;
        if (filter === "alpha") return matchSearch && ["alpha", "alpa"].includes(n.status_kehadiran?.toLowerCase());
        return matchSearch && n.status_kehadiran?.toLowerCase() === filter;
    });

    // ── Filter tabs ────────────────────────────
    const filterTabs = [
        { key: "semua", label: `Semua (${absensi.length})` },
        { key: "hadir", label: `Hadir (${hadirCount})` },
        { key: "izin", label: `Izin (${izinCount})` },
        { key: "sakit", label: `Sakit (${sakitCount})` },
        { key: "alpha", label: `Alpha (${alphaCount})` },
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

    // ── Persentase kehadiran ───────────────────
    const persentaseHadir = absensi.length > 0
        ? ((hadirCount / absensi.length) * 100).toFixed(1)
        : "-";

    // ──────────────────────────────────────────
    return (
        <DashboardLayout role={role} activeMenu="Absensi">
            <PageContainer>

                {/* ── Statistik ringkas ── */}
                <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
                    {[
                        { label: "Total Absensi", value: absensi.length, icon: "📅", color: HappyHuesTheme.tertiary },
                        { label: "Hadir", value: hadirCount, icon: "✅", color: "#d4f5d4" },
                        { label: "Izin / Sakit", value: izinCount + sakitCount, icon: "📝", color: "#fff3cd" },
                        { label: "Alpha", value: alphaCount, icon: "❌", color: "#ffd6d6" },
                        { label: "% Kehadiran", value: `${persentaseHadir}%`, icon: "📊", color: HappyHuesTheme.highlight },
                    ].map((stat) => (
                        <div key={stat.label} style={{
                            flex: "1 1 100px",
                            padding: "16px",
                            backgroundColor: stat.color,
                            border: `3px solid ${HappyHuesTheme.stroke}`,
                            boxShadow: `4px 4px 0px ${HappyHuesTheme.stroke}`,
                            textAlign: "center",
                        }}>
                            <div style={{ fontSize: "26px" }}>{stat.icon}</div>
                            <div style={{ fontWeight: "900", fontSize: "20px", color: HappyHuesTheme.stroke }}>{stat.value}</div>
                            <div style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", color: HappyHuesTheme.paragraph, letterSpacing: "0.5px" }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* ── Header filter & search ── */}
                <StyledCard
                    title="📅 Data Absensi Siswa"
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

                        {/* Search + Refresh */}
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                            <input
                                type="text"
                                placeholder="🔍 Cari siswa / kelas / mapel..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    padding: "10px 14px",
                                    border: `3px solid ${HappyHuesTheme.stroke}`,
                                    backgroundColor: HappyHuesTheme.main,
                                    fontWeight: "bold",
                                    fontSize: "13px",
                                    color: HappyHuesTheme.stroke,
                                    outline: "none",
                                    minWidth: "220px",
                                }}
                            />
                            <StyledButton
                                label="🔄 Refresh"
                                type="secondary"
                                onClick={fetchAbsensi}
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

                {/* ── Daftar absensi ── */}
                <StyledCard accentColor={HappyHuesTheme.tertiary}>
                    {loading ? (
                        <LoadingSkeleton />
                    ) : filtered.length === 0 ? (
                        <EmptyState />
                    ) : (
                        filtered.map((item) => (
                            <AbsensiItem
                                key={item.id_absensi}
                                item={item}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </StyledCard>

            </PageContainer>
        </DashboardLayout>
    );
};

export default AbsensiFitur;