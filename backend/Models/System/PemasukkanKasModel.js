import BaseModel from '../BaseModel.js';

class PemasukkanKasModel extends BaseModel {
    constructor() {
        super(
            'public.pemasukkan_kas', 
            'id_pemasukkan_kas', 
            ['id_kas', 'id_guru', 'jumlah_masuk', 'tanggal_masuk', 'keterangan']
        );
    }
}
export default new PemasukkanKasModel();