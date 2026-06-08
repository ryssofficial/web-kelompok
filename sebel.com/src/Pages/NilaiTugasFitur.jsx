import React, { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "../Components/DashboardLayout";
import { StyledButton, StyledCard, HappyHuesTheme, PageContainer } from "../Components/BaseComponents";
import { DeleteButton } from "../Components/Button/DeleteButton";
import { NilaiTugasResponse } from "../API/MuadzResponse/NilaiTugasResponse";

// ─────────────────────────────────────────────
// Helper: format tanggal ke format lokal Indonesia
// Backend mengirim field: tanggal_input
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
// Helper: warna badge nilai
// ─────────────────────────────────────────────
const getNilaiBadgeStyle = (nilai) => {
    if (nilai === null || nilai === undefined) return { bg: "#f0f0f0", color: HappyHuesTheme.stroke };
    if (nilai >= 85) return { bg: "#d4f5d4", color: "#1a6b1a" };
    if (nilai >= 70) return { bg: "#fff3cd", color: "#856404" };
    return { bg: "#ffd6d6", color: "#8b0000" };
};

// ─────────────────────────────────────────────
// Komponen: satu baris nilai tugas
//
// Struktur item dari backend (setelah nestRelation):
// {
//   id_nilai        : number   ← primary key backend
//   tugas_ke        : number   ← urutan tugas
//   nilai           : number | null
//   tanggal_input   : string   ← bukan tanggal_pengumpulan
//   siswa: {
//     nama_siswa    : string   ← nested, bukan flat
//     nis_siswa     : string
//   }
// }
// ─────────────────────────────────────────────
const NilaiTugasItem = ({ item, onDelete }) => {
    const badge = getNilaiBadgeStyle(item.nilai);

    // Akses data siswa dari objek nested (hasil nestRelation backend)
    const namaSiswa = item.namaSiswa ?? "-";
    const nisSiswa  = item.nisSiswa  ?? "-";

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
            {/* Badge Nilai */}
            <div style={{
                minWidth: "60px",
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: badge.bg,
                border: `3px solid ${HappyHuesTheme.stroke}`,
                boxShadow: `3px 3px 0px ${HappyHuesTheme.stroke}`,
                fontWeight: "900",
                fontSize: "20px",
                color: badge.color,
                flexShrink: 0,
            }}>
                {item.nilai ?? "-"}
            </div>

            {/* Konten */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "8px",
                }}>
                    {/* tugas_ke menggantikan nama_tugas */}
                    <p style={{
                        margin: 0,
                        fontWeight: "900",
                        fontSize: "15px",
                        color: HappyHuesTheme.stroke,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                    }}>
                        Tugas ke-{item.tugasKe}
                    </p>

                    {/* tanggal_input menggantikan tanggal_pengumpulan */}
                    <span style={{
                        fontSize: "11px",
                        color: HappyHuesTheme.paragraph,
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                    }}>
                        📅 {formatTanggal(item.tanggalInput)}
                    </span>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "8px" }}>
                    {/* nama_siswa sekarang dari siswa.nama_siswa (nested) */}
                    <span style={{ fontSize: "13px", color: HappyHuesTheme.paragraph }}>
                        👤 <strong>Siswa:</strong> {namaSiswa}
                    </span>
                    {/* nis_siswa dari siswa.nis_siswa (nested) */}
                    <span style={{ fontSize: "13px", color: HappyHuesTheme.paragraph }}>
                        🪪 <strong>NIS:</strong> {nisSiswa}
                    </span>
                </div>
            </div>

            {/* Aksi — pakai id_nilai (bukan id_nilai_tugas) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                <DeleteButton id={item.id_nilai} onDelete={onDelete} />
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
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>📋</div>
        <p style={{ fontWeight: "bold", fontSize: "18px", textTransform: "uppercase", letterSpacing: "1px" }}>
            Tidak Ada Data Nilai Tugas
        </p>
        <p style={{ fontSize: "14px", marginTop: "8px" }}>
            Nilai tugas siswa akan muncul di sini.
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
// Halaman Utama: NilaiTugasFitur
//
// Props:
//   role      - role user (default "Guru")
//   idRombel  - filter rombel (opsional, kalau ada pilihan kelas)
//   idMapel   - filter mapel (opsional)
// ─────────────────────────────────────────────
const NilaiTugasFitur = ({ role = "Guru", idRombel, idMapel }) => {
    const [nilaiTugas, setNilaiTugas] = useState([]);
    const [filter, setFilter] = useState("semua"); // "semua" | "tuntas" | "belum_tuntas"
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── Fetch ──────────────────────────────────
    // Jika idRombel + idMapel tersedia → gunakan endpoint spesifik
    // Fallback ke getAll jika tidak ada filter
    // src/Pages/NilaiTugasFitur.js (Di dalam fungsi fetchNilaiTugas)

    const fetchNilaiTugas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let res;
            if (idRombel && idMapel) {
                res = await NilaiTugasResponse.getByRombelAndMapel(idRombel, idMapel);
            } else if (idRombel) {
                res = await NilaiTugasResponse.getByRombel(idRombel);
            } else {
                res = await NilaiTugasResponse.getAll();
            }
            
            // Ekstraksi super aman: cek apakah 'res' itu sendiri array, 
            // atau res.data adalah array, atau fallback ke res.data.data
            let finalArray = [];
            if (Array.isArray(res)) {
                finalArray = res;
            } else if (Array.isArray(res?.data)) {
                finalArray = res.data;
            } else if (Array.isArray(res?.data?.data)) {
                finalArray = res.data.data;
            }

            setNilaiTugas(finalArray);
        } catch (err) {
            setError("Gagal memuat data nilai tugas. Silakan coba lagi.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [idRombel, idMapel]);

    useEffect(() => {
        fetchNilaiTugas();
    }, [fetchNilaiTugas]);

    // ── Hapus ──────────────────────────────────
    // Gunakan id_nilai (bukan id_nilai_tugas)
    const handleDelete = async (id) => {
        if (!window.confirm("Hapus data nilai tugas ini?")) return;
        try {
            await NilaiTugasResponse.delete(id);
            // Filter berdasarkan id_nilai sesuai primary key backend
            setNilaiTugas((prev) => prev.filter((n) => n.id_nilai !== id));
        } catch (err) {
            alert("Gagal menghapus data. Silakan coba lagi.");
            console.error(err);
        }
    };

    // ── Derived state ──────────────────────────
    const tuntasCount     = nilaiTugas.filter((n) => n.nilai !== null && n.nilai >= 70).length;
    const belumTuntasCount = nilaiTugas.filter((n) => n.nilai === null || n.nilai < 70).length;
    const rataRata = nilaiTugas.length > 0
        ? (nilaiTugas.reduce((sum, n) => sum + (n.nilai ?? 0), 0) / nilaiTugas.length).toFixed(1)
        : "-";

    // Search: cari berdasarkan field yang tersedia dari backend
    // (nama_siswa ada di siswa.nama_siswa, tugas_ke sebagai string)
    const filtered = nilaiTugas.filter((n) => {
        const namaSiswa = (n.namaSiswa || "").toLowerCase();
        const tugasKe   = String(n.tugasKe ?? "");

        const matchSearch = searchQuery === "" ||
            namaSiswa.includes(searchQuery.toLowerCase()) ||
            tugasKe.includes(searchQuery);

        if (filter === "tuntas")       return matchSearch && n.nilai !== null && n.nilai >= 70;
        if (filter === "belum_tuntas") return matchSearch && (n.nilai === null || n.nilai < 70);
        return matchSearch;
    });

    // ── Filter tabs ────────────────────────────
    const filterTabs = [
        { key: "semua",        label: `Semua (${nilaiTugas.length})` },
        { key: "tuntas",       label: `Tuntas (${tuntasCount})` },
        { key: "belum_tuntas", label: `Belum Tuntas (${belumTuntasCount})` },
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
        <DashboardLayout role={role} activeMenu="Nilai Tugas">
            <PageContainer>

                {/* ── Statistik ringkas ── */}
                <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
                    {[
                        { label: "Total Tugas", value: nilaiTugas.length,  icon: "📋", color: HappyHuesTheme.tertiary  },
                        { label: "Tuntas",       value: tuntasCount,        icon: "✅", color: "#d4f5d4"               },
                        { label: "Belum Tuntas", value: belumTuntasCount,   icon: "❌", color: "#ffd6d6"               },
                        { label: "Rata-rata",    value: rataRata,           icon: "📊", color: HappyHuesTheme.highlight },
                    ].map((stat) => (
                        <div key={stat.label} style={{
                            flex: "1 1 120px",
                            padding: "16px",
                            backgroundColor: stat.color,
                            border: `3px solid ${HappyHuesTheme.stroke}`,
                            boxShadow: `4px 4px 0px ${HappyHuesTheme.stroke}`,
                            textAlign: "center",
                        }}>
                            <div style={{ fontSize: "28px" }}>{stat.icon}</div>
                            <div style={{ fontWeight: "900", fontSize: "22px", color: HappyHuesTheme.stroke }}>{stat.value}</div>
                            <div style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: HappyHuesTheme.paragraph, letterSpacing: "0.5px" }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* ── Header filter & search ── */}
                <StyledCard
                    title="📋 Nilai Tugas Siswa"
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
                                placeholder="🔍 Cari siswa / tugas ke-..."
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
                                onClick={fetchNilaiTugas}
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

                {/* ── Daftar nilai tugas ── */}
                <StyledCard accentColor={HappyHuesTheme.tertiary}>
                    {loading ? (
                        <LoadingSkeleton />
                    ) : filtered.length === 0 ? (
                        <EmptyState />
                    ) : (
                        filtered.map((item) => (
                            <NilaiTugasItem
                                key={item.id_nilai}       // ← id_nilai, bukan id_nilai_tugas
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

export default NilaiTugasFitur;
