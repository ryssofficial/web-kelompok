import BaseModel from '../BaseModel.js';
import QueryBuilder from '../../Databases/QueryBuilder.js';

class NilaiTugasModel extends BaseModel {
    constructor() {
        super(
            'public.nilai_tugas', 
            'id_nilai', 
            ['id_anggota', 'id_mapel', 'tugas_ke', 'nilai', 'id_guru', 'tanggal_input']
        );
    }

    /**
     * Mengambil daftar nilai tugas siswa pada mapel tertentu dalam suatu kelas
     */
    async listNilaiSiswaPerMapel(idRombel, idMapel) {
        const flatData = await this.query()
            .select([
                'nt.id_nilai', 'nt.tugas_ke', 'nt.nilai', 'nt.tanggal_input',
                's.nama_siswa AS siswa_nama_siswa', 's.nis_siswa AS siswa_nis_siswa'
            ])
            .join('public.anggota_rombel ar', 'nt.id_anggota = ar.id_anggota')
            .join('public.siswa s', 'ar.id_siswa = s.id_siswa')
            .where('ar.id_rombel', '=', idRombel)
            .where('nt.id_mapel', '=', idMapel)
            .get();

        return QueryBuilder.nestRelation(flatData, 'siswa', ['nama_siswa', 'nis_siswa']);
    }
}
export default new NilaiTugasModel();