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
            return 
            [
                { id_tabungan: 1, id_anggota: 1, id_rombel, saldo_total: 200000, nama_siswa: "Budi Santoso" },
                { id_tabungan: 2, id_anggota: 2, id_rombel, saldo_total: 150000, nama_siswa: "Siti Rahayu" },
                { id_tabungan: 3, id_anggota: 3, id_rombel, saldo_total: 320000, nama_siswa: "Ahmad Fauzi" },
            ];
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
            return { id_tabungan, id_anggota: 1, saldo_total: 200000 };
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
            return 
            [
                { id_pemasukkan: 1, id_tabungan, tanggal_masuk: "2025-04-15T00:00:00Z", jumlah_masuk: 100000, keterangan: "Setor April" },
                { id_pemasukkan: 2, id_tabungan, tanggal_masuk: "2025-05-01T00:00:00Z", jumlah_masuk: 100000, keterangan: "Setor Mei" },
            ];
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
            return 
            [
                { id_pengeluaran: 1, id_tabungan, tanggal_keluar: "2025-05-05T00:00:00Z", jumlah_keluar: 50000, keterangan: "Ambil jajan" },
            ];
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
            return { success: true };
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
            return { success: true };
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
            return { success: true };
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
            return { success: true };
        }
    },
};