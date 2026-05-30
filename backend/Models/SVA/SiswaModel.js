// src/Models/SVA/SiswaModel.js
import BaseModel from '../BaseModel.js';

class SiswaModel extends BaseModel {
    constructor() {
        super(
            'public.siswa', 
            'id_siswa', 
            // 🔒 HANYA kolom ini yang boleh di-insert/update dari Frontend
            ['nis', 'nama_siswa', 'tahun_masuk', 'pass'] 
        );
    }
}
export default new SiswaModel();