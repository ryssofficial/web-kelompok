import BaseModel from '../BaseModel.js';

class JabatanModel extends BaseModel {
    constructor() {
        super(
            'public.jabatan', 
            'id_jabatan', 
            ['nama_jabatan']
        );
    }
}
export default new JabatanModel();