import BaseModel from '../BaseModel.js';

class JadwalModel extends BaseModel {
    constructor() {
        super(
            'public.jadwal', 
            'id_jadwal', 
            ['hari', 'jam_mulai', 'jam_selesai', 'id_mapel', 'id_guru', 'id_rombel', 'id_tahun']
        );
    }
}
export default new JadwalModel();