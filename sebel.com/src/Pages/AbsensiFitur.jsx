import React, { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "../Components/DashboardLayout";
import {
    StyledButton,
    StyledCard,
    HappyHuesTheme,
    PageContainer,
} from "../Components/BaseComponents";
import { DeleteButton } from "../Components/Button/DeleteButton";
import { AbsensiResponse, normalizeAbsensiItem } from "../API/MuadzResponse/AbsensiResponse";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const formatTanggal = (isoString) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
    });
};

// Terima label ("Hadir") atau char ("H") — keduanya valid
const getStatusStyle = (status) => {
    const s = (status ?? "").trim().toUpperCase();
    // char dari DB
    if (s === "H") return { bg: "#d4f5d4", color: "#1a6b1a", icon: "✅", label: "Hadir" };
    if (s === "I") return { bg: "#fff3cd", color: "#856404", icon: "📝", label: "Izin"  };
    if (s === "S") return { bg: "#dce8ff", color: "#1a3a8b", icon: "🤒", label: "Sakit" };
    if (s === "A") return { bg: "#ffd6d6", color: "#8b0000", icon: "❌", label: "Alpha" };
    // label lengkap (fallback)
    const lower = s.toLowerCase();
    if (lower === "hadir") return { bg: "#d4f5d4", color: "#1a6b1a", icon: "✅", label: "Hadir" };
    if (lower === "izin")  return { bg: "#fff3cd", color: "#856404", icon: "📝", label: "Izin"  };
    if (lower === "sakit") return { bg: "#dce8ff", color: "#1a3a8b", icon: "🤒", label: "Sakit" };
    if (lower === "alpha" || lower === "alpa") return { bg: "#ffd6d6", color: "#8b0000", icon: "❌", label: "Alpha" };
    return { bg: "#f0f0f0", color: HappyHuesTheme.stroke, icon: "❓", label: status ?? "-" };
};

// Untuk filter: normalisasi ke lowercase label
const normalizeStatusLabel = (status) => {
    const s = getStatusStyle(status);
    return s.label.toLowerCase(); // "hadir" | "izin" | "sakit" | "alpha"
};

// ─────────────────────────────────────────────
// Loading & Empty
// ─────────────────────────────────────────────
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

