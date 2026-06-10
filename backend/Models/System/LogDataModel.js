import BaseModel from '../BaseModel.js';

class LogDataModel extends BaseModel {
    constructor() {
        super(
            'public.log_data', 
            'id_log', 
            ['id_guru', 'id_siswa', 'tanggal_log', 'ip_address', 'keterangan']
        );
    }
}
export default new LogDataModel();