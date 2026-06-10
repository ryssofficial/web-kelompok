import BaseModel from '../BaseModel.js';

class MataPelajaranModel extends BaseModel {
    constructor() {
        super(
            'public.mata_pelajaran', 
            'id_mapel', 
            ['mapel', 'kurikulum', 'stok_buku', 'buku_untuk_kelas']
        );
    }
}
export default new MataPelajaranModel();