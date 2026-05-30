import BaseModel from '../BaseModel.js';

class PengeluaranKasModel extends BaseModel {
    constructor() {
        super(
            'public.pengeluaran_kas', 
            'id_pengeluaran_kas', 
            ['id_kas', 'id_guru', 'jumlah_keluar', 'tanggal_keluar', 'keterangan']
        );
    }
}
export default new PengeluaranKasModel();