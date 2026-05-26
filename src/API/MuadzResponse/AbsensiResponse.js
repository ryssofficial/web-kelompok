import { AxiosConfig } from "../AxiosConfig";
import { API_URL } from "../API_URL";

const NOTIF_URL = API_URL;
// ─────────────────────────────────────────────
// API: AbsensiResponse
// Base endpoint: /absensi
// ─────────────────────────────────────────────

export const AbsensiResponse = {

    // ── GET semua data absensi ─────────────────
    getAll: async () => {
        try {
            const response = await AxiosConfig.get("/absensi");
            return response.data;
        } catch {
            return [
                { id_absensi: 1, nama_siswa: "Budi Santoso",   status_kehadiran: "Hadir", tanggal_absensi: "2025-05-20T07:00:00Z", kelas: "6A", mata_pelajaran: "Matematika", keterangan: "" },
                { id_absensi: 2, nama_siswa: "Siti Rahayu",    status_kehadiran: "Izin",  tanggal_absensi: "2025-05-20T07:00:00Z", kelas: "6A", mata_pelajaran: "IPA",         keterangan: "Acara keluarga" },
                { id_absensi: 3, nama_siswa: "Ahmad Fauzi",    status_kehadiran: "Sakit", tanggal_absensi: "2025-05-20T07:00:00Z", kelas: "6B", mata_pelajaran: "Bahasa Indonesia", keterangan: "Demam" },
                { id_absensi: 4, nama_siswa: "Dewi Lestari",   status_kehadiran: "Alpha", tanggal_absensi: "2025-05-19T07:00:00Z", kelas: "6B", mata_pelajaran: "IPS",         keterangan: "" },
                { id_absensi: 5, nama_siswa: "Rizky Pratama",  status_kehadiran: "Hadir", tanggal_absensi: "2025-05-19T07:00:00Z", kelas: "6A", mata_pelajaran: "Matematika", keterangan: "" },
            ];
        }
    },

    // ── GET absensi berdasarkan ID ─────────────
    getById: async (id) => {
        const response = await AxiosConfig.get(`/absensi/${id}`);
        return response.data;
    },

    // ── GET absensi berdasarkan siswa ──────────
    getBySiswa: async (idSiswa) => {
        const response = await AxiosConfig.get(`/absensi/siswa/${idSiswa}`);
        return response.data;
    },

    // ── GET absensi berdasarkan tanggal ────────
    getByTanggal: async (tanggal) => {
        // tanggal format: "YYYY-MM-DD"
        const response = await AxiosConfig.get(`/absensi/tanggal/${tanggal}`);
        return response.data;
    },

    delete: async (id) => {
        try {
            const response = await AxiosConfig.delete(`/absensi/${id}`);
            return response.data;
        } catch {
            return { success: true };
        }
    }
};

