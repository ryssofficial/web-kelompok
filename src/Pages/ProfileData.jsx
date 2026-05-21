import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "../Components/DashboardLayout";

const HappyHuesTheme = {
  stroke: "#000000",
  paragraph: "#1a202c",
  background: "#f7fafc",
  highlight: "#ffea79", // Kuning Neo-Brutalism
};

const LocalStyledCard = ({ children, style }) => (
  <div style={{
    backgroundColor: "#ffffff",
    border: `3px solid ${HappyHuesTheme.stroke}`,
    boxShadow: `4px 4px 0px ${HappyHuesTheme.stroke}`,
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "20px",
    transition: "all 0.2s ease-in-out",
    ...style
  }}>
    {children}
  </div>
);

const LocalStyledButton = ({ children, type, style, onClick, disabled }) => (
  <button 
    type={type} 
    onClick={onClick}
    disabled={disabled}
    style={{
      backgroundColor: "#e2e8f0", 
      color: HappyHuesTheme.paragraph,
      border: `3px solid ${HappyHuesTheme.stroke}`,
      boxShadow: `3px 3px 0px ${HappyHuesTheme.stroke}`,
      borderRadius: "8px",
      padding: "10px 20px",
      fontWeight: "700",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      ...style
    }}
  >
    {children}
  </button>
);

