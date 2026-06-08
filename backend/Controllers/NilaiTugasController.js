// src/Controllers/NilaiTugasController.js
import NilaiTugasModel from '../models/Kelas/NilaiTugasModel.js';
import QueryBuilder from '../Databases/QueryBuilder.js';

class NilaiTugasController {

    /**
     * Mendapatkan semua nilai tugas dengan info siswa (JOIN flat)
     * Endpoint: GET /nilai-tugas
     */
    async index(req, res) {
    try {
        const data = await NilaiTugasModel.withSiswa().get();
        // Hapus nestRelation — kirim flat
        res.status(200).json({ status: 'success', data });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
}

    async getByRombel(req, res) {
        try {
            const { id_rombel } = req.params;
            const data = await NilaiTugasModel.withSiswa()
                .where('anggota_rombel.id_rombel', '=', id_rombel)
                .get();
            res.status(200).json({ status: 'success', data }); // flat
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async getByRombelAndMapel(req, res) {
        try {
            const { id_rombel, id_mapel } = req.params;
            const data = await NilaiTugasModel.withSiswa()
                .where('anggota_rombel.id_rombel', '=', id_rombel)
                .where('nilai_tugas.id_mapel', '=', id_mapel)
                .get();
            res.status(200).json({ status: 'success', data }); // flat
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

export default new NilaiTugasController();