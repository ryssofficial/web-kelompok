import BaseController from "./BaseController.js";
import NotifikasiModel from "../Models/System/NotifikasiModel.js";
import { sendResponse, sendNotFound } from "../Utils/Response.js";
import pool from "../db.js"; 

class NotifikasiController extends BaseController {
    constructor() {
        super(NotifikasiModel);
    }

    getAll = async (req, res) => {
        await this.execute(res, async () => {
            const userId = req.user.id; // Langsung mengambil angka '1'
            const userRole = req.user.role?.toLowerCase(); 
            const targetColumn = userRole === 'guru' ? 'id_guru' : 'id_siswa';

            const data = await this.model.query()
                .where(targetColumn, '=', userId)
                .get();

            return sendResponse(res, 200, "Semua notifikasi berhasil diambil", data);
        });
    }

    markAsRead = async (req, res) => {
        await this.execute(res, async () => {
            const { id } = req.params; 
            const userId = req.user.id;
            const userRole = req.user.role?.toLowerCase(); 
            const targetColumn = userRole === 'guru' ? 'id_guru' : 'id_siswa';

            // Validasi kepemilikan
            const notif = await this.model.query()
                .where('id_notif', '=', id)
                .where(targetColumn, '=', userId)
                .first();

            if (!notif) {
                return sendNotFound(res, `Notifikasi tidak ditemukan atau bukan milik Anda.`);
            }

            await pool.query(
                `UPDATE ${this.model.tableName} SET is_read = true WHERE id_notif = $1`, 
                [id]
            );

            return sendResponse(res, 200, "Notifikasi berhasil ditandai sebagai sudah dibaca");
        });
    }

    markAllAsRead = async (req, res) => {
        await this.execute(res, async () => {
            const userId = req.user.id;
            const userRole = req.user.role?.toLowerCase(); 
            const targetColumn = userRole === 'guru' ? 'id_guru' : 'id_siswa';

            await pool.query(
                `UPDATE ${this.model.tableName} SET is_read = true WHERE ${targetColumn} = $1`, 
                [userId]
            );

            return sendResponse(res, 200, "Semua notifikasi berhasil ditandai sebagai sudah dibaca");
        });
    }

    deleteNotif = async (req, res) => {
        await this.execute(res, async () => {
            const { id } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role?.toLowerCase(); 
            const targetColumn = userRole === 'guru' ? 'id_guru' : 'id_siswa';

            // Validasi kepemilikan
            const notif = await this.model.query()
                .where('id_notif', '=', id)
                .where(targetColumn, '=', userId)
                .first();

            if (!notif) {
                return sendNotFound(res, `Notifikasi tidak ditemukan atau bukan milik Anda.`);
            }

            await pool.query(
                `DELETE FROM ${this.model.tableName} WHERE id_notif = $1`, 
                [id]
            );

            return sendResponse(res, 200, "Notifikasi berhasil dihapus");
        });
    }
}

export default new NotifikasiController();