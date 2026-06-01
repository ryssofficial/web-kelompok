import BaseController from "./BaseController.js";
import { sendResponse, sendError, sendNotFound } from "../Utils/Response.js";
import BaseModel from "../models/BaseModel.js";

// ── Model Imports ──────────────────────────────────────────────────────────────
import KasModel from "../Models/System/KasModel.js"; 
import PemasukkanKasModel from "../Models/System/PemasukkanKasModel.js";
import PengeluaranKasModel from "../Models/System/PengeluaranKasModel.js";

import TabunganModel from "../Models/Tabungan/TabunganModel.js";
import PemasukkanModel from "../Models/Tabungan/PemasukkanModel.js";
import PengeluaranModel from "../Models/Tabungan/PengeluaranModel.js";
/**
 * KeuanganController
 * Menangani semua endpoint fitur Kas Kelas dan Tabungan Siswa.
 * Mengikuti Template Method Pattern dari BaseController.
 */
class KeuanganController extends BaseController {
    constructor() {
        super(null); // Tidak ada model tunggal, controller ini multi-model
    }

    // ============================================================
    // SECTION 1: KAS KELAS
    // Tabel: kas, pemasukkan_kas, pengeluaran_kas
    // ============================================================

    /**
     * GET /kas?id_rombel=...
     * Ambil data kas berdasarkan id_rombel.
     * Diakses guru maupun siswa (read-only untuk siswa).
     */
    getKasByRombel = async (req, res) => {
        await this.execute(res, async () => {
            const { id_rombel } = req.query;

            if (!id_rombel) {
                return sendError(res, 400, "Parameter id_rombel wajib diisi.");
            }

            const kas = await KasModel.query()
                .where("id_rombel", "=", id_rombel)
                .first();

            if (!kas) {
                return sendNotFound(res, `Data kas untuk rombel ID ${id_rombel} tidak ditemukan.`);
            }

            return sendResponse(res, 200, "Data kas berhasil diambil.", kas);
        });
    }

    /**
     * GET /pemasukkan-kas?id_kas=...
     * Ambil riwayat pemasukkan kas berdasarkan id_kas.
     */
    getRiwayatPemasukkanKas = async (req, res) => {
        await this.execute(res, async () => {
            const { id_kas } = req.query;

            if (!id_kas) {
                return sendError(res, 400, "Parameter id_kas wajib diisi.");
            }

            const data = await PemasukkanKasModel.query()
                .where("id_kas", "=", id_kas)
                .orderBy("tanggal_masuk", "DESC")
                .get();

            return sendResponse(res, 200, "Riwayat pemasukkan kas berhasil diambil.", data);
        });
    }

    /**
     * GET /pengeluaran-kas?id_kas=...
     * Ambil riwayat pengeluaran kas berdasarkan id_kas.
     */
    getRiwayatPengeluaranKas = async (req, res) => {
        await this.execute(res, async () => {
            const { id_kas } = req.query;

            if (!id_kas) {
                return sendError(res, 400, "Parameter id_kas wajib diisi.");
            }

            const data = await PengeluaranKasModel.query()
                .where("id_kas", "=", id_kas)
                .orderBy("tanggal_keluar", "DESC")
                .get();

            return sendResponse(res, 200, "Riwayat pengeluaran kas berhasil diambil.", data);
        });
    }

    /**
     * POST /pemasukkan-kas
     * Tambah pemasukkan kas kelas. Hanya guru.
     * Saldo kas otomatis diperbarui oleh trigger DB (fn_update_saldo_kas).
     * Body: { id_kas, jumlah_masuk, keterangan }
     */
    tambahPemasukkanKas = async (req, res) => {
        await this.execute(res, async () => {
            let idGuru = req.user.id;

            // Konversi google_id ke id_guru jika perlu
            if (isNaN(idGuru) || String(idGuru).length > 10) {
                const db = (await import("../db.js")).default;
                const hasil = await db.query(
                    `SELECT id_guru FROM public.guru WHERE google_id = $1`, [idGuru]
                );
                idGuru = hasil.rows[0]?.id_guru;
            }

            if (!idGuru) {
                return sendError(res, 404, "Data guru tidak ditemukan.");
            }

            const { id_kas, jumlah_masuk, keterangan } = req.body;

            if (!id_kas || !jumlah_masuk) {
                return sendError(res, 400, "id_kas dan jumlah_masuk wajib diisi.");
            }

            if (parseFloat(jumlah_masuk) <= 0) {
                return sendError(res, 400, "Jumlah masuk harus lebih dari 0.");
            }

            // Cek kas ada
            const kas = await KasModel.query()
                .where("id_kas", "=", id_kas)
                .first();

            if (!kas) {
                return sendNotFound(res, `Kas dengan ID ${id_kas} tidak ditemukan.`);
            }

            const dataBaru = await PemasukkanKasModel.create({
                id_kas,
                id_guru: idGuru,
                jumlah_masuk: parseFloat(jumlah_masuk),
                keterangan: keterangan || null,
            });

            return sendResponse(res, 201, "Pemasukkan kas berhasil dicatat.", dataBaru);
        });
    }

