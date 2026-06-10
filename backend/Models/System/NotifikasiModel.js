// backend/Models/System/NotifikasiModel.js
import BaseModel from "../BaseModel.js"; 

class NotifikasiModel extends BaseModel {
    constructor() {
        // 🌟 PERBAIKAN: Tambahkan 'id_notif' ke dalam daftar kolom agar tidak tersaring keluar
        super('notifikasi', 'id_notif', ['id_notif', 'id_guru', 'id_siswa', 'judul', 'pesan', 'is_read']);
    }
}

export default new NotifikasiModel();