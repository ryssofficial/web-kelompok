import BaseModel from '../BaseModel.js';

class KategoriRombelModel extends BaseModel {
    constructor() {
        super(
            'public.kategori_rombel', 
            'id_kategori', 
            ['kategori']
        );
    }
}
export default new KategoriRombelModel();