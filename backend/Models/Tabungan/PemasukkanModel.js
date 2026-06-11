import BaseModel from '../BaseModel.js';

class PemasukkanModel extends BaseModel {
    constructor() {
        super(
            'public.pemasukkan', 
            'id_pemasukkan', 
            ['id_tabungan', 'id_guru', 'jumlah_masuk', 'tanggal_masuk', 'keterangan']
        );
    }
}
export default new PemasukkanModel();