// backend/Controllers/NotifikasiController.js
import BaseController from "./BaseController.js"; // Sesuaikan path ke BaseController
import NotifikasiModel from "../Models/System/NotifikasiModel.js";
import { sendResponse, sendNotFound } from "../Utils/Response.js";
import pool from "../db.js"; // Kita import pool untuk menangani kueri massal (Bulk Update)

class NotifikasiController extends BaseController {
    constructor() {
        super(NotifikasiModel);
    }

    /**
     * Ambil semua notifikasi milik user yang sedang login
     */
    getAll = async (req, res) => {
        await this.execute(res, async () => {
            const userId = req.user.id; // Ini berisi google_id panjang
            const userRole = req.user.role?.toLowerCase(); 
            const targetColumn = userRole === 'guru' ? 'id_guru' : 'id_siswa';

            // 🌟 PERBAIKAN: Konversi google_id mjd ID Int asli dari database
            let internalId = userId;
            if (userRole === 'guru') {
                const guruCheck = await pool.query("SELECT id_guru FROM public.guru WHERE google_id = $1", [userId]);
                if (guruCheck.rows.length > 0) internalId = guruCheck.rows[0].id_guru;
            } else {
                const siswaCheck = await pool.query("SELECT id_siswa FROM public.siswa WHERE google_id = $1", [userId]);
                if (siswaCheck.rows.length > 0) internalId = siswaCheck.rows[0].id_siswa;
            }

            const data = await this.model.query()
                .where(targetColumn, '=', internalId) // Menggunakan ID angka biasa (cth: 1)
                .get();

            return sendResponse(res, 200, "Semua notifikasi berhasil diambil", data);
        });
    }

    /**
     * Tandai satu notifikasi sebagai sudah dibaca
     */
    markAsRead = async (req, res) => {
        await this.execute(res, async () => {
            const { id } = req.params; // Mengambil id_notif dari URL params
            const userId = req.user.id;
            const userRole = req.user.role?.toLowerCase(); 
            const targetColumn = userRole === 'guru' ? 'id_guru' : 'id_siswa';

            // 🌟 PERBAIKAN: Konversi google_id mjd ID Int asli dari database
            let internalId = userId;
            if (userRole === 'guru') {
                const guruCheck = await pool.query("SELECT id_guru FROM public.guru WHERE google_id = $1", [userId]);
                if (guruCheck.rows.length > 0) internalId = guruCheck.rows[0].id_guru;
            } else {
                const siswaCheck = await pool.query("SELECT id_siswa FROM public.siswa WHERE google_id = $1", [userId]);
                if (siswaCheck.rows.length > 0) internalId = siswaCheck.rows[0].id_siswa;
            }

            // Validasi: Pastikan notifikasi ini ada DAN memang milik user tersebut
            const notif = await this.model.query()
                .where('id_notif', '=', id)
                .where(targetColumn, '=', internalId)
                .first();

            if (!notif) {
                return sendNotFound(res, `Notifikasi tidak ditemukan atau bukan milik Anda.`);
            }

            // Lakukan update menggunakan pool karena QueryBuilder Anda saat ini baru mendukung SELECT
            await pool.query(
                `UPDATE ${this.model.tableName} SET is_read = true WHERE id_notif = $1`, 
                [id]
            );

            return sendResponse(res, 200, "Notifikasi berhasil ditandai sebagai sudah dibaca");
        });
    }

    /**
     * Tandai semua notifikasi milik user sebagai sudah dibaca
     */
    markAllAsRead = async (req, res) => {
        await this.execute(res, async () => {
            const userId = req.user.id;
            const userRole = req.user.role?.toLowerCase(); 
            const targetColumn = userRole === 'guru' ? 'id_guru' : 'id_siswa';

            // 🌟 PERBAIKAN: Konversi google_id mjd ID Int asli dari database
            let internalId = userId;
            if (userRole === 'guru') {
                const guruCheck = await pool.query("SELECT id_guru FROM public.guru WHERE google_id = $1", [userId]);
                if (guruCheck.rows.length > 0) internalId = guruCheck.rows[0].id_guru;
            } else {
                const siswaCheck = await pool.query("SELECT id_siswa FROM public.siswa WHERE google_id = $1", [userId]);
                if (siswaCheck.rows.length > 0) internalId = siswaCheck.rows[0].id_siswa;
            }

            // Mengubah semua status 'is_read' menjadi true berdasarkan id asli
            await pool.query(
                `UPDATE ${this.model.tableName} SET is_read = true WHERE ${targetColumn} = $1`, 
                [internalId]
            );

            return sendResponse(res, 200, "Semua notifikasi berhasil ditandai sebagai sudah dibaca");
        });
    }

    /**
     * Hapus satu notifikasi berdasarkan id_notif
     */
    deleteNotif = async (req, res) => {
        await this.execute(res, async () => {
            const { id } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role?.toLowerCase(); 
            const targetColumn = userRole === 'guru' ? 'id_guru' : 'id_siswa';

            // 🌟 PERBAIKAN: Konversi google_id mjd ID Int asli dari database
            let internalId = userId;
            if (userRole === 'guru') {
                const guruCheck = await pool.query("SELECT id_guru FROM public.guru WHERE google_id = $1", [userId]);
                if (guruCheck.rows.length > 0) internalId = guruCheck.rows[0].id_guru;
            } else {
                const siswaCheck = await pool.query("SELECT id_siswa FROM public.siswa WHERE google_id = $1", [userId]);
                if (siswaCheck.rows.length > 0) internalId = siswaCheck.rows[0].id_siswa;
            }

            // Validasi kepemilikan sebelum menghapus data demi keamanan
            const notif = await this.model.query()
                .where('id_notif', '=', id)
                .where(targetColumn, '=', internalId)
                .first();

            if (!notif) {
                return sendNotFound(res, `Notifikasi tidak ditemukan atau bukan milik Anda.`);
            }

            // Jalankan kueri hapus
            await pool.query(
                `DELETE FROM ${this.model.tableName} WHERE id_notif = $1`, 
                [id]
            );

            return sendResponse(res, 200, "Notifikasi berhasil dihapus");
        });
    }
}

export default new NotifikasiController();