const EmptyState = ({ message = "Tidak Ada Data." }) => (
    <div style={{ textAlign: "center", padding: "60px 20px", color: HappyHuesTheme.paragraph }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>📅</div>
        <p style={{ fontWeight: "bold", fontSize: "18px", textTransform: "uppercase", letterSpacing: "1px" }}>
            {message}
        </p>
    </div>
);

// ─────────────────────────────────────────────
// Komponen: Baris Absensi (Guru)
// ─────────────────────────────────────────────
const AbsensiItem = ({ item, onDelete }) => {
    const st = getStatusStyle(item.statusKehadiran);
    return (
        <div style={{
            display: "flex", alignItems: "flex-start", gap: "16px",
            padding: "18px 20px", marginBottom: "12px",
            backgroundColor: HappyHuesTheme.main,
            border: `3px solid ${HappyHuesTheme.stroke}`,
            boxShadow: `4px 4px 0px ${HappyHuesTheme.stroke}`,
        }}>
            {/* Badge status */}
            <div style={{
                minWidth: "64px", height: "64px", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                backgroundColor: st.bg, border: `3px solid ${HappyHuesTheme.stroke}`,
                boxShadow: `3px 3px 0px ${HappyHuesTheme.stroke}`, flexShrink: 0, gap: "2px",
            }}>
                <span style={{ fontSize: "22px" }}>{st.icon}</span>
                <span style={{ fontSize: "9px", fontWeight: "900", textTransform: "uppercase", color: st.color }}>
                    {st.label}
                </span>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                    <p style={{ margin: 0, fontWeight: "900", fontSize: "15px", color: HappyHuesTheme.stroke, textTransform: "uppercase" }}>
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
                        📖 <strong>Pertemuan ke-:</strong> {item.tugasKe ?? "-"}
                    </span>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                <DeleteButton id={item.idPresensi} onDelete={onDelete} />
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// Form Guru: Input Presensi
// Status dikirim sebagai label (Hadir/Izin/Sakit/Alpha)
// AbsensiResponse.create() yang konversi ke char sebelum ke DB
// ─────────────────────────────────────────────
const TODAY = new Date().toISOString().split("T")[0];

const EMPTY_FORM = {
    idAnggota:        "",
    tugasKe:          "",
    statusKehadiran:  "Hadir",
    tanggalPenilaian: TODAY,
};

const STATUS_OPTIONS = ["Hadir", "Izin", "Sakit", "Alpha"];

const FormInputPresensi = ({ onSuccess }) => {
    const [form, setForm]             = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const handleChange = (field, value) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async () => {
        if (!form.idAnggota || !form.tugasKe) {
            alert("ID Anggota dan Pertemuan ke- harus diisi.");
            return;
        }
        setSubmitting(true);
        setSuccessMsg("");
        try {
            // Kirim payload — status dalam bentuk label, dikonversi ke char di AbsensiResponse
            await AbsensiResponse.create({
                id_anggota:        parseInt(form.idAnggota, 10),
                tugas_ke:          parseInt(form.tugasKe, 10),
                status_kehadiran:  form.statusKehadiran,   // "Hadir" → dikonversi jadi "H"
                tanggal_penilaian: form.tanggalPenilaian,
            });
            setSuccessMsg(`✅ Presensi berhasil dicatat — ${form.statusKehadiran}`);
            setForm({ ...EMPTY_FORM, tanggalPenilaian: TODAY });
            if (onSuccess) onSuccess();
        } catch (err) {
            const msg = err?.response?.data?.message ?? err?.message ?? "Unknown error";
            alert(`Gagal menyimpan presensi.\n\nDetail: ${msg}`);
        } finally {
            setSubmitting(false);
        }
    };

    const inputStyle = {
        padding: "10px 14px", fontWeight: "bold", fontSize: "13px",
        border: `3px solid ${HappyHuesTheme.stroke}`,
        backgroundColor: HappyHuesTheme.main, color: HappyHuesTheme.stroke,
        outline: "none", width: "100%", boxSizing: "border-box",
    };

    const labelStyle = {
        display: "block", fontWeight: "900", fontSize: "12px",
        textTransform: "uppercase", letterSpacing: "0.5px",
        marginBottom: "6px", color: HappyHuesTheme.stroke,
    };

    return (
        <StyledCard title="📝 Input Presensi Siswa" accentColor={HappyHuesTheme.highlight}>
            {successMsg && (
                <div style={{ padding: "12px 16px", marginBottom: "16px", backgroundColor: "#d4f5d4", border: "2px solid #1a6b1a", fontWeight: "bold", fontSize: "14px", color: "#1a6b1a" }}>
                    {successMsg}
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>

                <div>
                    <label style={labelStyle}>ID Anggota *</label>
                    <input
                        type="number"
                        value={form.idAnggota}
                        onChange={(e) => handleChange("idAnggota", e.target.value)}
                        placeholder="ID siswa"
                        style={inputStyle}
                    />
                </div>

                <div>
                    <label style={labelStyle}>Pertemuan ke- *</label>
                    <input
                        type="number"
                        min="1"
                        value={form.tugasKe}
                        onChange={(e) => handleChange("tugasKe", e.target.value)}
                        placeholder="1, 2, 3..."
                        style={inputStyle}
                    />
                </div>

                <div>
                    <label style={labelStyle}>Status Kehadiran *</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {STATUS_OPTIONS.map((s) => {
                            const st = getStatusStyle(s);
                            const isSelected = form.statusKehadiran === s;
                            return (
                                <button
                                    key={s}
                                    onClick={() => handleChange("statusKehadiran", s)}
                                    style={{
                                        padding: "8px 12px", fontWeight: "bold", fontSize: "12px",
                                        cursor: "pointer", border: `2px solid ${HappyHuesTheme.stroke}`,
                                        backgroundColor: isSelected ? st.bg : HappyHuesTheme.main,
                                        color: isSelected ? st.color : HappyHuesTheme.stroke,
                                        boxShadow: isSelected ? `2px 2px 0px ${HappyHuesTheme.stroke}` : "none",
                                        transform: isSelected ? "translate(-1px, -1px)" : "none",
                                        textAlign: "left", display: "flex", alignItems: "center",
                                        gap: "8px", textTransform: "uppercase", letterSpacing: "0.3px",
                                        transition: "all 0.1s ease-in-out",
                                    }}
                                >
                                    <span>{st.icon}</span> {s}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <label style={labelStyle}>Tanggal</label>
                    <input
                        type="date"
                        value={form.tanggalPenilaian}
                        onChange={(e) => handleChange("tanggalPenilaian", e.target.value)}
                        style={inputStyle}
                    />
                </div>

            </div>

            <div style={{ marginTop: "20px" }}>
                <StyledButton
                    label={submitting ? "Menyimpan..." : "💾 Simpan Presensi"}
                    type="primary"
                    onClick={handleSubmit}
                    style={{ opacity: submitting ? 0.5 : 1 }}
                />
            </div>
        </StyledCard>
    );
};

// ─────────────────────────────────────────────
// VIEW GURU
// ─────────────────────────────────────────────
const ViewGuru = () => {
    const [absensi, setAbsensi]         = useState([]);
    const [filter, setFilter]           = useState("semua");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(null);

    const fetchAbsensi = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data  = await AbsensiResponse.getAll();
            const raw   = Array.isArray(data) ? data : (data?.data ?? []);
            setAbsensi(raw.map(normalizeAbsensiItem));
        } catch {
            setError("Gagal memuat data absensi.");
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
        } catch { alert("Gagal menghapus."); }
    };

    const countByStatus = (statusLabel) =>
        absensi.filter((n) => normalizeStatusLabel(n.statusKehadiran) === statusLabel).length;

    const filtered = absensi.filter((n) => {
        const nama  = (n.namaSiswa || "").toLowerCase();
        const nis   = (n.nisSiswa  || "").toString().toLowerCase();
        const query = searchQuery.toLowerCase().trim();
        const matchSearch = query === "" || nama.includes(query) || nis.includes(query);
        if (!matchSearch) return false;
        if (filter === "semua") return true;
        return normalizeStatusLabel(n.statusKehadiran) === filter;
    });

    const filterTabs = [
        { key: "semua", label: `Semua (${absensi.length})` },
        { key: "hadir", label: `Hadir (${countByStatus("hadir")})` },
        { key: "izin",  label: `Izin (${countByStatus("izin")})` },
        { key: "sakit", label: `Sakit (${countByStatus("sakit")})` },
        { key: "alpha", label: `Alpha (${countByStatus("alpha")})` },
    ];

    const tabStyle = (key) => ({
        padding: "10px 20px", fontWeight: "bold", fontSize: "13px", cursor: "pointer",
        border: `3px solid ${HappyHuesTheme.stroke}`,
        backgroundColor: filter === key ? HappyHuesTheme.highlight : HappyHuesTheme.main,
        color: filter === key ? (HappyHuesTheme.buttonText ?? HappyHuesTheme.stroke) : HappyHuesTheme.stroke,
        boxShadow: filter === key ? `4px 4px 0px ${HappyHuesTheme.stroke}` : "none",
        transform: filter === key ? "translate(-2px, -2px)" : "none",
        transition: "all 0.1s ease-in-out", textTransform: "uppercase", letterSpacing: "0.5px",
    });

    return (
        <>
            <FormInputPresensi onSuccess={fetchAbsensi} />

            <div style={{ borderTop: `3px dashed ${HappyHuesTheme.stroke}`, margin: "24px 0", opacity: 0.4 }} />

            <StyledCard title="📅 Data Presensi Siswa" accentColor={HappyHuesTheme.tertiary}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {filterTabs.map((tab) => (
                            <button key={tab.key} onClick={() => setFilter(tab.key)} style={tabStyle(tab.key)}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input
                            type="text"
                            placeholder="🔍 Cari nama / NIS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                padding: "10px 14px", border: `3px solid ${HappyHuesTheme.stroke}`,
                                backgroundColor: HappyHuesTheme.main, fontWeight: "bold",
                                fontSize: "13px", outline: "none", minWidth: "200px",
                            }}
                        />
                        <StyledButton label="🔄 Refresh" type="secondary" onClick={fetchAbsensi} style={{ opacity: loading ? 0.5 : 1 }} />
                    </div>
                </div>
            </StyledCard>

            {error && (
                <div style={{ padding: "16px 20px", marginBottom: "20px", backgroundColor: "#fff0f0", border: `3px solid ${HappyHuesTheme.secondary}`, color: HappyHuesTheme.secondary, fontWeight: "bold" }}>
                    ⚠️ {error}
                </div>
            )}

            <StyledCard accentColor={HappyHuesTheme.tertiary}>
                {loading ? <LoadingSkeleton />
                    : filtered.length === 0 ? <EmptyState message="Tidak Ada Data Absensi" />
                    : filtered.map((item) => (
                        <AbsensiItem key={item.idPresensi} item={item} onDelete={handleDelete} />
                    ))
                }
            </StyledCard>
        </>
    );
};

// ─────────────────────────────────────────────
// VIEW SISWA
// ─────────────────────────────────────────────
const ViewSiswa = ({ idAnggota }) => {
    const [absensi, setAbsensi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    const fetchAbsensiSaya = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data   = await AbsensiResponse.getAll();
            const raw    = Array.isArray(data) ? data : (data?.data ?? []);
            const normal = raw.map(normalizeAbsensiItem);
            setAbsensi(idAnggota ? normal.filter((n) => n.idAnggota === idAnggota) : normal);
        } catch {
            setError("Gagal memuat data absensi.");
        } finally {
            setLoading(false);
        }
    }, [idAnggota]);

    useEffect(() => { fetchAbsensiSaya(); }, [fetchAbsensiSaya]);

    const countStatus = (label) =>
        absensi.filter((n) => normalizeStatusLabel(n.statusKehadiran) === label).length;
    const hadirCount = countStatus("hadir");
    const alphaCount = countStatus("alpha");
    const persen     = absensi.length > 0 ? ((hadirCount / absensi.length) * 100).toFixed(0) : 0;

    return (
        <>
            <StyledCard title="📊 Rekap Kehadiran Saya" accentColor={HappyHuesTheme.highlight}>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    {[
                        { label: "Total Pertemuan", value: absensi.length,          icon: "📅", color: HappyHuesTheme.tertiary  },
                        { label: "Hadir",            value: hadirCount,              icon: "✅", color: "#d4f5d4"                },
                        { label: "Izin",             value: countStatus("izin"),     icon: "📝", color: "#fff3cd"                },
                        { label: "Sakit",            value: countStatus("sakit"),    icon: "🤒", color: "#dce8ff"                },
                        { label: "Alpha",            value: alphaCount,              icon: "❌", color: "#ffd6d6"                },
                        { label: "% Hadir",          value: `${persen}%`,            icon: "📈", color: HappyHuesTheme.highlight },
                    ].map((stat) => (
                        <div key={stat.label} style={{ flex: "1 1 90px", padding: "14px", backgroundColor: stat.color, border: `3px solid ${HappyHuesTheme.stroke}`, boxShadow: `4px 4px 0px ${HappyHuesTheme.stroke}`, textAlign: "center" }}>
                            <div style={{ fontSize: "22px" }}>{stat.icon}</div>
                            <div style={{ fontWeight: "900", fontSize: "18px", color: HappyHuesTheme.stroke }}>{stat.value}</div>
                            <div style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", color: HappyHuesTheme.paragraph }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Progress bar */}
                <div style={{ marginTop: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontWeight: "bold", fontSize: "12px", color: HappyHuesTheme.paragraph, textTransform: "uppercase" }}>Persentase Kehadiran</span>
                        <span style={{ fontWeight: "900", fontSize: "14px", color: Number(persen) >= 75 ? "#1a6b1a" : "#8b0000" }}>{persen}%</span>
                    </div>
                    <div style={{ height: "16px", backgroundColor: "#f0f0f0", border: `2px solid ${HappyHuesTheme.stroke}` }}>
                        <div style={{ height: "100%", width: `${persen}%`, backgroundColor: Number(persen) >= 75 ? "#1a6b1a" : "#8b0000", transition: "width 0.5s ease" }} />
                    </div>
                    {Number(persen) < 75 && absensi.length > 0 && (
                        <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#8b0000", fontWeight: "bold" }}>
                            ⚠️ Kehadiranmu di bawah 75%. Perlu perhatian!
                        </p>
                    )}
                </div>
            </StyledCard>

            {error && (
                <div style={{ padding: "12px 16px", marginBottom: "12px", backgroundColor: "#fff0f0", border: `2px solid ${HappyHuesTheme.secondary}`, color: HappyHuesTheme.secondary, fontWeight: "bold", fontSize: "13px" }}>
                    ⚠️ {error}
                </div>
            )}

            <StyledCard title="🗓️ Riwayat Kehadiran" accentColor={HappyHuesTheme.tertiary}>
                {loading ? <LoadingSkeleton />
                    : absensi.length === 0 ? <EmptyState message="Belum Ada Catatan Kehadiran" />
                    : absensi.map((item) => {
                        const st = getStatusStyle(item.statusKehadiran);
                        return (
                            <div key={item.idPresensi} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "14px 18px", marginBottom: "10px", backgroundColor: HappyHuesTheme.main, border: `3px solid ${HappyHuesTheme.stroke}`, boxShadow: `4px 4px 0px ${HappyHuesTheme.stroke}` }}>
                                <div style={{ minWidth: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: st.bg, border: `2px solid ${HappyHuesTheme.stroke}`, fontSize: "22px", flexShrink: 0 }}>
                                    {st.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontWeight: "900", fontSize: "13px", color: HappyHuesTheme.stroke, textTransform: "uppercase" }}>
                                        Pertemuan ke-{item.tugasKe}
                                    </p>
                                    <span style={{ fontSize: "12px", color: HappyHuesTheme.paragraph }}>
                                        📅 {formatTanggal(item.tanggalPenilaian)}
                                    </span>
                                </div>
                                <div style={{ padding: "4px 14px", fontWeight: "900", fontSize: "11px", textTransform: "uppercase", backgroundColor: st.bg, color: st.color, border: `2px solid ${HappyHuesTheme.stroke}`, letterSpacing: "0.5px" }}>
                                    {st.label}
                                </div>
                            </div>
                        );
                    })
                }
            </StyledCard>
        </>
    );
};

// ─────────────────────────────────────────────
// Halaman Utama: AbsensiFitur
// ─────────────────────────────────────────────
const AbsensiFitur = ({ role = "Guru", idAnggota }) => {
    const isGuru = role.toLowerCase() === "guru";
    return (
        <DashboardLayout role={role} activeMenu="Presensi">
            <PageContainer>
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    padding: "8px 18px", marginBottom: "20px",
                    backgroundColor: isGuru ? HappyHuesTheme.highlight : HappyHuesTheme.tertiary,
                    border: `3px solid ${HappyHuesTheme.stroke}`,
                    boxShadow: `3px 3px 0px ${HappyHuesTheme.stroke}`,
                    fontWeight: "900", fontSize: "13px", textTransform: "uppercase",
                    letterSpacing: "1px", color: HappyHuesTheme.stroke,
                }}>
                    {isGuru ? "👩‍🏫 Mode Guru — Input & Kelola Presensi" : "👨‍🎓 Mode Siswa — Pantau Kehadiran Saya"}
                </div>
                {isGuru ? <ViewGuru /> : <ViewSiswa idAnggota={idAnggota} />}
            </PageContainer>
        </DashboardLayout>
    );
};

export default AbsensiFitur;