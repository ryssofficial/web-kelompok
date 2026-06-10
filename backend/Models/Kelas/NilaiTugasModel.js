// src/models/Kelas/NilaiTugasModel.js
import BaseModel from '../BaseModel.js';
import QueryBuilder from '../../Databases/QueryBuilder.js';

class NilaiTugasModel extends BaseModel {
    constructor() {
        super(
            'public.nilai_tugas',
            'id_nilai',
            ['id_anggota', 'id_mapel', 'tugas_ke', 'nilai', 'id_guru', 'tanggal_input','catatan']
        );
    }

    /**
     * Join default: nilai_tugas + anggota_rombel + siswa
     * Menggunakan nama tabel utuh tanpa alias (Persis seperti PresensiModel)
     */
    withSiswa() {
        return this.query()
            .select([
                'nilai_tugas.*',
                'siswa.nama_siswa',
                'siswa.nis_siswa'
            ])
            .join('public.anggota_rombel', 'nilai_tugas.id_anggota = anggota_rombel.id_anggota')
            .join('public.siswa', 'anggota_rombel.id_siswa = siswa.id_siswa');
    }

    /**
     * Mengambil daftar nilai tugas siswa pada mapel tertentu dalam suatu kelas
     * Memanfaatkan method withSiswa() agar penamaan kolom stabil bagi nestRelation
     */
    async listNilaiSiswaPerMapel(idRombel, idMapel) {
        const flatData = await this.withSiswa()
            .where('anggota_rombel.id_rombel', '=', idRombel)
            .where('nilai_tugas.id_mapel', '=', idMapel)
            .get();

        // nestRelation sekarang dijamin 100% mendapatkan flatData dengan kolom 'nama_siswa' & 'nis_siswa' yang bersih
        return QueryBuilder.nestRelation(flatData, 'siswa', ['nama_siswa', 'nis_siswa']);
    }
}

export default new NilaiTugasModel();