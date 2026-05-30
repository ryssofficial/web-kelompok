// backend/Models/System/NotifikasiModel.js
import BaseModel from "../BaseModel.js"; // Sesuaikan path ke BaseModel Anda

class NotifikasiModel extends BaseModel {
    constructor() {
        /**
         * Parameter:
         * 1. 'notifikasi' = Nama tabel di database
         * 2. 'id_notif' = Primary Key (sesuai dokumentasi JSDoc di frontend Anda)
         * 3. Whitelist kolom yang boleh diisi/diubah
         */
        super('notifikasi', 'id_notif', ['id_user', 'judul', 'pesan', 'is_read']);
    }
}

export default new NotifikasiModel();