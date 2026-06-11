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

    /**
     * Mengambil id_rombel, data seluruh siswa di dalamnya, dan data wali kelas
     * untuk kebutuhan input kas dan tabungan.
     */
    async getSiswaDanWaliByIdGuru(idGuru) {
        const results = await this.query()
            .select([
                'r.id_rombel', 
                'r.kelas',
                'g.nama_guru AS wali_nama_guru', 
                'g.nip AS wali_nip',
                's.id_siswa AS siswa_id_siswa', 
                's.nis_siswa AS siswa_nis_siswa', 
                's.nama_siswa AS siswa_nama_siswa'
            ])
            // r otomatis merujuk ke 'public.rombel' dari constructor
            .join('public.guru g', 'r.id_guru = g.id_guru')
            .join('public.anggota_rombel ar', 'r.id_rombel = ar.id_rombel')
            .join('public.siswa s', 'ar.id_siswa = s.id_siswa')
            .where('r.id_guru', '=', idGuru) // ✨ Filter langsung berdasarkan ID Guru asli
            .where('ar.status_siswa', '=', 'Aktif') 
            .get();

        if (!results || results.length === 0) return null;

        // Proses Nesting Relasi Wali Kelas (menjadi camelCase: wali.namaGuru, wali.nip)
        let nested = QueryBuilder.nestRelation(results, 'wali', ['namaGuru', 'nip']);

        // Mengelompokkan data siswa menjadi Array di dalam satu objek Rombel
        const rombelInfo = {
            idRombel: nested[0].idRombel,
            kelas: nested[0].kelas,
            wali: nested[0].wali,
            siswa: []
        };

        nested.forEach(row => {
            if (row.siswaIdSiswa) {
                rombelInfo.siswa.push({
                    idSiswa: row.siswaIdSiswa,
                    nisSiswa: row.siswaNisSiswa,
                    namaSiswa: row.siswaNamaSiswa
                });
            }
        });

        return rombelInfo;
    }
}
export default new RombelModel();