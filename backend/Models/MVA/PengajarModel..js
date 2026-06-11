import BaseModel from '../BaseModel.js';

class PengajarModel extends BaseModel {
    constructor() {
        super(
            'public.pengajar', 
            'id_pengajar', 
            ['id_mapel', 'id_guru']
        );
    }
}
export default new PengajarModel();