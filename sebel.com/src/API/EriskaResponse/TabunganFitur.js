import { AxiosConfig } from "../AxiosConfig";

const TABUNGAN_URL = "/tabungan";
const PEMASUKKAN_URL = "/pemasukkan";
const PENGELUARAN_URL = "/pengeluaran";

/**
 * TabunganFitur - Kumpulan fungsi API untuk fitur Tabungan Siswa
 * Tabel terkait: tabungan, pemasukkan, pengeluaran
 * Catatan: DB trigger otomatis update saldo_total & validasi anti-saldo-negatif
 */
export const TabunganFitur = {

    /**
     * Ambil semua tabungan siswa berdasarkan id_rombel
     * GET /api/tabungan?id_rombel=...
     * @param {number} id_rombel
     * @returns {Promise<Array<{id_tabungan, id_anggota, id_rombel, saldo_total, nama_siswa}>>}
     */
    getTabunganByRombel: async (id_rombel) => {
        try {
            const response = await AxiosConfig.get(TABUNGAN_URL, { id_rombel });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Ambil detail tabungan satu siswa berdasarkan id_tabungan
     * GET /api/tabungan/:id_tabungan
     * @param {number} id_tabungan
     * @returns {Promise<{id_tabungan, id_anggota, saldo_total}>}
     */
    getDetailTabungan: async (id_tabungan) => {
        try {
            const response = await AxiosConfig.get(TABUNGAN_URL, id_tabungan);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Ambil riwayat setor (pemasukkan) tabungan berdasarkan id_tabungan
     * GET /api/pemasukkan?id_tabungan=...
     * @param {number} id_tabungan
     * @returns {Promise<Array>}
     */
    getRiwayatSetor: async (id_tabungan) => {
        try {
            const response = await AxiosConfig.get(PEMASUKKAN_URL, { id_tabungan });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Ambil riwayat tarik (pengeluaran) tabungan berdasarkan id_tabungan
     * GET /api/pengeluaran?id_tabungan=...
     * @param {number} id_tabungan
     * @returns {Promise<Array>}
     */
    getRiwayatTarik: async (id_tabungan) => {
        try {
            const response = await AxiosConfig.get(PENGELUARAN_URL, { id_tabungan });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Setor tabungan siswa (hanya guru)
     * POST /api/pemasukkan
     * @param {{ id_tabungan: number, id_guru: number, jumlah_masuk: number, keterangan: string }} payload
     * @returns {Promise}
     */
    setorTabungan: async (payload) => {
        try {
            const response = await AxiosConfig.post(PEMASUKKAN_URL, {
                id_tabungan: payload.id_tabungan,
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
     * Tarik tabungan siswa (hanya guru)
     * POST /api/pengeluaran
     * Validasi saldo tidak cukup ditangani oleh trigger DB (fn_cek_saldo_tabungan_cukup)
     * @param {{ id_tabungan: number, id_guru: number, jumlah_keluar: number, keterangan: string }} payload
     * @returns {Promise}
     */
    tarikTabungan: async (payload) => {
        try {
            const response = await AxiosConfig.post(PENGELUARAN_URL, {
                id_tabungan: payload.id_tabungan,
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
     * Hapus riwayat setor tabungan (hanya guru)
     * DELETE /api/pemasukkan/:id
     * Trigger DB otomatis kurangi saldo_total
     * @param {number} id_pemasukkan
     * @returns {Promise}
     */
    hapusSetor: async (id_pemasukkan) => {
        try {
            const response = await AxiosConfig.delete(PEMASUKKAN_URL, id_pemasukkan);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Hapus riwayat tarik tabungan (hanya guru)
     * DELETE /api/pengeluaran/:id
     * Trigger DB otomatis kembalikan saldo_total
     * @param {number} id_pengeluaran
     * @returns {Promise}
     */
    hapusTarik: async (id_pengeluaran) => {
        try {
            const response = await AxiosConfig.delete(PENGELUARAN_URL, id_pengeluaran);
            return response;
        } catch (error) {
            throw error;
        }
    },
};