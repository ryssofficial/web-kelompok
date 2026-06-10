import BaseController from "./BaseController.js";
import { sendResponse } from "../Utils/Response.js";
import db from "../db.js";

class DashboardController extends BaseController {
    constructor() { super(null); }

    // ===================================
    // 1. CONTROLLER DASHBOARD SISWA
    // ===================================
    getSiswaDashboard = async (req, res) => {
        await this.execute(res, async () => {
            const idSiswa = req.user.id; 
            const hariIni = this.getHariSekarang();
            const tabungan = await db.query(`
                SELECT t.saldo_total
                FROM public.tabungan t
                JOIN public.anggota_rombel ar ON t.id_anggota = ar.id_anggota
                WHERE ar.id_siswa = $1
            `, [idSiswa]);
            const saldoTotal = tabungan.rows[0]?.saldo_total || 0;
            const jadwal = await db.query(`
                SELECT
                    j.jam_mulai AS "jamMulai",
                    j.jam_selesai AS "jamSelesai",
                    m.mapel AS "mataPelajaran",
                    r.kelas,
                    k.kategori
                FROM public.jadwal j
                JOIN public.mata_pelajaran m ON j.id_mapel = m.id_mapel
                JOIN public.rombel r ON j.id_rombel = r.id_rombel
                JOIN public.kategori_rombel k ON r.id_kategori = k.id_kategori
                JOIN public.anggota_rombel ar ON ar.id_rombel = r.id_rombel
                WHERE ar.id_siswa = $1 AND j.hari = $2
                ORDER BY j.jam_mulai ASC
            `, [idSiswa, hariIni]);

            const notifikasi = await db.query(`
                SELECT judul, pesan
                FROM public.notifikasi
                WHERE id_siswa = $1
                ORDER BY tanggal_notif DESC
                LIMIT 3
            `, [idSiswa]);

            const responseData = {
                stats: {
                    saldoTabungan: parseFloat(saldoTotal),
                    tugasBaru: 2, 
                    persentaseHadir: "95%"
                },
                jadwal: jadwal.rows,
                notifikasi: notifikasi.rows
            };

            return sendResponse(res, 200, "Data dashboard siswa berhasil dimuat", responseData);
        });
    }

    // ===================================
    // 2. CONTROLLER DASHBOARD GURU
    // ===================================
    getGuruDashboard = async (req, res) => {
        await this.execute(res, async () => {
            let idGuru = req.user.id; // Bisa berupa integer id_guru atau string google_id
            const hariIni = this.getHariSekarang();

            // 🌟 PERBAIKAN: Jika id berupa string panjang (Google ID), konversi ke id_guru asli terlebih dahulu
            if (isNaN(idGuru) || String(idGuru).length > 10) {
                const guruQuery = await db.query(`
                    SELECT id_guru FROM public.guru WHERE google_id = $1
                `, [idGuru]);
                
                idGuru = guruQuery.rows[0]?.id_guru;
            }

            // Jika setelah dicari tetap tidak ada di database
            if (!idGuru) {
                return res.status(404).json({
                    success: false,
                    message: "Data Guru tidak ditemukan di database untuk akun Google ini."
                });
            }

            // --- Sisa Query di bawah ini menggunakan idGuru yang sudah fix bertipe Integer ---

            const kelasQuery = await db.query(`
                SELECT COUNT(DISTINCT id_rombel) AS total_kelas
                FROM public.jadwal
                WHERE id_guru = $1
            `, [idGuru]);
            const totalKelas = kelasQuery.rows[0]?.total_kelas || 0;

            const jadwal = await db.query(`
                SELECT
                    j.jam_mulai AS "jamMulai",
                    j.jam_selesai AS "jamSelesai",
                    m.mapel AS "mataPelajaran",
                    r.kelas,
                    k.kategori
                FROM public.jadwal j
                JOIN public.mata_pelajaran m ON j.id_mapel = m.id_mapel
                JOIN public.rombel r ON j.id_rombel = r.id_rombel
                JOIN public.kategori_rombel k ON r.id_kategori = k.id_kategori
                WHERE j.id_guru = $1 AND j.hari = $2
                ORDER BY j.jam_mulai ASC
            `, [idGuru, hariIni]);

            const notifikasi = await db.query(`
                SELECT judul, pesan
                FROM public.notifikasi
                WHERE id_guru = $1
                ORDER BY tanggal_notif DESC
                LIMIT 3
            `, [idGuru]);

            const responseData = {
                stats: {
                    kehadiran: "100%", 
                    totalKelas: parseInt(totalKelas),
                    tugasAktif: 4 
                },
                jadwal: jadwal.rows,
                notifikasi: notifikasi.rows
            };

            return sendResponse(res, 200, "Data dashboard guru berhasil dimuat", responseData);
        });
    }

    getHariSekarang() {
        const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return hari[new Date().getDay()]; 
    }
}

export default new DashboardController();