    /**
     * POST /pengeluaran-kas
     * Tambah pengeluaran kas kelas. Hanya guru.
     * Body: { id_kas, jumlah_keluar, keterangan }
     */
    tambahPengeluaranKas = async (req, res) => {
        await this.execute(res, async () => {
            let idGuru = req.user.id;

            if (isNaN(idGuru) || String(idGuru).length > 10) {
                const db = (await import("../db.js")).default;
                const hasil = await db.query(
                    `SELECT id_guru FROM public.guru WHERE google_id = $1`, [idGuru]
                );
                idGuru = hasil.rows[0]?.id_guru;
            }

            if (!idGuru) {
                return sendError(res, 404, "Data guru tidak ditemukan.");
            }

            const { id_kas, jumlah_keluar, keterangan } = req.body;

            if (!id_kas || !jumlah_keluar) {
                return sendError(res, 400, "id_kas dan jumlah_keluar wajib diisi.");
            }

            if (parseFloat(jumlah_keluar) <= 0) {
                return sendError(res, 400, "Jumlah keluar harus lebih dari 0.");
            }

            // Cek saldo kas mencukupi
            const kas = await KasModel.query()
                .where("id_kas", "=", id_kas)
                .first();

            if (!kas) {
                return sendNotFound(res, `Kas dengan ID ${id_kas} tidak ditemukan.`);
            }

            if (parseFloat(kas.saldoKas) < parseFloat(jumlah_keluar)) {
                return sendError(res, 400, `Saldo kas tidak mencukupi. Sisa saldo: Rp ${kas.saldoKas}`);
            }

            const dataBaru = await PengeluaranKasModel.create({
                id_kas,
                id_guru: idGuru,
                jumlah_keluar: parseFloat(jumlah_keluar),
                keterangan: keterangan || null,
            });

            return sendResponse(res, 201, "Pengeluaran kas berhasil dicatat.", dataBaru);
        });
    }

    /**
     * DELETE /pemasukkan-kas/:id
     * Hapus pemasukkan kas. Hanya guru.
     */
    hapusPemasukkanKas = async (req, res) => {
        await this.execute(res, async () => {
            const { id } = req.params;

            const data = await PemasukkanKasModel.query()
                .where("id_pemasukkan_kas", "=", id)
                .first();

            if (!data) {
                return sendNotFound(res, `Pemasukkan kas ID ${id} tidak ditemukan.`);
            }

            await PemasukkanKasModel.query()
                .where("id_pemasukkan_kas", "=", id)
                .delete();

            return sendResponse(res, 200, "Pemasukkan kas berhasil dihapus.");
        });
    }

    /**
     * DELETE /pengeluaran-kas/:id
     * Hapus pengeluaran kas. Hanya guru.
     */
    hapusPengeluaranKas = async (req, res) => {
        await this.execute(res, async () => {
            const { id } = req.params;

            const data = await PengeluaranKasModel.query()
                .where("id_pengeluaran_kas", "=", id)
                .first();

            if (!data) {
                return sendNotFound(res, `Pengeluaran kas ID ${id} tidak ditemukan.`);
            }

            await PengeluaranKasModel.query()
                .where("id_pengeluaran_kas", "=", id)
                .delete();

            return sendResponse(res, 200, "Pengeluaran kas berhasil dihapus.");
        });
    }

    // ============================================================
    // SECTION 2: TABUNGAN SISWA
    // Tabel: tabungan, pemasukkan, pengeluaran
    // ============================================================

