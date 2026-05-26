import BaseModel from '../BaseModel.js';
import QueryBuilder from '../../Databases/QueryBuilder.js';

class RombelModel extends BaseModel {
    constructor() {
        super(
            'public.rombel', 
            'id_rombel', 
            ['kelas', 'id_kategori', 'id_guru', 'id_tahun']
        );
    }

    /**
     * Mengambil detail kelas, kategori rombel, beserta nama wali kelas (JOIN Tiga Tabel)
     */
    async getDetailRombel(idRombel) {
        const result = await this.query()
            .select([
                'r.id_rombel', 'r.kelas', 
                'kr.kategori AS kategori_kategori', 
                'g.nama_guru AS wali_nama_guru', 'g.nip AS wali_nip'
            ])
            .join('public.kategori_rombel kr', 'r.id_kategori = kr.id_kategori')
            .join('public.guru g', 'r.id_guru = g.id_guru')
            .where('r.id_rombel', '=', idRombel)
            .first();

        if (!result) return null;
        
        // Bersihkan data flat menjadi objek bersarang yang rapi
        let nested = QueryBuilder.nestRelation([result], 'kategori', ['kategori']);
        nested = QueryBuilder.nestRelation(nested, 'wali', ['nama_guru', 'nip']);
        return nested[0];
    }
}
export default new RombelModel();