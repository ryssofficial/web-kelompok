import React, { useState, useCallback, useMemo } from "react";
import { HappyHuesTheme, StyledCard, DataTable, StyledButton } from "../Components/BaseComponents";
import { JadwalLayout, HARI_LIST } from "../Components/JadwalLayout/JadwalLayout";
import { JadwalBuilder, jadwalManager } from "../Components/JadwalLayout/JadwalBuilder";

// ─────────────────────────────────────────────
// Konstanta
// ─────────────────────────────────────────────
const HEADERS_TABLE = ['No', 'Hari', 'Mata Pelajaran', 'Guru', 'Jam Mulai', 'Jam Selesai', 'Ruangan', 'Kelas', 'Aksi'];

const INPUT_FIELDS = [
    { name: 'hari',       label: 'Hari',          type: 'select',  options: HARI_LIST },
    { name: 'mapel',      label: 'Mata Pelajaran', type: 'text',    placeholder: 'contoh: Matematika' },
    { name: 'guru',       label: 'Nama Guru',      type: 'text',    placeholder: 'contoh: Pak Budi' },
    { name: 'jamMulai',  label: 'Jam Mulai',      type: 'time' },
    { name: 'jamSelesai',label: 'Jam Selesai',    type: 'time' },
    { name: 'ruangan',    label: 'Ruangan',        type: 'text',    placeholder: 'contoh: R-101' },
    { name: 'kelas',      label: 'Kelas',          type: 'text',    placeholder: 'contoh: X IPA 1' },
];

const BLANK_FORM = { hari: 'Senin', mapel: '', guru: '', jamMulai: '', jamSelesai: '', ruangan: '', kelas: '' };

// ─────────────────────────────────────────────
// Sub-komponen : FormInput
// ─────────────────────────────────────────────
const inputStyle = {
    width         : '100%',
    padding       : '10px 14px',
    fontSize      : '14px',
    fontWeight    : 'bold',
    border        : `3px solid ${HappyHuesTheme.stroke}`,
    backgroundColor: HappyHuesTheme.background,
    color         : HappyHuesTheme.main,
    boxSizing     : 'border-box',
    outline       : 'none',
    fontFamily    : 'inherit',
};

