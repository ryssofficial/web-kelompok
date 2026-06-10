import BaseModel from '../BaseModel.js';

class TabunganModel extends BaseModel {
    constructor() {
        super(
            'public.tabungan', 
            'id_tabungan', 
            ['id_anggota', 'id_rombel'] // saldo_total dikunci (ReadOnly dari backend)
        );
    }
}
export default new TabunganModel();