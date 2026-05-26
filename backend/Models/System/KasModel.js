import BaseModel from '../BaseModel.js';

class KasModel extends BaseModel {
    constructor() {
        super(
            'public.kas', 
            'id_kas', 
            ['id_rombel'] // saldo_kas dikunci, mutasi via tabel pemasukkan/pengeluaran kas
        );
    }
}
export default new KasModel();