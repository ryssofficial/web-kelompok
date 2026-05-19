import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { KasFitur } from "../API/EriskaFitur/KasResponse";
import { TabunganFitur } from "../API/EriskaFitur/TabunganResponse";
import { AxiosConfig } from "../API/AxiosConfig";
import { DashboardLayout } from "../Components/DashboardLayout";

// DeleteButton di-inline agar tidak bergantung pada path eksternal
const DeleteButton = ({ id, onDelete }) => (
    <button
        onClick={() => onDelete(id)}
        style={{
            background: "#fee2e2", color: "#dc2626",
            border: "1px solid #fca5a5", borderRadius: 6,
            padding: "5px 12px", fontSize: 12,
            cursor: "pointer", fontWeight: 600,
        }}
    >
        🗑️ Hapus
    </button>
);

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka ?? 0);

const formatTanggal = (iso) =>
    iso ? new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "-";

// ─── Sub-Components ──────────────────────────────────────────────────────────

/** Kartu saldo ringkasan */
const SaldoCard = ({ label, nominal, warna }) => (
    <div style={{
        background: warna || "#f0fdf4",
        borderRadius: 12,
        padding: "20px 24px",
        minWidth: 180,
        flex: 1,
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
    }}>
        <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>{label}</p>
        <p style={{ margin: "6px 0 0", fontSize: 22, fontWeight: 700, color: "#1e293b" }}>{formatRupiah(nominal)}</p>
    </div>
);