export default function ProfileData() {
  const { role } = useParams();

  // State navigasi internal/mode visual form
  const [currentView, setCurrentView] = useState("display"); // Pilihan: "display" | "edit-profile" | "change-password"

  // Master State Data Profil (Diinisialisasi dengan data default dari screenshot kamu)
  const [profile, setProfile] = useState({
    fullName: "hakim nizam",
    alamat: "jl. kaps baru X/15",
    ttl: "surabaya, 12 agustus 2003",
    email: "hakim@school.com",
    password: "password123", // Password bawaan awal untuk validasi
  });

  // State temporary khusus form input
  const [tempProfile, setTempProfile] = useState({ ...profile });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handler Perubahan Form
  const handleProfileChange = (e) => {
    setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Submit Perubahan Profil
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfile({ ...tempProfile });
    alert("Data profil guru berhasil diperbarui!");
    setCurrentView("display");
  };

  // Submit Perubahan Password
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.currentPassword !== profile.password) {
      alert("Password saat ini tidak cocok!");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Konfirmasi password baru tidak cocok!");
      return;
    }
    
    setProfile({ ...profile, password: passwordData.newPassword });
    alert("Password berhasil diubah!");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setCurrentView("display");
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    margin: "8px 0 16px 0",
    border: `3px solid ${HappyHuesTheme.stroke}`,
    boxShadow: `3px 3px 0px ${HappyHuesTheme.stroke}`,
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#ffffff"
  };

  const labelStyle = {
    fontWeight: "700",
    color: HappyHuesTheme.paragraph,
    display: "block",
  };

  const resultItemStyle = {
    marginBottom: "16px",
    paddingBottom: "12px",
    borderBottom: `2px dashed ${HappyHuesTheme.stroke}`
  };

  return (
    <DashboardLayout role={role || "guru"} activeMenu="Profil Saya">
      <div style={{ padding: "8px", maxWidth: "600px", margin: "0 auto" }}>
        
        {/* ==================== 1. MODE TAMPIL DATA UTAMA ==================== */}
        {currentView === "display" && (
          <LocalStyledCard>
            <div style={{ backgroundColor: HappyHuesTheme.highlight, padding: "12px", border: `3px solid ${HappyHuesTheme.stroke}`, boxShadow: `3px 3px 0px ${HappyHuesTheme.stroke}`, fontWeight: "900", marginBottom: "24px", borderRadius: "6px", textAlign: "center" }}>
              ✅ Data Berhasil Terdaftar
            </div>

            <div style={resultItemStyle}>
              <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "800", letterSpacing: "1px" }}>NAMA LENGKAP</span>
              <div style={{ fontSize: "16px", fontWeight: "bold", marginTop: "4px" }}>{profile.fullName}</div>
            </div>

            <div style={resultItemStyle}>
              <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "800", letterSpacing: "1px" }}>ALAMAT</span>
              <div style={{ fontSize: "16px", fontWeight: "bold", marginTop: "4px" }}>{profile.alamat}</div>
            </div>

            <div style={resultItemStyle}>
              <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "800", letterSpacing: "1px" }}>TEMPAT, TANGGAL LAHIR</span>
              <div style={{ fontSize: "16px", fontWeight: "bold", marginTop: "4px" }}>{profile.ttl}</div>
            </div>

            <div style={resultItemStyle}>
              <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "800", letterSpacing: "1px" }}>EMAIL AKTIF</span>
              <div style={{ fontSize: "16px", fontWeight: "bold", marginTop: "4px" }}>{profile.email}</div>
            </div>

            <div style={{ ...resultItemStyle, borderBottom: "none", marginBottom: "24px" }}>
              <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "800", letterSpacing: "1px" }}>STATUS PASSWORD</span>
              <div style={{ fontSize: "16px", fontWeight: "bold", marginTop: "4px" }}>•••••••• (Sesuai Prosedur Aman)</div>
            </div>

            {/* Panel Tombol Aksi */}
            <div style={{ display: "flex", gap: "12px" }}>
              <LocalStyledButton 
                onClick={() => {
                  setTempProfile({ ...profile });
                  setCurrentView("edit-profile");
                }}
                style={{ backgroundColor: "#38bdf8", flex: 1 }}
              >
                ✏️ Edit Profil
              </LocalStyledButton>
              
              <LocalStyledButton 
                onClick={() => setCurrentView("change-password")}
                style={{ backgroundColor: "#ec4899", color: "#fff", flex: 1 }}
              >
                🔑 Ubah Password
              </LocalStyledButton>
            </div>
          </LocalStyledCard>
        )}

        {/* ==================== 2. MODE FORM EDIT DATA PROFIL ==================== */}
        {currentView === "edit-profile" && (
          <LocalStyledCard>
            <h3 style={{ color: HappyHuesTheme.paragraph, marginBottom: "20px", fontWeight: "900", fontSize: "20px" }}>
              Form Edit Profil Guru
            </h3>
            <form onSubmit={handleProfileSubmit}>
              <label style={labelStyle}>Nama Lengkap</label>
              <input
                type="text"
                name="fullName"
                value={tempProfile.fullName}
                onChange={handleProfileChange}
                style={inputStyle}
                required
              />

              <label style={labelStyle}>Alamat Tempat Tinggal</label>
              <input
                type="text"
                name="alamat"
                value={tempProfile.alamat}
                onChange={handleProfileChange}
                style={inputStyle}
                required
              />

              <label style={labelStyle}>Tempat, Tanggal Lahir</label>
              <input
                type="text"
                name="ttl"
                value={tempProfile.ttl}
                onChange={handleProfileChange}
                style={inputStyle}
                required
              />

              <label style={labelStyle}>Email</label>
              <input
                type="email"
                name="email"
                value={tempProfile.email}
                onChange={handleProfileChange}
                style={inputStyle}
                required
              />

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <LocalStyledButton type="submit" style={{ backgroundColor: "#4ade80", flex: 1 }}>
                  Simpan Perubahan
                </LocalStyledButton>
                <LocalStyledButton type="button" onClick={() => setCurrentView("display")} style={{ flex: 1 }}>
                  Batal
                </LocalStyledButton>
              </div>
            </form>
          </LocalStyledCard>
        )}

        {/* ==================== 3. MODE FORM UBAH PASSWORD ==================== */}
        {currentView === "change-password" && (
          <LocalStyledCard>
            <h3 style={{ color: HappyHuesTheme.paragraph, marginBottom: "20px", fontWeight: "900", fontSize: "20px" }}>
              🔑 Form Perbarui Password
            </h3>
            <form onSubmit={handlePasswordSubmit}>
              <label style={labelStyle}>Password Saat Ini</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                style={inputStyle}
                placeholder="Masukkan password lama"
                required
              />

              <label style={labelStyle}>Password Baru</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                style={inputStyle}
                placeholder="Buat password baru"
                required
              />

              <label style={labelStyle}>Konfirmasi Password Baru</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                style={inputStyle}
                placeholder="Ulangi password baru"
                required
              />

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <LocalStyledButton type="submit" style={{ backgroundColor: "#ec4899", color: "#fff", flex: 1 }}>
                  Update Password
                </LocalStyledButton>
                <LocalStyledButton type="button" onClick={() => setCurrentView("display")} style={{ flex: 1 }}>
                  Kembali
                </LocalStyledButton>
              </div>
            </form>
          </LocalStyledCard>
        )}

      </div>
    </DashboardLayout>
  );
}