import PresensiModel from '../models/Kelas/PresensiModel.js';

// DB constraint: status_kehadiran character(1) IN ('H','I','S','A')
const STATUS_VALID = ['H', 'I', 'S', 'A'];

class PresensiController {
    constructor() {
        this.index       = this.index.bind(this);
        this.getByRombel = this.getByRombel.bind(this);
        this.create      = this.create.bind(this);
        this.delete      = this.delete.bind(this);
    }

    async index(req, res) {
        try {
            const data = await PresensiModel.withSiswa().get();
            res.status(200).json({ status: 'success', data });
        } catch (error) {
            console.error('[PresensiController.index]', error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async getByRombel(req, res) {
        try {
            const { id_rombel } = req.params;
            const data = await PresensiModel.withSiswa()
                .where('anggota_rombel.id_rombel', '=', id_rombel)
                .get();
            res.status(200).json({ status: 'success', data });
        } catch (error) {
            console.error('[PresensiController.getByRombel]', error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async create(req, res) {
        try {
            const { id_anggota, tugas_ke, status_kehadiran, tanggal_penilaian } = req.body;

            // ── Validasi field wajib ──
            if (!id_anggota || !tugas_ke || !status_kehadiran) {
                return res.status(400).json({
                    status: 'error',
                    message: 'id_anggota, tugas_ke, dan status_kehadiran wajib diisi.',
                    received: req.body,
                });
            }

            // ── Validasi status: harus 1 char H/I/S/A (DB constraint) ──
            const statusChar = String(status_kehadiran).trim().toUpperCase();
            if (!STATUS_VALID.includes(statusChar)) {
                return res.status(400).json({
                    status: 'error',
                    message: `status_kehadiran tidak valid: "${status_kehadiran}". Harus salah satu dari: H (Hadir), I (Izin), S (Sakit), A (Alpha)`,
                });
            }

            const data = await PresensiModel.create({
                id_anggota:       Number(id_anggota),
                tugas_ke:         Number(tugas_ke),
                status_kehadiran: statusChar,   // simpan sebagai 1 char ke DB
                tanggal_penilaian: tanggal_penilaian ?? new Date().toISOString().split('T')[0],
            });

            res.status(201).json({ status: 'success', data });

        } catch (error) {
            console.error('[PresensiController.create] ERROR:', {
                message: error.message,
                detail:  error?.detail,
                hint:    error?.hint,
                body:    req.body,
            });
            res.status(500).json({
                status: 'error',
                message: error.message,
                detail: error?.detail ?? null,
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await PresensiModel.delete(id);
            res.status(200).json({ status: 'success', message: 'Data presensi berhasil dihapus.' });
        } catch (error) {
            console.error('[PresensiController.delete]', error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

export default new PresensiController();