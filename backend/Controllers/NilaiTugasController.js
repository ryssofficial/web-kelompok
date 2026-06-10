import NilaiTugasModel from '../models/Kelas/NilaiTugasModel.js';

class NilaiTugasController {
    constructor() {
        this.index = this.index.bind(this);
        this.getByRombel = this.getByRombel.bind(this);
        this.getByRombelAndMapel = this.getByRombelAndMapel.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async index(req, res) {
        try {
            const data = await NilaiTugasModel.withSiswa().get();
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
            res.status(200).json({ status: 'success', data });
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
            res.status(200).json({ status: 'success', data });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async create(req, res) {
        try {
            const { id_anggota, id_mapel, tugas_ke, nilai, id_guru, tanggal_input } = req.body;
            if (!id_anggota || !id_mapel || !tugas_ke) {
                return res.status(400).json({ status: 'error', message: 'id_anggota, id_mapel, dan tugas_ke wajib diisi.' });
            }
            const data = await NilaiTugasModel.create({
                id_anggota,
                id_mapel,
                tugas_ke,
                nilai: nilai ?? null,
                id_guru: id_guru ?? null,
                tanggal_input: tanggal_input ?? new Date().toISOString().split('T')[0],
                catatan: req.body.catatan ?? null
            });
            res.status(201).json({ status: 'success', data });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { nilai, id_guru, catatan } = req.body;
            if (nilai === undefined || nilai === null) {
                return res.status(400).json({ status: 'error', message: 'Field nilai wajib diisi.' });
            }
            const data = await NilaiTugasModel.update(id, {
                nilai,
                ...(id_guru && { id_guru }),
                ...(catatan !== undefined && { catatan })
            });
            res.status(200).json({ status: 'success', data });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await NilaiTugasModel.delete(id);
            res.status(200).json({ status: 'success', message: 'Data nilai tugas berhasil dihapus.' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

export default new NilaiTugasController();