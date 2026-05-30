import BaseModel from '../BaseModel.js';

class RombonganMapelModel extends BaseModel {
    constructor() {
        super(
            'public.rombongan_mapel', 
            'id_rombongan', 
            ['id_mapel', 'id_guru']
        );
    }
}
export default new RombonganMapelModel();