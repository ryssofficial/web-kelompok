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
            // id didapatkan dari token JWT yang sudah di-decode oleh middleware authenticateToken
            const userId = req.user.id; 

            const data = await this.model.query()
                .where('id_user', '=', userId)
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

            // Validasi: Pastikan notifikasi ini ada DAN memang milik user tersebut
            const notif = await this.model.query()
                .where('id_notif', '=', id)
                .where('id_user', '=', userId)
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

            // Mengubah semua status 'is_read' menjadi true berdasarkan id_user
            await pool.query(
                `UPDATE ${this.model.tableName} SET is_read = true WHERE id_user = $1`, 
                [userId]
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

            // Validasi kepemilikan sebelum menghapus data demi keamanan
            const notif = await this.model.query()
                .where('id_notif', '=', id)
                .where('id_user', '=', userId)
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