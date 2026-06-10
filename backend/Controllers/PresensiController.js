// src/Controller/PresensiController.js
import PresensiModel from '../models/Kelas/PresensiModel.js';
import { CaseConverter } from '../utils/CaseConverter.js';
import QueryBuilder from '../Databases/QueryBuilder.js';

class PresensiController {
    /**
     * Mendapatkan daftar presensi siswa dengan informasi lengkap (JOIN)
     * Endpoint: GET /presensi
     */
    async index(req, res) {
        try {
            // Menggunakan method dari model yang sudah kita buat
            const data = await PresensiModel.withSiswa().get();
            
            // Menggunakan fungsi nestRelation jika ingin mengubah hasil flat 
            // menjadi object bersarang (misal: { id: 1, siswa: { nama: '...' } })
            // QueryBuilder.nestRelation(data, 'siswa', ['nama_siswa', 'nis_siswa']);

            res.status(200).json({
                status: 'success',
                data: data
            });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    /**
     * Mendapatkan presensi spesifik dengan filter
     */
    async getByRombel(req, res) {
        try {
            const { id_rombel } = req.params;
            
            const data = await PresensiModel.withSiswa()
                .where('anggota_rombel.id_rombel', '=', id_rombel)
                .get();

            res.status(200).json({ status: 'success', data });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

export default new PresensiController();