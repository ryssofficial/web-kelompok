import BaseModel from '../BaseModel.js';

class TahunAkademikModel extends BaseModel {
    constructor() {
        super(
            'public.tahun_akademik', 
            'id_tahun', 
            ['tahun_ajaran', 'semester', 'status_aktif']
        );
    }
}
export default new TahunAkademikModel();