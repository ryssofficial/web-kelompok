import BaseController from "./BaseController.js";
import { sendResponse, sendError, sendNotFound } from "../Utils/Response.js";
import db from "../db.js";

class JadwalController extends BaseController {
    constructor() { 
        super(null); 
    }

    // ===================================
    // 1. FITUR JADWAL PELAJARAN (UNTUK SISWA)
    // ===================================
    getJadwalPelajaran = async (req, res) => {
        await this.execute(res, async () => {
            const idSiswa = req.user.id;
            
            // Mengambil seluruh jadwal pelajaran berdasarkan rombel siswa yang bersangkutan
            const jadwal = await db.query(`
                SELECT 
                    j.hari,
                    j.jam_mulai AS "jamMulai",
                    j.jam_selesai AS "jamSelesai",
                    m.mapel AS "mataPelajaran",
                    r.kelas,
                    g.nama AS "namaGuru"
                FROM public.jadwal j
                JOIN public.mata_pelajaran m ON j.id_mapel = m.id_mapel
                JOIN public.rombel r ON j.id_rombel = r.id_rombel
                JOIN public.anggota_rombel ar ON ar.id_rombel = r.id_rombel
                LEFT JOIN public.guru g ON j.id_guru = g.id_guru
                WHERE ar.id_siswa = $1
                ORDER BY 
                    CASE 
                        WHEN j.hari = 'Senin' THEN 1
                        WHEN j.hari = 'Selasa' THEN 2
                        WHEN j.hari = 'Rabu' THEN 3
                        WHEN j.hari = 'Kamis' THEN 4
                        WHEN j.hari = 'Jumat' THEN 5
                        WHEN j.hari = 'Sabtu' THEN 6
                        ELSE 7
                    END, j.jam_mulai ASC
            `, [idSiswa]);

            return sendResponse(res, 200, "Data jadwal pelajaran siswa berhasil dimuat", {
                totalJadwal: jadwal.rowCount,
                jadwal: jadwal.rows
            });
        });
    }

    // ===================================
    // 2. FITUR JADWAL MENGAJAR (UNTUK GURU)
    // ===================================
    getJadwalMengajar = async (req, res) => {
        await this.execute(res, async () => {
            let idGuru = req.user.id;

            // Integrasi penanganan Google ID jika id pengguna berupa string panjang (seperti di DashboardController)
            if (isNaN(idGuru) || String(idGuru).length > 10) {
                const guruQuery = await db.query(`
                    SELECT id_guru FROM public.guru WHERE google_id = $1
                `, [idGuru]);
                
                idGuru = guruQuery.rows[0]?.id_guru;
            }

            // Jika guru tidak ditemukan di sistem database lokal
            if (!idGuru) {
                return res.status(404).json({
                    success: false,
                    message: "Data Guru tidak ditemukan di database untuk akun Google ini."
                });
            }

            // Mengambil seluruh jadwal mengajar yang diampu oleh guru tersebut
            const jadwal = await db.query(`
                SELECT 
                    j.hari,
                    j.jam_mulai AS "jamMulai",
                    j.jam_selesai AS "jamSelesai",
                    m.mapel AS "mataPelajaran",
                    r.kelas,
                    k.kategori
                FROM public.jadwal j
                JOIN public.mata_pelajaran m ON j.id_mapel = m.id_mapel
                JOIN public.rombel r ON j.id_rombel = r.id_rombel
                JOIN public.kategori_rombel k ON r.id_kategori = k.id_kategori
                WHERE j.id_guru = $1
                ORDER BY 
                    CASE 
                        WHEN j.hari = 'Senin' THEN 1
                        WHEN j.hari = 'Selasa' THEN 2
                        WHEN j.hari = 'Rabu' THEN 3
                        WHEN j.hari = 'Kamis' THEN 4
                        WHEN j.hari = 'Jumat' THEN 5
                        WHEN j.hari = 'Sabtu' THEN 6
                        ELSE 7
                    END, j.jam_mulai ASC
            `, [idGuru]);

            return sendResponse(res, 200, "Data jadwal mengajar guru berhasil dimuat", {
                totalMengajar: jadwal.rowCount,
                jadwal: jadwal.rows
            });
        });
    }
}

export default new JadwalController();