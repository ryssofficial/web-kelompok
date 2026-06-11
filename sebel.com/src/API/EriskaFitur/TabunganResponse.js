import { AxiosConfig } from "../AxiosConfig";

const TABUNGAN_URL = "/tabungan";
const PEMASUKKAN_URL = "/tabungan/setor";   // ✅ diperbaiki
const PENGELUARAN_URL = "/tabungan/tarik";  // ✅ diperbaiki

/**
 * TabunganFitur - Kumpulan fungsi API untuk fitur Tabungan Siswa
 * Tabel terkait: tabungan, pemasukkan, pengeluaran
 * Catatan: DB trigger otomatis update saldo_total & validasi anti-saldo-negatif
 */
export const TabunganFitur = {

    /**
     * Ambil semua tabungan siswa berdasarkan id_rombel
     * GET /api/tabungan?id_rombel=...
     */
    getTabunganByRombel: async (id_rombel) => {
        try {
            const response = await AxiosConfig.get(TABUNGAN_URL, { id_rombel });
            return response;
        } catch (error) {
            return [ // ✅ return dan array dijadikan satu baris
                { id_tabungan: 1, id_anggota: 1, id_rombel, saldo_total: 200000, nama_siswa: "Budi Santoso" },
                { id_tabungan: 2, id_anggota: 2, id_rombel, saldo_total: 150000, nama_siswa: "Siti Rahayu" },
                { id_tabungan: 3, id_anggota: 3, id_rombel, saldo_total: 320000, nama_siswa: "Ahmad Fauzi" },
            ];
        }
    },

    /**
     * Ambil detail tabungan satu siswa berdasarkan id_tabungan
     * GET /api/tabungan/:id_tabungan
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
     * Ambil riwayat setor tabungan berdasarkan id_tabungan
     * GET /api/tabungan/setor?id_tabungan=...
     */
    getRiwayatSetor: async (id_tabungan) => {
        try {
            const response = await AxiosConfig.get(PEMASUKKAN_URL, { id_tabungan });
            return response;
        } catch (error) {
            return [ // ✅ diperbaiki
                { id_pemasukkan: 1, id_tabungan, tanggal_masuk: "2025-04-15T00:00:00Z", jumlah_masuk: 100000, keterangan: "Setor April" },
                { id_pemasukkan: 2, id_tabungan, tanggal_masuk: "2025-05-01T00:00:00Z", jumlah_masuk: 100000, keterangan: "Setor Mei" },
            ];
        }
    },

    /**
     * Ambil riwayat tarik tabungan berdasarkan id_tabungan
     * GET /api/tabungan/tarik?id_tabungan=...
     */
    getRiwayatTarik: async (id_tabungan) => {
        try {
            const response = await AxiosConfig.get(PENGELUARAN_URL, { id_tabungan });
            return response;
        } catch (error) {
            return [ // ✅ diperbaiki
                { id_pengeluaran: 1, id_tabungan, tanggal_keluar: "2025-05-05T00:00:00Z", jumlah_keluar: 50000, keterangan: "Ambil jajan" },
            ];
        }
    },

    /**
     * Setor tabungan siswa (hanya guru)
     * POST /api/tabungan/setor
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
     * POST /api/tabungan/tarik
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
     * DELETE /api/tabungan/setor/:id
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
     * DELETE /api/tabungan/tarik/:id
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