const FormInput = React.memo(({ field, value, onChange }) => {
    if (field.type === 'select') {
        return (
            <select value={value} onChange={e => onChange(field.name, e.target.value)} style={inputStyle}>
                {field.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
        );
    }
    return (
        <input
            type={field.type}
            value={value}
            placeholder={field.placeholder || ''}
            onChange={e => onChange(field.name, e.target.value)}
            style={inputStyle}
        />
    );
});

FormInput.displayName = 'FormInput';

// ─────────────────────────────────────────────
// Sub-komponen : ModalTambah / Edit
// ─────────────────────────────────────────────
const Modal = ({ isOpen, onClose, onSubmit, form, onChange, isEdit, error }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position       : 'fixed', inset: 0, zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.75)',
            display        : 'flex', alignItems: 'center', justifyContent: 'center',
            padding        : '20px',
        }}>
            <div style={{
                backgroundColor: HappyHuesTheme.main,
                border         : `5px solid ${HappyHuesTheme.stroke}`,
                boxShadow      : `12px 12px 0px ${HappyHuesTheme.stroke}`,
                padding        : '40px',
                width          : '100%',
                maxWidth       : '560px',
                maxHeight      : '90vh',
                overflowY      : 'auto',
            }}>
                {/* Modal Header */}
                <div style={{
                    borderBottom  : `4px solid ${HappyHuesTheme.stroke}`,
                    marginBottom  : '30px',
                    paddingBottom : '15px',
                    display       : 'flex',
                    justifyContent: 'space-between',
                    alignItems    : 'center',
                }}>
                    <h2 style={{ margin: 0, color: HappyHuesTheme.tertiary, textTransform: 'uppercase' }}>
                        {isEdit ? '✏️ Edit Jadwal' : '➕ Tambah Jadwal'}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background : 'none',
                            border     : `3px solid ${HappyHuesTheme.stroke}`,
                            cursor     : 'pointer',
                            fontSize   : '18px',
                            padding    : '4px 10px',
                            fontWeight : 'bold',
                            color      : HappyHuesTheme.stroke,
                        }}
                    >✕</button>
                </div>

                {/* Error banner */}
                {error && (
                    <div style={{
                        backgroundColor: HappyHuesTheme.secondary,
                        color          : HappyHuesTheme.buttonText,
                        border         : `3px solid ${HappyHuesTheme.stroke}`,
                        padding        : '12px 16px',
                        marginBottom   : '20px',
                        fontWeight     : 'bold',
                        fontSize       : '13px',
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Form fields */}
                <div style={{ display: 'grid', gap: '18px' }}>
                    {INPUT_FIELDS.map(field => (
                        <div key={field.name}>
                            <label style={{
                                display      : 'block',
                                marginBottom : '6px',
                                fontWeight   : 'bold',
                                fontSize     : '13px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                color        : HappyHuesTheme.stroke,
                            }}>
                                {field.label}
                            </label>
                            <FormInput field={field} value={form[field.name]} onChange={onChange} />
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '30px', justifyContent: 'flex-end' }}>
                    <StyledButton label="Batal" type="secondary" onClick={onClose} color={HappyHuesTheme.paragraph} />
                    <StyledButton label={isEdit ? 'Simpan Perubahan' : 'Tambah'} onClick={onSubmit} />
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// Sub-komponen : Statistik Card Row
// ─────────────────────────────────────────────
const StatBadge = React.memo(({ label, nilai, color }) => (
    <div style={{
        backgroundColor: color,
        border         : `3px solid ${HappyHuesTheme.stroke}`,
        boxShadow      : `6px 6px 0px ${HappyHuesTheme.stroke}`,
        padding        : '20px 28px',
        textAlign      : 'center',
        flex           : '1 1 140px',
    }}>
        <div style={{ fontSize: '32px', fontWeight: '900', color: HappyHuesTheme.buttonText }}>{nilai}</div>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: HappyHuesTheme.buttonText, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
            {label}
        </div>
    </div>
));

StatBadge.displayName = 'StatBadge';

// ─────────────────────────────────────────────
// MAIN EXPORT : JadwalPage
// ─────────────────────────────────────────────
const JadwalPage = ({ role = 'Guru' }) => {
    // ── State ──────────────────────────────────────────────────────────────
    const [jadwalData, setJadwalData]   = useState(() => jadwalManager.getAll());
    const [activeHari, setActiveHari]   = useState('Semua');
    const [modalOpen, setModalOpen]     = useState(false);
    const [editTarget, setEditTarget]   = useState(null); 
    const [form, setForm]               = useState(BLANK_FORM);
    const [formError, setFormError]     = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null); 
    const [toast, setToast]             = useState(null);    

    // ── Helpers ────────────────────────────────────────────────────────────
    const refresh = useCallback(() => setJadwalData(jadwalManager.getAll()), []);

    const showToast = useCallback((msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const handleFormChange = useCallback((name, value) => {
        setForm(prev => ({ ...prev, [name]: value }));
        setFormError('');
    }, []);

    // ── Menghindari komputasi ulang filter jika data/hari tidak berubah ──
    const filteredData = useMemo(() => {
        return activeHari === 'Semua'
            ? jadwalData
            : jadwalData.filter(j => j.hari === activeHari);
    }, [jadwalData, activeHari]);

    // ── Aksi pemicu Edit ──────────────────────────────────────────────────
    const pemicuEdit = useCallback((j) => {
        setEditTarget(j);
        setForm({
            hari: j.hari,
            mapel: j.mapel,
            guru: j.guru,
            jamMulai: j.jamMulai,
            jamSelesai: j.jamSelesai,
            ruangan: j.ruangan,
            kelas: j.kelas,
        });
        setFormError('');
        setModalOpen(true);
    }, []);

    // ── Transformasi data untuk baris DataTable (Menggunakan useMemo) ──────
    const tableRows = useMemo(() => {
        return filteredData.map((j, idx) => [
            idx + 1,
            j.hari,
            j.mapel,
            j.guru,
            j.jamMulai,
            j.jamSelesai,
            j.ruangan,
            j.kelas,
            role === 'Guru' ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <StyledButton
                        label="✏️ Edit"
                        padding="6px 12px"
                        fontSize="12px"
                        color={HappyHuesTheme.tertiary}
                        onClick={() => pemicuEdit(j)}
                    />
                    <StyledButton
                        label="🗑️ Hapus"
                        padding="6px 12px"
                        fontSize="12px"
                        color={HappyHuesTheme.secondary}
                        onClick={() => setDeleteConfirm(j.id)}
                    />
                </div>
            ) : '—',
        ]);
    }, [filteredData, role, pemicuEdit]);

    // ── Submit tambah / edit ───────────────────────────────────────────────
    const handleSubmit = () => {
        try {
            if (editTarget) {
                const updated = new JadwalBuilder()
                    .setId(editTarget.id)
                    .setHari(form.hari)
                    .setMapel(form.mapel)
                    .setGuru(form.guru)
                    .setJam(form.jamMulai, form.jamSelesai)
                    .setRuangan(form.ruangan)
                    .setKelas(form.kelas)
                    .build();
                jadwalManager.update(updated);
                showToast('✅ Jadwal berhasil diperbarui!');
            } else {
                const baru = new JadwalBuilder()
                    .setHari(form.hari)
                    .setMapel(form.mapel)
                    .setGuru(form.guru)
                    .setJam(form.jamMulai, form.jamSelesai)
                    .setRuangan(form.ruangan)
                    .setKelas(form.kelas)
                    .build();
                jadwalManager.tambah(baru);
                showToast('✅ Jadwal berhasil ditambahkan!');
            }
            refresh();
            setModalOpen(false);
            setEditTarget(null);
            setForm(BLANK_FORM);
        } catch (err) {
            setFormError(err.message);
        }
    };

    // ── Hapus ──────────────────────────────────────────────────────────────
    const handleHapus = (id) => {
        try {
            jadwalManager.hapus(id);
            refresh();
            setDeleteConfirm(null);
            showToast('🗑️ Jadwal dihapus.');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    // ── Statistik (Menggunakan useMemo agar hemat memori) ──────────────────
    const stats = useMemo(() => {
        return {
            unikGuru: [...new Set(jadwalData.map(j => j.guru))].length,
            unikMapel: [...new Set(jadwalData.map(j => j.mapel))].length,
            unikKelas: [...new Set(jadwalData.map(j => j.kelas))].length,
        };
    }, [jadwalData]);

    return (
        <>
            {/* ── TOAST ─────────────────────────────────────────────────── */}
            {toast && (
                <div style={{
                    position       : 'fixed',
                    bottom         : '30px',
                    right          : '30px',
                    zIndex         : 9999,
                    backgroundColor: toast.type === 'error' ? HappyHuesTheme.secondary : HappyHuesTheme.button,
                    color          : HappyHuesTheme.buttonText,
                    border         : `4px solid ${HappyHuesTheme.stroke}`,
                    boxShadow      : `6px 6px 0px ${HappyHuesTheme.stroke}`,
                    padding        : '16px 24px',
                    fontWeight     : 'bold',
                    fontSize       : '15px',
                    maxWidth       : '360px',
                }}>
                    {toast.msg}
                </div>
            )}

            {/* ── MODAL KONFIRMASI HAPUS ─────────────────────────────────── */}
            {deleteConfirm && (
                <div style={{
                    position       : 'fixed', inset: 0, zIndex: 1000,
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    display        : 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <div style={{
                        backgroundColor: HappyHuesTheme.main,
                        border         : `5px solid ${HappyHuesTheme.stroke}`,
                        boxShadow      : `12px 12px 0px ${HappyHuesTheme.stroke}`,
                        padding        : '40px',
                        maxWidth       : '420px',
                        width          : '100%',
                        textAlign      : 'center',
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                        <h3 style={{ margin: '0 0 12px', textTransform: 'uppercase' }}>Hapus Jadwal?</h3>
                        <p style={{ color: HappyHuesTheme.paragraph, fontWeight: 'bold', marginBottom: '28px' }}>
                            Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            <StyledButton label="Batal"  onClick={() => setDeleteConfirm(null)} color={HappyHuesTheme.paragraph} />
                            <StyledButton label="Hapus!" onClick={() => handleHapus(deleteConfirm)} color={HappyHuesTheme.secondary} />
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL TAMBAH / EDIT ────────────────────────────────────── */}
            <Modal
                isOpen={modalOpen}
                isEdit={!!editTarget}
                form={form}
                error={formError}
                onChange={handleFormChange}
                onClose={() => { setModalOpen(false); setEditTarget(null); setForm(BLANK_FORM); setFormError(''); }}
                onSubmit={handleSubmit}
            />

            {/* ── LAYOUT UTAMA ───────────────────────────────────────────── */}
            <JadwalLayout
                role={role}
                activeMenu={role === 'Guru' ? 'Jadwal Mengajar' : 'Jadwal Pelajaran'}
                jadwalData={jadwalData}
                activeHari={activeHari}
                onHariChange={setActiveHari}
            >
                {/* ── STATISTIK ─────────────────────────────────────────── */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '30px' }}>
                    <StatBadge label="Total Sesi"     nilai={jadwalData.length} color={HappyHuesTheme.button} />
                    <StatBadge label="Mata Pelajaran" nilai={stats.unikMapel}         color={HappyHuesTheme.tertiary} />
                    <StatBadge label="Guru / Pengajar" nilai={stats.unikGuru}          color={HappyHuesTheme.secondary} />
                    <StatBadge label="Kelas"          nilai={stats.unikKelas}          color='#3da9fc' />
                </div>

                {/* ── TABEL JADWAL ──────────────────────────────────────── */}
                <StyledCard
                    title={`Jadwal ${activeHari === 'Semua' ? 'Semua Hari' : activeHari} (${filteredData.length} sesi)`}
                    accentColor={HappyHuesTheme.button}
                >
                    {/* Tombol Tambah — hanya untuk Guru */}
                    {role === 'Guru' && (
                        <div style={{ marginBottom: '20px' }}>
                            <StyledButton
                                label="➕ Tambah Jadwal"
                                onClick={() => {
                                    setEditTarget(null);
                                    setForm(BLANK_FORM);
                                    setFormError('');
                                    setModalOpen(true);
                                }}
                            />
                        </div>
                    )}

                    {filteredData.length === 0 ? (
                        <div style={{
                            textAlign      : 'center',
                            padding        : '60px 20px',
                            border         : `3px dashed ${HappyHuesTheme.stroke}`,
                            color          : HappyHuesTheme.paragraph,
                            fontWeight     : 'bold',
                            fontSize       : '16px',
                        }}>
                            📭 Tidak ada jadwal untuk hari ini.
                        </div>
                    ) : (
                        <DataTable
                            headers={HEADERS_TABLE}
                            data={tableRows}
                            themeColor={HappyHuesTheme.highlight}
                        />
                    )}
                </StyledCard>

                {/* ── JADWAL PER HARI (ringkasan) — hanya di mode "Semua" ── */}
                {activeHari === 'Semua' && (
                    <StyledCard title="Ringkasan Per Hari" accentColor={HappyHuesTheme.tertiary}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                            {HARI_LIST.map(hari => {
                                const list = jadwalData.filter(j => j.hari === hari);
                                return (
                                    <div
                                        key={hari}
                                        onClick={() => setActiveHari(hari)}
                                        style={{
                                            border         : `3px solid ${HappyHuesTheme.stroke}`,
                                            boxShadow      : `4px 4px 0px ${HappyHuesTheme.stroke}`,
                                            padding        : '16px',
                                            cursor         : 'pointer',
                                            backgroundColor: HappyHuesTheme.background,
                                            transition     : 'transform 0.1s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'translate(-2px,-2px)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                                    >
                                        <div style={{
                                            fontWeight     : '900',
                                            fontSize       : '16px',
                                            color          : HappyHuesTheme.highlight,
                                            textTransform  : 'uppercase',
                                            marginBottom   : '10px',
                                            borderBottom   : `2px solid ${HappyHuesTheme.stroke}`,
                                            paddingBottom  : '8px',
                                        }}>
                                            {hari} — {list.length} sesi
                                        </div>
                                        {list.length === 0 ? (
                                            <p style={{ color: HappyHuesTheme.paragraph, fontWeight: 'bold', margin: 0, fontSize: '13px' }}>
                                                Tidak ada jadwal
                                            </p>
                                        ) : list.map(j => (
                                            <div key={j.id} style={{
                                                fontSize    : '13px',
                                                fontWeight  : 'bold',
                                                color       : HappyHuesTheme.main,
                                                marginBottom: '8px',
                                                display     : 'flex',
                                                gap         : '8px',
                                                alignItems  : 'center',
                                            }}>
                                                <span style={{
                                                    backgroundColor: HappyHuesTheme.tertiary,
                                                    color          : HappyHuesTheme.buttonText,
                                                    padding        : '2px 6px',
                                                    fontSize       : '11px',
                                                    border         : `1px solid ${HappyHuesTheme.stroke}`,
                                                    borderRadius   : '2px'
                                                }}>
                                                    {j.jamMulai}
                                                </span>
                                                <span style={{
                                                    flex: 1,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {j.mapel}
                                                </span>
                                                <span style={{ color: HappyHuesTheme.paragraph, fontSize: '11px' }}>
                                                    ({j.kelas})
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </StyledCard>
                )}
            </JadwalLayout>
        </>
    );
};

export default JadwalPage