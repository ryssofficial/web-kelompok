import BaseModel from '../BaseModel.js';

class PengeluaranModel extends BaseModel {
    constructor() {
        super(
            'public.pengeluaran', 
            'id_pengeluaran', 
            ['id_tabungan', 'id_guru', 'jumlah_keluar', 'tanggal_keluar', 'keterangan']
        );
    }
}
export default new PengeluaranModel();