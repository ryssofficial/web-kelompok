import { AxiosConfig } from "../AxiosConfig";

const KAS_URL = "/kas";
const PEMASUKKAN_KAS_URL = "/pemasukkan-kas";
const PENGELUARAN_KAS_URL = "/pengeluaran-kas";

/**
 * KasFitur - Kumpulan fungsi API untuk fitur Kas Kelas
 * Tabel terkait: kas, pemasukkan_kas, pengeluaran_kas
 */
export const KasFitur = {

    /**
     * Ambil data kas berdasarkan id_rombel
     * GET /api/kas?id_rombel=...
     * @param {number} id_rombel
     * @returns {Promise<{id_kas, id_rombel, saldo_kas}>}
     */
    getKasByRombel: async (id_rombel) => {
        try {
            const response = await AxiosConfig.get(KAS_URL, { id_rombel });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Ambil riwayat pemasukkan kas berdasarkan id_kas
     * GET /api/pemasukkan-kas?id_kas=...
     * @param {number} id_kas
     * @returns {Promise<Array>}
     */
    getRiwayatPemasukkan: async (id_kas) => {
        try {
            const response = await AxiosConfig.get(PEMASUKKAN_KAS_URL, { id_kas });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Ambil riwayat pengeluaran kas berdasarkan id_kas
     * GET /api/pengeluaran-kas?id_kas=...
     * @param {number} id_kas
     * @returns {Promise<Array>}
     */
    getRiwayatPengeluaran: async (id_kas) => {
        try {
            const response = await AxiosConfig.get(PENGELUARAN_KAS_URL, { id_kas });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Tambah pemasukkan kas kelas (hanya guru)
     * POST /api/pemasukkan-kas
     * @param {{ id_kas: number, id_guru: number, jumlah_masuk: number, keterangan: string }} payload
     * @returns {Promise}
     */
    tambahPemasukkan: async (payload) => {
        try {
            const response = await AxiosConfig.post(PEMASUKKAN_KAS_URL, {
                id_kas: payload.id_kas,
                id_guru: payload.id_guru,
                jumlah_masuk: payload.jumlah_masuk,
                keterangan: payload.keterangan || "",
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Tambah pengeluaran kas kelas (hanya guru)
     * POST /api/pengeluaran-kas
     * @param {{ id_kas: number, id_guru: number, jumlah_keluar: number, keterangan: string }} payload
     * @returns {Promise}
     */
    tambahPengeluaran: async (payload) => {
        try {
            const response = await AxiosConfig.post(PENGELUARAN_KAS_URL, {
                id_kas: payload.id_kas,
                id_guru: payload.id_guru,
                jumlah_keluar: payload.jumlah_keluar,
                keterangan: payload.keterangan || "",
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Hapus data pemasukkan kas berdasarkan id (hanya guru)
     * DELETE /api/pemasukkan-kas/:id
     * @param {number} id_pemasukkan_kas
     * @returns {Promise}
     */
    hapusPemasukkan: async (id_pemasukkan_kas) => {
        try {
            const response = await AxiosConfig.delete(PEMASUKKAN_KAS_URL, id_pemasukkan_kas);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Hapus data pengeluaran kas berdasarkan id (hanya guru)
     * DELETE /api/pengeluaran-kas/:id
     * @param {number} id_pengeluaran_kas
     * @returns {Promise}
     */
    hapusPengeluaran: async (id_pengeluaran_kas) => {
        try {
            const response = await AxiosConfig.delete(PENGELUARAN_KAS_URL, id_pengeluaran_kas);
            return response;
        } catch (error) {
            throw error;
        }
    },
};