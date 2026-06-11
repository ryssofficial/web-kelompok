import BaseModel from '../BaseModel.js';

class AnggotaRombelModel extends BaseModel {
    constructor() {
        super(
            'public.anggota_rombel', 
            'id_anggota', 
            ['id_rombel', 'id_siswa', 'status_siswa']
        );
    }
}
export default new AnggotaRombelModel();