    /**
     * GET /tabungan?id_rombel=...
     * Ambil daftar tabungan semua siswa di rombel tertentu.
     * Bergabung dengan nama siswa dari anggota_rombel & siswa.
     */
    getTabunganByRombel = async (req, res) => {
        await this.execute(res, async () => {
            const { id_rombel } = req.query;

            if (!id_rombel) {
                return sendError(res, 400, "Parameter id_rombel wajib diisi.");
            }

            const db = (await import("../db.js")).default;

            const result = await db.query(`
                SELECT
                    t.id_tabungan      AS "idTabungan",
                    t.id_anggota       AS "idAnggota",
                    t.id_rombel        AS "idRombel",
                    t.saldo_total      AS "saldoTotal",
                    s.nama_siswa       AS "namaSiswa",
                    s.nis_siswa        AS "nisSiswa"
                FROM public.tabungan t
                JOIN public.anggota_rombel ar ON t.id_anggota = ar.id_anggota
                JOIN public.siswa s ON ar.id_siswa = s.id_siswa
                WHERE t.id_rombel = $1
                ORDER BY s.nama_siswa ASC
            `, [id_rombel]);

            return sendResponse(res, 200, "Data tabungan siswa berhasil diambil.", result.rows);
        });
    }

    /**
     * GET /tabungan/:id
     * Ambil detail tabungan satu siswa berdasarkan id_tabungan.
     */
    getDetailTabungan = async (req, res) => {
        await this.execute(res, async () => {
            const { id } = req.params;

            const data = await TabunganModel.query()
                .where("id_tabungan", "=", id)
                .first();

            if (!data) {
                return sendNotFound(res, `Tabungan ID ${id} tidak ditemukan.`);
            }

            return sendResponse(res, 200, "Detail tabungan berhasil diambil.", data);
        });
    }

    /**
     * GET /pemasukkan?id_tabungan=...
     * Ambil riwayat setor tabungan berdasarkan id_tabungan.
     */
    getRiwayatSetor = async (req, res) => {
        await this.execute(res, async () => {
            const { id_tabungan } = req.query;

            if (!id_tabungan) {
                return sendError(res, 400, "Parameter id_tabungan wajib diisi.");
            }

            const data = await PemasukkanModel.query()
                .where("id_tabungan", "=", id_tabungan)
                .orderBy("tanggal_masuk", "DESC")
                .get();

            return sendResponse(res, 200, "Riwayat setor tabungan berhasil diambil.", data);
        });
    }

    /**
     * GET /pengeluaran?id_tabungan=...
     * Ambil riwayat tarik tabungan berdasarkan id_tabungan.
     */
    getRiwayatTarik = async (req, res) => {
        await this.execute(res, async () => {
            const { id_tabungan } = req.query;

            if (!id_tabungan) {
                return sendError(res, 400, "Parameter id_tabungan wajib diisi.");
            }

            const data = await PengeluaranModel.query()
                .where("id_tabungan", "=", id_tabungan)
                .orderBy("tanggal_keluar", "DESC")
                .get();

            return sendResponse(res, 200, "Riwayat tarik tabungan berhasil diambil.", data);
        });
    }

    /**
     * POST /pemasukkan
     * Setor tabungan siswa. Hanya guru.
     * Saldo otomatis bertambah via trigger DB (trg_update_saldo_masuk).
     * Body: { id_tabungan, jumlah_masuk, keterangan }
     */
    setorTabungan = async (req, res) => {
        await this.execute(res, async () => {
            let idGuru = req.user.id;

            if (isNaN(idGuru) || String(idGuru).length > 10) {
                const db = (await import("../db.js")).default;
                const hasil = await db.query(
                    `SELECT id_guru FROM public.guru WHERE google_id = $1`, [idGuru]
                );
                idGuru = hasil.rows[0]?.id_guru;
            }

            if (!idGuru) {
                return sendError(res, 404, "Data guru tidak ditemukan.");
            }

            const { id_tabungan, jumlah_masuk, keterangan } = req.body;

            if (!id_tabungan || !jumlah_masuk) {
                return sendError(res, 400, "id_tabungan dan jumlah_masuk wajib diisi.");
            }

            if (parseFloat(jumlah_masuk) <= 0) {
                return sendError(res, 400, "Jumlah setor harus lebih dari 0.");
            }

            // Cek tabungan ada
            const tabungan = await TabunganModel.query()
                .where("id_tabungan", "=", id_tabungan)
                .first();

            if (!tabungan) {
                return sendNotFound(res, `Tabungan ID ${id_tabungan} tidak ditemukan.`);
            }

            const dataBaru = await PemasukkanModel.create({
                id_tabungan,
                id_guru: idGuru,
                jumlah_masuk: parseFloat(jumlah_masuk),
                keterangan: keterangan || null,
            });

            return sendResponse(res, 201, "Setor tabungan berhasil dicatat.", dataBaru);
        });
    }

