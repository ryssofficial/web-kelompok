import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { DashboardLayout } from "../Components/DashboardLayout"; 
import { PageContainer, StyledCard, DataTable, HappyHuesTheme } from "../Components/BaseComponents";
import { DeleteButton } from "../Components/Button/DeleteButton";
import { SubmitButton } from "../Components/Button/SubmitButton";
import { JadwalAPI } from "../API/JadwalResponse/JadwalMengajar";

export const JadwalPage = () => {
    const navigate = useNavigate(); 
    const [jadwalList, setJadwalList] = useState([]);
    const [formData, setFormData] = useState({
        hari: "",
        waktu: "",
        mataPelajaran: "", 
        kelas: ""
    });

    useEffect(() => {
        fetchJadwal();
    }, []);

    const fetchJadwal = async () => {
        try {
            setJadwalList([
                { id: 1, hari: "Senin", waktu: "07:00 - 08:30", mataPelajaran: "Pemrograman Web", kelas: "XII RPL 1" },
                { id: 2, hari: "Selasa", waktu: "08:30 - 10:00", mataPelajaran: "Basis Data", kelas: "XI RPL 2" },
            ]);
        } catch (error) {
            console.error("Gagal mengambil data jadwal:", error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Data akan disimpan:", formData);
            alert("Jadwal berhasil ditambahkan!");
            fetchJadwal(); 
            setFormData({ hari: "", waktu: "", mataPelajaran: "", kelas: "" }); 
        } catch (error) {
            console.error("Gagal menyimpan jadwal:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Apakah kamu yakin ingin menghapus jadwal ini?")) {
            try {
                setJadwalList(jadwalList.filter(item => item.id !== id));
            } catch (error) {
                console.error("Gagal menghapus jadwal:", error);
            }
        }
    };

    const tableHeaders = ["Hari", "Waktu", "Mata Pelajaran", "Kelas", "Aksi"];
    const tableData = jadwalList.map((item) => [
        item.hari,
        item.waktu,
        item.mataPelajaran,
        item.kelas,
        <DeleteButton key={item.id} id={item.id} onDelete={handleDelete} />
    ]);

    // Handler Navigasi jika DashboardLayout mendukung callback onMenuClick
    const handleNavigation = (label) => {
        const cleanLabel = typeof label === "string" ? label : "";
        if (cleanLabel.includes("Dashboard") || cleanLabel.includes("📊")) {
            navigate("/guru/dashboard"); 
        } else if (cleanLabel.includes("Jadwal") || cleanLabel.includes("📅")) {
            navigate("/jadwal");
        } else if (cleanLabel.includes("Keluar") || cleanLabel.includes("⚙️")) {
            navigate("/");
        }
    };

    return (
        /* 
          STRATEGI TRIPLE ACTION:
          Menggunakan onClickCapture untuk menghentikan fungsi internal bawaan layout 
          sebelum event-nya turun ke komponen terdalam.
        */
        <div 
            onClickCapture={(e) => {
                const clickedText = e.target.textContent || e.target.innerText || "";
                
                // Jika yang diklik adalah area menu sidebar
                if (clickedText.includes("Dashboard") || clickedText.includes("📊")) {
                    e.stopPropagation();
                    e.preventDefault();
                    navigate("/guru/dashboard");
                } else if (
                    clickedText.includes("Jadwal") || 
                    clickedText.includes("Pelajaran") || 
                    clickedText.includes("Mengajar") || 
                    clickedText.includes("📅")
                ) {
                    e.stopPropagation();
                    e.preventDefault();
                    navigate("/jadwal");
                } else if (clickedText.includes("Keluar") || clickedText.includes("🚪")) {
                    e.stopPropagation();
                    e.preventDefault();
                    navigate("/");
                }
            }}
            style={{ minHeight: "100vh" }}
        >
            <DashboardLayout 
                role="Guru" 
                activeMenu="Jadwal Mengajar"
                onMenuClick={handleNavigation} // Antisipasi jika layout menggunakan callback prop ini
                onNavigate={handleNavigation}  // Antisipasi jika nama prop-nya berbeda
            >
                <PageContainer>
                    <h1 style={{ 
                        color: HappyHuesTheme.headline, 
                        textTransform: 'uppercase', 
                        marginBottom: '30px',
                        textShadow: `3px 3px 0px ${HappyHuesTheme.tertiary}`
                    }}>
                        Manajemen Jadwal
                    </h1>

                    {/* Form Input Jadwal Baru */}
                    <StyledCard title="Tambah Jadwal Baru" accentColor={HappyHuesTheme.highlight}>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                <input type="text" name="hari" placeholder="Hari (Contoh: Senin)" value={formData.hari} onChange={handleInputChange} style={inputStyle} />
                                <input type="text" name="waktu" placeholder="Waktu (Contoh: 07:00 - 08:30)" value={formData.waktu} onChange={handleInputChange} style={inputStyle} />
                                <input type="text" name="mataPelajaran" placeholder="Mata Pelajaran" value={formData.mataPelajaran} onChange={handleInputChange} style={inputStyle} />
                                <input type="text" name="kelas" placeholder="Kelas / Ruang" value={formData.kelas} onChange={handleInputChange} style={inputStyle} />
                            </div>
                            <div style={{ width: '100%', maxWidth: '300px', alignSelf: 'flex-start' }}>
                                <SubmitButton handleSubmit={handleSubmit} />
                            </div>
                        </form>
                    </StyledCard>

                    {/* Tabel Data Jadwal */}
                    <StyledCard title="Daftar Jadwal Pelajaran & Mengajar">
                        {jadwalList.length > 0 ? (
                            <DataTable headers={tableHeaders} data={tableData} themeColor={HappyHuesTheme.button} />
                        ) : (
                            <p style={{ color: HappyHuesTheme.paragraph, fontWeight: 'bold' }}>
                                Belum ada jadwal yang terdaftar.
                            </p>
                        )}
                    </StyledCard>
                </PageContainer>
            </DashboardLayout>
        </div>
    );
};

const inputStyle = {
    flex: '1 1 200px',
    padding: '12px',
    border: `3px solid ${HappyHuesTheme.stroke}`,
    backgroundColor: HappyHuesTheme.main,
    color: HappyHuesTheme.background,
    fontWeight: 'bold',
    outline: 'none',
    boxShadow: `4px 4px 0px ${HappyHuesTheme.stroke}`,
};