/** Tabel riwayat transaksi generik */
const TabelRiwayat = ({ data, kolom, onHapus, isGuru }) => (
    <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
                <tr style={{ background: "#f1f5f9" }}>
                    {kolom.map((k) => (
                        <th key={k.key} style={{ padding: "10px 14px", textAlign: "left", color: "#475569", fontWeight: 600 }}>
                            {k.label}
                        </th>
                    ))}
                    {isGuru && <th style={{ padding: "10px 14px", color: "#475569" }}>Aksi</th>}
                </tr>
            </thead>
            <tbody>
                {data.length === 0 ? (
                    <tr>
                        <td colSpan={kolom.length + (isGuru ? 1 : 0)}
                            style={{ textAlign: "center", padding: 24, color: "#94a3b8" }}>
                            Belum ada data transaksi.
                        </td>
                    </tr>
                ) : (
                    data.map((row, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
                            {kolom.map((k) => (
                                <td key={k.key} style={{ padding: "10px 14px", color: "#334155" }}>
                                    {k.format ? k.format(row[k.key]) : row[k.key] ?? "-"}
                                </td>
                            ))}
                            {isGuru && (
                                <td style={{ padding: "10px 14px" }}>
                                    <DeleteButton id={row.id} onDelete={onHapus} />
                                </td>
                            )}
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>
);

/** Form input transaksi (pemasukkan / pengeluaran) */
const FormTransaksi = ({ onSubmit, loading, tipe }) => {
    const [jumlah, setJumlah] = useState("");
    const [keterangan, setKeterangan] = useState("");

    const handleSubmit = () => {
        if (!jumlah || isNaN(jumlah) || Number(jumlah) <= 0) {
            alert("Jumlah harus angka positif!");
            return;
        }
        onSubmit({ jumlah: Number(jumlah), keterangan });
        setJumlah("");
        setKeterangan("");
    };

    const warna = tipe === "masuk" ? "#16a34a" : "#dc2626";

    return (
        <div style={{
            background: "#f8fafc",
            borderRadius: 10,
            padding: "16px 20px",
            border: `1.5px solid ${tipe === "masuk" ? "#bbf7d0" : "#fecaca"}`,
            marginBottom: 12
        }}>
            <p style={{ margin: "0 0 12px", fontWeight: 600, color: warna, fontSize: 14 }}>
                {tipe === "masuk" ? "➕ Tambah Pemasukkan" : "➖ Tambah Pengeluaran"}
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input
                    type="number"
                    placeholder="Jumlah (Rp)"
                    value={jumlah}
                    onChange={(e) => setJumlah(e.target.value)}
                    style={inputStyle}
                />
                <input
                    type="text"
                    placeholder="Keterangan (opsional)"
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    style={{ ...inputStyle, flex: 2 }}
                />
                <button onClick={handleSubmit} disabled={loading} style={{
                    background: warna, color: "#fff", border: "none",
                    borderRadius: 8, padding: "10px 20px", cursor: "pointer",
                    fontWeight: 600, fontSize: 13, opacity: loading ? 0.7 : 1
                }}>
                    {loading ? "Menyimpan..." : "Simpan"}
                </button>
            </div>
        </div>
    );
};

const inputStyle = {
    border: "1px solid #cbd5e1", borderRadius: 8,
    padding: "10px 12px", fontSize: 13, flex: 1, minWidth: 140,
    outline: "none", color: "#1e293b", background: "#fff"
};

// ─── Section: Kas Kelas ──────────────────────────────────────────────────────

const SectionKas = ({ idKas, idGuru, isGuru }) => {
    const [saldo, setSaldo] = useState(0);
    const [pemasukkan, setPemasukkan] = useState([]);
    const [pengeluaran, setPengeluaran] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadData, setLoadData] = useState(true);

    const fetchData = useCallback(async () => {
        if (!idKas) return;
        setLoadData(true);
        try {
            const [kasData, masuk, keluar] = await Promise.all([
                KasFitur.getKasByRombel(idKas),
                KasFitur.getRiwayatPemasukkan(idKas),
                KasFitur.getRiwayatPengeluaran(idKas),
            ]);
            setSaldo(kasData?.saldo_kas ?? 0);
            setPemasukkan(Array.isArray(masuk) ? masuk : []);
            setPengeluaran(Array.isArray(keluar) ? keluar : []);
        } catch (err) {
            console.error("Gagal fetch data kas:", err);
        } finally {
            setLoadData(false);
        }
    }, [idKas]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleTambahMasuk = async ({ jumlah, keterangan }) => {
        setLoading(true);
        try {
            await KasFitur.tambahPemasukkan({ id_kas: idKas, id_guru: idGuru, jumlah_masuk: jumlah, keterangan });
            await fetchData();
        } catch (err) {
            alert("Gagal menambah pemasukkan: " + (err?.message || JSON.stringify(err)));
        } finally {
            setLoading(false);
        }
    };

    const handleTambahKeluar = async ({ jumlah, keterangan }) => {
        setLoading(true);
        try {
            await KasFitur.tambahPengeluaran({ id_kas: idKas, id_guru: idGuru, jumlah_keluar: jumlah, keterangan });
            await fetchData();
        } catch (err) {
            alert("Gagal menambah pengeluaran: " + (err?.message || JSON.stringify(err)));
        } finally {
            setLoading(false);
        }
    };

    const handleHapusMasuk = async (id) => {
        if (!window.confirm("Hapus data pemasukkan ini?")) return;
        try {
            await KasFitur.hapusPemasukkan(id);
            await fetchData();
        } catch (err) {
            alert("Gagal hapus: " + (err?.message || JSON.stringify(err)));
        }
    };

    const handleHapusKeluar = async (id) => {
        if (!window.confirm("Hapus data pengeluaran ini?")) return;
        try {
            await KasFitur.hapusPengeluaran(id);
            await fetchData();
        } catch (err) {
            alert("Gagal hapus: " + (err?.message || JSON.stringify(err)));
        }
    };

    const kolomMasuk = [
        { key: "tanggal_masuk", label: "Tanggal", format: formatTanggal },
        { key: "jumlah_masuk", label: "Jumlah", format: formatRupiah },
        { key: "keterangan", label: "Keterangan" },
    ];
    const kolomKeluar = [
        { key: "tanggal_keluar", label: "Tanggal", format: formatTanggal },
        { key: "jumlah_keluar", label: "Jumlah", format: formatRupiah },
        { key: "keterangan", label: "Keterangan" },
    ];

    if (loadData) return <p style={{ color: "#94a3b8", padding: 20 }}>Memuat data kas...</p>;

    return (
        <div>
            {/* Ringkasan Saldo */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
                <SaldoCard label="Saldo Kas Kelas" nominal={saldo} warna="#f0fdf4" />
                <SaldoCard label="Total Pemasukkan"
                    nominal={pemasukkan.reduce((a, b) => a + Number(b.jumlah_masuk || 0), 0)}
                    warna="#eff6ff" />
                <SaldoCard label="Total Pengeluaran"
                    nominal={pengeluaran.reduce((a, b) => a + Number(b.jumlah_keluar || 0), 0)}
                    warna="#fff7ed" />
            </div>

            {/* Form Input - hanya guru */}
            {isGuru && (
                <div style={{ marginBottom: 24 }}>
                    <FormTransaksi onSubmit={handleTambahMasuk} loading={loading} tipe="masuk" />
                    <FormTransaksi onSubmit={handleTambahKeluar} loading={loading} tipe="keluar" />
                </div>
            )}

            {/* Riwayat Pemasukkan */}
            <div style={{ marginBottom: 24 }}>
                <h4 style={{ margin: "0 0 10px", color: "#16a34a", fontSize: 14 }}>📥 Riwayat Pemasukkan Kas</h4>
                <TabelRiwayat
                    data={pemasukkan.map((d) => ({ ...d, id: d.id_pemasukkan_kas }))}
                    kolom={kolomMasuk}
                    onHapus={handleHapusMasuk}
                    isGuru={isGuru}
                />
            </div>

            {/* Riwayat Pengeluaran */}
            <div>
                <h4 style={{ margin: "0 0 10px", color: "#dc2626", fontSize: 14 }}>📤 Riwayat Pengeluaran Kas</h4>
                <TabelRiwayat
                    data={pengeluaran.map((d) => ({ ...d, id: d.id_pengeluaran_kas }))}
                    kolom={kolomKeluar}
                    onHapus={handleHapusKeluar}
                    isGuru={isGuru}
                />
            </div>
        </div>
    );
};

// ─── Section: Tabungan Siswa ─────────────────────────────────────────────────

const SectionTabungan = ({ idRombel, idGuru, isGuru }) => {
    const [listTabungan, setListTabungan] = useState([]);
    const [selected, setSelected] = useState(null); // {id_tabungan, nama_siswa, saldo_total}
    const [riwayatSetor, setRiwayatSetor] = useState([]);
    const [riwayatTarik, setRiwayatTarik] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadData, setLoadData] = useState(true);
    const [loadRiwayat, setLoadRiwayat] = useState(false);

    const fetchList = useCallback(async () => {
        if (!idRombel) return;
        setLoadData(true);
        try {
            const data = await TabunganFitur.getTabunganByRombel(idRombel);
            setListTabungan(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Gagal fetch tabungan:", err);
        } finally {
            setLoadData(false);
        }
    }, [idRombel]);

    useEffect(() => { fetchList(); }, [fetchList]);

    const fetchRiwayat = async (id_tabungan) => {
        setLoadRiwayat(true);
        try {
            const [setor, tarik] = await Promise.all([
                TabunganFitur.getRiwayatSetor(id_tabungan),
                TabunganFitur.getRiwayatTarik(id_tabungan),
            ]);
            setRiwayatSetor(Array.isArray(setor) ? setor : []);
            setRiwayatTarik(Array.isArray(tarik) ? tarik : []);
        } catch (err) {
            console.error("Gagal fetch riwayat tabungan:", err);
        } finally {
            setLoadRiwayat(false);
        }
    };

    const handlePilihSiswa = (tabungan) => {
        setSelected(tabungan);
        fetchRiwayat(tabungan.id_tabungan);
    };

    const handleSetor = async ({ jumlah, keterangan }) => {
        setLoading(true);
        try {
            await TabunganFitur.setorTabungan({
                id_tabungan: selected.id_tabungan,
                id_guru: idGuru,
                jumlah_masuk: jumlah,
                keterangan,
            });
            await fetchList();
            await fetchRiwayat(selected.id_tabungan);
            // Update saldo selected
            setSelected((prev) => ({ ...prev, saldo_total: Number(prev.saldo_total) + jumlah }));
        } catch (err) {
            alert("Gagal setor: " + (err?.message || JSON.stringify(err)));
        } finally {
            setLoading(false);
        }
    };

    const handleTarik = async ({ jumlah, keterangan }) => {
        setLoading(true);
        try {
            await TabunganFitur.tarikTabungan({
                id_tabungan: selected.id_tabungan,
                id_guru: idGuru,
                jumlah_keluar: jumlah,
                keterangan,
            });
            await fetchList();
            await fetchRiwayat(selected.id_tabungan);
            setSelected((prev) => ({ ...prev, saldo_total: Number(prev.saldo_total) - jumlah }));
        } catch (err) {
            // Tangkap pesan dari trigger DB: fn_cek_saldo_tabungan_cukup
            alert("Gagal tarik: " + (err?.message || JSON.stringify(err)));
        } finally {
            setLoading(false);
        }
    };

    const handleHapusSetor = async (id) => {
        if (!window.confirm("Hapus data setor ini?")) return;
        try {
            await TabunganFitur.hapusSetor(id);
            await fetchList();
            await fetchRiwayat(selected.id_tabungan);
        } catch (err) {
            alert("Gagal hapus: " + (err?.message || JSON.stringify(err)));
        }
    };

    const handleHapusTarik = async (id) => {
        if (!window.confirm("Hapus data tarik ini?")) return;
        try {
            await TabunganFitur.hapusTarik(id);
            await fetchList();
            await fetchRiwayat(selected.id_tabungan);
        } catch (err) {
            alert("Gagal hapus: " + (err?.message || JSON.stringify(err)));
        }
    };

    const kolomSetor = [
        { key: "tanggal_masuk", label: "Tanggal", format: formatTanggal },
        { key: "jumlah_masuk", label: "Jumlah Setor", format: formatRupiah },
        { key: "keterangan", label: "Keterangan" },
    ];
    const kolomTarik = [
        { key: "tanggal_keluar", label: "Tanggal", format: formatTanggal },
        { key: "jumlah_keluar", label: "Jumlah Tarik", format: formatRupiah },
        { key: "keterangan", label: "Keterangan" },
    ];

    if (loadData) return <p style={{ color: "#94a3b8", padding: 20 }}>Memuat data tabungan...</p>;

    return (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>

            {/* Panel Kiri: Daftar Siswa */}
            <div style={{
                width: 240, flexShrink: 0,
                background: "#f8fafc", borderRadius: 12,
                border: "1px solid #e2e8f0", overflow: "hidden"
            }}>
                <div style={{ padding: "14px 16px", background: "#1e40af", color: "#fff" }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>👨‍🎓 Daftar Siswa</p>
                </div>
                {listTabungan.length === 0 ? (
                    <p style={{ padding: 16, color: "#94a3b8", fontSize: 13 }}>Tidak ada siswa.</p>
                ) : (
                    listTabungan.map((t) => (
                        <div
                            key={t.id_tabungan}
                            onClick={() => handlePilihSiswa(t)}
                            style={{
                                padding: "12px 16px", cursor: "pointer",
                                borderBottom: "1px solid #e2e8f0",
                                background: selected?.id_tabungan === t.id_tabungan ? "#dbeafe" : "#fff",
                                transition: "background 0.15s"
                            }}
                        >
                            <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "#1e293b" }}>
                                {t.nama_siswa || `Siswa #${t.id_anggota}`}
                            </p>
                            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b" }}>
                                {formatRupiah(t.saldo_total)}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* Panel Kanan: Detail Tabungan */}
            <div style={{ flex: 1, minWidth: 280 }}>
                {!selected ? (
                    <div style={{
                        textAlign: "center", padding: 40,
                        color: "#94a3b8", background: "#f8fafc",
                        borderRadius: 12, border: "1px dashed #cbd5e1"
                    }}>
                        <p style={{ fontSize: 32 }}>💳</p>
                        <p style={{ margin: 0, fontSize: 14 }}>Pilih siswa untuk melihat detail tabungan</p>
                    </div>
                ) : (
                    <>
                        {/* Header Detail */}
                        <div style={{
                            display: "flex", gap: 16, flexWrap: "wrap",
                            marginBottom: 20
                        }}>
                            <SaldoCard label={`Saldo — ${selected.nama_siswa || "Siswa"}`}
                                nominal={selected.saldo_total} warna="#eff6ff" />
                        </div>

                        {/* Form Setor & Tarik - hanya guru */}
                        {isGuru && (
                            <div style={{ marginBottom: 20 }}>
                                <FormTransaksi onSubmit={handleSetor} loading={loading} tipe="masuk" />
                                <FormTransaksi onSubmit={handleTarik} loading={loading} tipe="keluar" />
                            </div>
                        )}

                        {loadRiwayat ? (
                            <p style={{ color: "#94a3b8" }}>Memuat riwayat...</p>
                        ) : (
                            <>
                                <div style={{ marginBottom: 20 }}>
                                    <h4 style={{ margin: "0 0 10px", color: "#16a34a", fontSize: 14 }}>
                                        📥 Riwayat Setor
                                    </h4>
                                    <TabelRiwayat
                                        data={riwayatSetor.map((d) => ({ ...d, id: d.id_pemasukkan }))}
                                        kolom={kolomSetor}
                                        onHapus={handleHapusSetor}
                                        isGuru={isGuru}
                                    />
                                </div>
                                <div>
                                    <h4 style={{ margin: "0 0 10px", color: "#dc2626", fontSize: 14 }}>
                                        📤 Riwayat Tarik
                                    </h4>
                                    <TabelRiwayat
                                        data={riwayatTarik.map((d) => ({ ...d, id: d.id_pengeluaran }))}
                                        kolom={kolomTarik}
                                        onHapus={handleHapusTarik}
                                        isGuru={isGuru}
                                    />
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

// ─── Main Page ───────────────────────────────────────────────────────────────

const KeuanganPage = () => {
    const { role } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("kas");

    // Data guru & rombel di-fetch dari API
    const [idGuru, setIdGuru] = useState(null);
    const [idRombel, setIdRombel] = useState(null);
    const [idKas, setIdKas] = useState(null);
    const [isGuru, setIsGuru] = useState(false);
    const [loadInit, setLoadInit] = useState(true);
    const [errorInit, setErrorInit] = useState(null);

    useEffect(() => {
        // Redirect jika role tidak valid
        if (role !== "guru" && role !== "siswa") {
            navigate("/", { replace: true });
            return;
        }

        const init = async () => {
            setLoadInit(true);
            try {
                // Endpoint GET /api/auth/profile → { id_guru, role, id_rombel }
                const profile = await AxiosConfig.get("/auth/profile");

                const guru = profile?.id_guru ?? null;
                const rombel = profile?.id_rombel ?? null;
                const profileRole = profile?.role ?? "siswa";

                setIdGuru(guru);
                setIdRombel(rombel);
                setIsGuru(profileRole === "guru");

                // Ambil id_kas berdasarkan id_rombel
                if (rombel) {
                    try {
                        const kasData = await KasFitur.getKasByRombel(rombel);
                        setIdKas(kasData?.id_kas ?? null);
                    } catch {
                        setIdKas(null);
                    }
                }
            } catch (err) {
                setErrorInit("Gagal memuat data pengguna. Silakan coba lagi.");
                console.error("Init error:", err);
            } finally {
                setLoadInit(false);
            }
        };
        init();
    }, [role, navigate]);

    // ── Styles Tab ──
    const tabStyle = (tab) => ({
        padding: "10px 24px",
        border: "none",
        borderBottom: activeTab === tab ? "3px solid #1e40af" : "3px solid transparent",
        background: "transparent",
        color: activeTab === tab ? "#1e40af" : "#64748b",
        fontWeight: activeTab === tab ? 700 : 500,
        fontSize: 14,
        cursor: "pointer",
        transition: "all 0.15s",
    });

    if (loadInit) return (
        <DashboardLayout role={role || "siswa"} activeMenu="Keuangan">
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
                <p style={{ color: "#94a3b8", fontSize: 14 }}>⏳ Memuat halaman keuangan...</p>
            </div>
        </DashboardLayout>
    );

    if (errorInit) return (
        <DashboardLayout role={role || "siswa"} activeMenu="Keuangan">
            <div style={{ padding: 24, color: "#dc2626", background: "#fef2f2", borderRadius: 12 }}>
                ⚠️ {errorInit}
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout role={role || "siswa"} activeMenu="Keuangan">

            {/* Tab Navigation */}
            <div style={{
                display: "flex", borderBottom: "1px solid #e2e8f0",
                marginBottom: 24, gap: 4
            }}>
                <button style={tabStyle("kas")} onClick={() => setActiveTab("kas")}>
                    🏦 Kas Kelas
                </button>
                <button style={tabStyle("tabungan")} onClick={() => setActiveTab("tabungan")}>
                    💳 Tabungan Siswa
                </button>
            </div>

            {/* Konten Tab */}
            <div style={{
                background: "#fff", borderRadius: 14,
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                padding: "24px"
            }}>
                {activeTab === "kas" && (
                    <SectionKas
                        idKas={idKas}
                        idGuru={idGuru}
                        isGuru={isGuru}
                    />
                )}
                {activeTab === "tabungan" && (
                    <SectionTabungan
                        idRombel={idRombel}
                        idGuru={idGuru}
                        isGuru={isGuru}
                    />
                )}
            </div>

        </DashboardLayout>
    );
};

export default KeuanganPage;
