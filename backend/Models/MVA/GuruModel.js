import BaseModel from '../BaseModel.js';
import QueryBuilder from '../../Databases/QueryBuilder.js';

class GuruModel extends BaseModel {
    constructor() {
        super(
            'public.guru', 
            'id_guru', 
            ['dapodik', 'nip', 'nama_guru', 'id_jabatan', 'google_id', 'email', 'password_guru']
        );
    }

    /**
     * Mengambil profil lengkap guru berserta nama jabatannya (JOIN)
     */
    async getProfileLengkap(idGuru) {
        const dataFlat = await this.query()
            .select(['g.*', 'j.nama_jabatan AS jabatan_nama_jabatan'])
            .join('public.jabatan j', 'g.id_jabatan = j.id_jabatan')
            .where('g.id_guru', '=', idGuru)
            .first();

        if (!dataFlat) return null;
        // Memetakan ke struktur nested object { ..., jabatan: { namaJabatan: '...' } }
        return QueryBuilder.nestRelation([dataFlat], 'jabatan', ['nama_jabatan'])[0];
    }
}
export default new GuruModel();