    /**
     * POST /pengeluaran
     * Tarik tabungan siswa. Hanya guru.
     * Validasi saldo tidak cukup ditangani trigger DB (fn_cek_saldo_tabungan_cukup).
     * Body: { id_tabungan, jumlah_keluar, keterangan }
     */
    tarikTabungan = async (req, res) => {
        await this.execute(res, async () => {
            let idGuru = req.user.id;

            if (isNaN(idGuru) || String(idGuru).length > 10) {
                const db = (await import("../db.js")).default;
                const hasil = await db.query(
                    `SELECT id_guru FROM public.guru WHERE google_id = $1`, [idGuru]
                );
                idGuru = hasil.rows[0]?.id_guru;
            }

            if (!idGuru) {
                return sendError(res, 404, "Data guru tidak ditemukan.");
            }

            const { id_tabungan, jumlah_keluar, keterangan } = req.body;

            if (!id_tabungan || !jumlah_keluar) {
                return sendError(res, 400, "id_tabungan dan jumlah_keluar wajib diisi.");
            }

            if (parseFloat(jumlah_keluar) <= 0) {
                return sendError(res, 400, "Jumlah tarik harus lebih dari 0.");
            }

            // Cek tabungan ada
            const tabungan = await TabunganModel.query()
                .where("id_tabungan", "=", id_tabungan)
                .first();

            if (!tabungan) {
                return sendNotFound(res, `Tabungan ID ${id_tabungan} tidak ditemukan.`);
            }

            // Validasi saldo sebelum insert, trigger DB juga akan menolak jika tidak cukup
            if (parseFloat(tabungan.saldoTotal) < parseFloat(jumlah_keluar)) {
                return sendError(
                    res, 400,
                    `Saldo tidak mencukupi! Sisa saldo: Rp ${tabungan.saldoTotal}`
                );
            }

            const dataBaru = await PengeluaranModel.create({
                id_tabungan,
                id_guru: idGuru,
                jumlah_keluar: parseFloat(jumlah_keluar),
                keterangan: keterangan || null,
            });

            return sendResponse(res, 201, "Tarik tabungan berhasil dicatat.", dataBaru);
        });
    }

    /**
     * DELETE /pemasukkan/:id
     * Hapus riwayat setor tabungan. Hanya guru.
     * Trigger DB (trg_update_saldo_masuk) otomatis kurangi saldo.
     */
    hapusSetor = async (req, res) => {
        await this.execute(res, async () => {
            const { id } = req.params;

            const data = await PemasukkanModel.query()
                .where("id_pemasukkan", "=", id)
                .first();

            if (!data) {
                return sendNotFound(res, `Data setor ID ${id} tidak ditemukan.`);
            }

            await PemasukkanModel.query()
                .where("id_pemasukkan", "=", id)
                .delete();

            return sendResponse(res, 200, "Riwayat setor berhasil dihapus.");
        });
    }

    /**
     * DELETE /pengeluaran/:id
     * Hapus riwayat tarik tabungan. Hanya guru.
     * Trigger DB (trg_update_saldo_keluar) otomatis kembalikan saldo.
     */
    hapusTarik = async (req, res) => {
        await this.execute(res, async () => {
            const { id } = req.params;

            const data = await PengeluaranModel.query()
                .where("id_pengeluaran", "=", id)
                .first();

            if (!data) {
                return sendNotFound(res, `Data tarik ID ${id} tidak ditemukan.`);
            }

            await PengeluaranModel.query()
                .where("id_pengeluaran", "=", id)
                .delete();

            return sendResponse(res, 200, "Riwayat tarik berhasil dihapus.");
        });
    }
}

export default new KeuanganController();