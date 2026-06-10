import React, { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "../Components/DashboardLayout";
import { StyledButton, StyledCard, HappyHuesTheme, PageContainer } from "../Components/BaseComponents";
import { DeleteButton } from "../Components/Button/DeleteButton";
import { AbsensiResponse } from "../API/MuadzResponse/AbsensiResponse";

const formatTanggal = (isoString) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
    });
};

const getStatusStyle = (status) => {
    const s = (status || "").trim().toLowerCase();
    switch (s) {
        case "hadir": return { bg: "#d4f5d4", color: "#1a6b1a", icon: "✅" };
        case "izin":  return { bg: "#fff3cd", color: "#856404", icon: "📝" };
        case "sakit": return { bg: "#dce8ff", color: "#1a3a8b", icon: "🤒" };
        case "alpha":
        case "alpa":  return { bg: "#ffd6d6", color: "#8b0000", icon: "❌" };
        default:      return { bg: "#f0f0f0", color: HappyHuesTheme.stroke, icon: "❓" };
    }
};

const LoadingSkeleton = () => (
    <div>
        {[1, 2, 3].map((i) => (
            <div key={i} style={{
                height: "90px", marginBottom: "12px", backgroundColor: "#f0f0f0",
                border: `3px solid ${HappyHuesTheme.stroke}`,
                boxShadow: `4px 4px 0px ${HappyHuesTheme.stroke}`,
                animation: "pulse 1.4s ease-in-out infinite", opacity: 1 - i * 0.2,
            }} />
        ))}
        <style>{`@keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }`}</style>
    </div>
);

