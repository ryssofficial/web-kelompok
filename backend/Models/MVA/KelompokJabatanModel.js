import BaseModel from '../BaseModel.js';

class KelompokJabatanModel extends BaseModel {
    constructor() {
        super(
            'public.kelompok_jabatan', 
            'id_kelompok', 
            ['id_jabatan', 'id_guru']
        );
    }
}
export default new KelompokJabatanModel();