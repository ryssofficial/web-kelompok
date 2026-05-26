import BaseModel from '../BaseModel.js';

class PresensiModel extends BaseModel {
    constructor() {
        super(
            'public.presensi', 
            'id_presensi', 
            ['id_anggota', 'tugas_ke', 'tanggal_penilaian', 'status_kehadiran']
        );
    }
}
export default new PresensiModel();