const EmptyState = () => (
    <div style={{ textAlign: "center", padding: "60px 20px", color: HappyHuesTheme.paragraph }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>📅</div>
        <p style={{ fontWeight: "bold", fontSize: "18px", textTransform: "uppercase", letterSpacing: "1px" }}>
            Tidak Ada Data Absensi
        </p>
        <p style={{ fontSize: "14px", marginTop: "8px" }}>Data absensi siswa akan muncul di sini.</p>
    </div>
);

const AbsensiItem = ({ item, onDelete }) => {
    const statusStyle = getStatusStyle(item.statusKehadiran);
    return (
        <div style={{
            display: "flex", alignItems: "flex-start", gap: "16px", padding: "18px 20px",
            marginBottom: "12px", backgroundColor: HappyHuesTheme.main,
            border: `3px solid ${HappyHuesTheme.stroke}`,
            boxShadow: `4px 4px 0px ${HappyHuesTheme.stroke}`,
            transition: "all 0.15s ease-in-out", position: "relative",
        }}>
            <div style={{
                minWidth: "64px", height: "64px", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", backgroundColor: statusStyle.bg,
                border: `3px solid ${HappyHuesTheme.stroke}`, boxShadow: `3px 3px 0px ${HappyHuesTheme.stroke}`,
                flexShrink: 0, gap: "2px",
            }}>
                <span style={{ fontSize: "22px" }}>{statusStyle.icon}</span>
                <span style={{ fontSize: "9px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.5px", color: statusStyle.color }}>
                    {item.statusKehadiran ?? "-"}
                </span>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                    <p style={{ margin: 0, fontWeight: "900", fontSize: "15px", color: HappyHuesTheme.stroke, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {item.namaSiswa}
                    </p>
                    <span style={{ fontSize: "11px", color: HappyHuesTheme.paragraph, fontWeight: "bold", whiteSpace: "nowrap" }}>
                        📅 {formatTanggal(item.tanggalPenilaian)}
                    </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "8px" }}>
                    <span style={{ fontSize: "13px", color: HappyHuesTheme.paragraph }}>
                        🧑‍🎓 <strong>NIS:</strong> {item.nisSiswa}
                    </span>
                    <span style={{ fontSize: "13px", color: HappyHuesTheme.paragraph }}>
                        📖 <strong>Tugas Ke-:</strong> {item.tugasKe}
                    </span>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                <DeleteButton id={item.idPresensi} onDelete={onDelete} />
            </div>
        </div>
    );
};

// ─── HELPER: normalisasi status dari API ───
const normalizeStatus = (s) => {
    const raw = (s || "").trim().toLowerCase();
    // mapping single char dari DB
    const map = { h: "hadir", i: "izin", s: "sakit", a: "alpha" };
    return map[raw] ?? raw; // jika sudah full string, tetap pakai
};

const AbsensiFitur = ({ role = "guru" }) => {
    const [absensi, setAbsensi] = useState([]);
    const [filter, setFilter] = useState("semua");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAbsensi = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await AbsensiResponse.getAll();
            const result = Array.isArray(data) ? data : (data?.data ?? []);
            setAbsensi(result);
        } catch (err) {
            setError("Gagal memuat data absensi.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAbsensi(); }, [fetchAbsensi]);

    const handleDelete = async (id) => {
        if (!window.confirm("Hapus data absensi ini?")) return;
        try {
            await AbsensiResponse.delete(id);
            setAbsensi((prev) => prev.filter((n) => n.idPresensi !== id));
        } catch (err) { alert("Gagal menghapus."); }
    };

    // ─── Filter logic (tidak ada duplikat) ───
    const filtered = absensi.filter((n) => {
        const nama   = (n.namaSiswa || "").toLowerCase();
        const nis    = (n.nisSiswa  || "").toString().toLowerCase();
        const status = normalizeStatus(n.statusKehadiran);
        const query  = searchQuery.toLowerCase().trim();

        const matchSearch = query === "" || nama.includes(query) || nis.includes(query);
        if (!matchSearch) return false;

        if (filter === "semua") return true;
        if (filter === "alpha") return ["alpha", "alpa"].includes(status);
        return status === filter;
    });

    // ─── Count per status (tidak ada duplikat) ───
    const countByStatus = (statusFilter) => {
        if (statusFilter === "alpha") {
            return absensi.filter((n) => ["alpha", "alpa"].includes(normalizeStatus(n.statusKehadiran))).length;
        }
        return absensi.filter((n) => normalizeStatus(n.statusKehadiran) === statusFilter).length;
    };

    const filterTabs = [
        { key: "semua", label: `Semua (${absensi.length})` },
        { key: "hadir", label: `Hadir (${countByStatus("hadir")})` },
        { key: "izin",  label: `Izin (${countByStatus("izin")})` },
        { key: "sakit", label: `Sakit (${countByStatus("sakit")})` },
        { key: "alpha", label: `Alpha (${countByStatus("alpha")})` },
    ];

    return (
        <DashboardLayout role={role} activeMenu="Absensi">
            <PageContainer>
                <StyledCard title="📅 Data Presensi Siswa" accentColor={HappyHuesTheme.highlight}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {filterTabs.map((tab) => (
                                <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
                                    padding: "10px 20px", fontWeight: "bold", fontSize: "13px", cursor: "pointer",
                                    border: `3px solid ${HappyHuesTheme.stroke}`,
                                    backgroundColor: filter === tab.key ? HappyHuesTheme.highlight : HappyHuesTheme.main,
                                    color: filter === tab.key ? HappyHuesTheme.buttonText : HappyHuesTheme.stroke,
                                }}>{tab.label}</button>
                            ))}
                        </div>
                        <input
                            type="text" placeholder="🔍 Cari..." value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ padding: "10px", border: `3px solid ${HappyHuesTheme.stroke}` }}
                        />
                    </div>
                </StyledCard>

                <StyledCard accentColor={HappyHuesTheme.tertiary}>
                    {loading ? <LoadingSkeleton /> : filtered.length === 0 ? <EmptyState /> : (
                        filtered.map((item) => (
                            <AbsensiItem key={item.idPresensi} item={item} onDelete={handleDelete} />
                        ))
                    )}
                </StyledCard>
            </PageContainer>
        </DashboardLayout>
    );
};

export default AbsensiFitur;