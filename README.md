[README.md](https://github.com/user-attachments/files/28826910/README.md)
# 💰 Fitur Keuangan — Eriska Cahya

Fitur ini menangani pengelolaan **Kas Kelas** dan **Tabungan Siswa** pada aplikasi Smart School Panel (SEBEL).

---

## 📁 Struktur File

```
web-kelompok/
├── src/
│   ├── API/
│   │   └── EriskaFitur/
│   │       ├── KasResponse.js        # API handler untuk Kas Kelas
│   │       └── TabunganResponse.js   # API handler untuk Tabungan Siswa
│   └── Screens/
│       └── KeuanganPage.jsx          # Halaman utama fitur Keuangan
```

---

## ✨ Fitur yang Diimplementasikan

### 🏦 Kas Kelas
| Fitur | Guru | Siswa |
|---|:---:|:---:|
| Lihat saldo kas kelas | ✅ | ✅ |
| Lihat total pemasukkan & pengeluaran | ✅ | ✅ |
| Tambah pemasukkan kas | ✅ | ❌ |
| Tambah pengeluaran kas | ✅ | ❌ |
| Hapus riwayat transaksi | ✅ | ❌ |

### 💳 Tabungan Siswa
| Fitur | Guru | Siswa |
|---|:---:|:---:|
| Lihat daftar tabungan semua siswa | ✅ | ❌ |
| Lihat saldo & riwayat tabungan | ✅ | ✅ |
| Setor tabungan siswa | ✅ | ❌ |
| Tarik tabungan siswa | ✅ | ❌ |
| Hapus riwayat setor/tarik | ✅ | ❌ |

---

## 🔌 Endpoint API

### Kas Kelas
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/kas?id_rombel=` | Ambil data kas berdasarkan rombel |
| GET | `/api/kas/pemasukkan?id_kas=` | Riwayat pemasukkan kas |
| GET | `/api/kas/pengeluaran?id_kas=` | Riwayat pengeluaran kas |
| POST | `/api/kas/pemasukkan` | Tambah pemasukkan kas |
| POST | `/api/kas/pengeluaran` | Tambah pengeluaran kas |
| DELETE | `/api/kas/pemasukkan/:id` | Hapus pemasukkan kas |
| DELETE | `/api/kas/pengeluaran/:id` | Hapus pengeluaran kas |

### Tabungan Siswa
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/tabungan?id_rombel=` | Daftar tabungan siswa per rombel |
| GET | `/api/tabungan/:id` | Detail tabungan satu siswa |
| GET | `/api/tabungan/setor?id_tabungan=` | Riwayat setor tabungan |
| GET | `/api/tabungan/tarik?id_tabungan=` | Riwayat tarik tabungan |
| POST | `/api/tabungan/setor` | Setor tabungan siswa |
| POST | `/api/tabungan/tarik` | Tarik tabungan siswa |
| DELETE | `/api/tabungan/setor/:id` | Hapus riwayat setor |
| DELETE | `/api/tabungan/tarik/:id` | Hapus riwayat tarik |

---

## 🛠️ Teknologi
- **Frontend Web**: React.js
- **Frontend Mobile**: React Native (Expo)
- **Backend**: Express.js + PostgreSQL
- **Auth**: JWT Token via Cookie

---

## 👩‍💻 Developer
**Eriska Cahya** — Fitur Keuangan (Kas Kelas & Tabungan Siswa)
