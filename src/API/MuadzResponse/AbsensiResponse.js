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
        const response = await AxiosConfig.get("/absensi");
        return response.data;
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

    
};

