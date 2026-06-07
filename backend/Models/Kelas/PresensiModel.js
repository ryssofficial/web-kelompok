// src/models/Kelas/PresensiModel.js
import BaseModel from '../BaseModel.js';
import QueryBuilder from '../../Databases/QueryBuilder.js';

class PresensiModel extends BaseModel {
    constructor() {
        super(
            'public.presensi', 
            'id_presensi', 
            ['id_anggota', 'tugas_ke', 'tanggal_penilaian', 'status_kehadiran']
        );
    }

    // Method untuk mempermudah join default
    withSiswa() {
        return this.query()
            .select(['presensi.*', 'siswa.nama_siswa', 'siswa.nis_siswa'])
            .join('public.anggota_rombel', 'presensi.id_anggota = anggota_rombel.id_anggota')
            .join('public.siswa', 'anggota_rombel.id_siswa = siswa.id_siswa');
    }
}
export default new PresensiModel();