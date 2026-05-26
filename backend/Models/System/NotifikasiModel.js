import BaseModel from '../BaseModel.js';

class NotifikasiModel extends BaseModel {
    constructor() {
        super(
            'public.notifikasi', 
            'id_notif', 
            ['id_guru', 'id_siswa', 'judul', 'pesan', 'is_read', 'tanggal_notif']
        );
    }
}
export default new NotifikasiModel();