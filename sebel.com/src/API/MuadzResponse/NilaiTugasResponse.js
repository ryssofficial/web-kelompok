import { AxiosConfig } from "../AxiosConfig";
import { API_URL } from "../API_URL";

const NOTIF_URL = API_URL;
// ─────────────────────────────────────────────
// API: NilaiTugasResponse
// Base endpoint: /nilai-tugas
// ─────────────────────────────────────────────

export const NilaiTugasResponse = {

    // ── GET semua data nilai tugas ─────────────
    getAll: async () => {
        const response = await AxiosConfig.get("/nilai-tugas");
        return response.data;
    },

    // ── GET nilai tugas berdasarkan ID ─────────
    getById: async (id) => {
        const response = await AxiosConfig.get(`/nilai-tugas/${id}`);
        return response.data;
    },

    // ── GET nilai tugas berdasarkan siswa ──────
    getBySiswa: async (idSiswa) => {
        const response = await AxiosConfig.get(`/nilai-tugas/siswa/${idSiswa}`);
        return response.data;
    },

    // ── GET nilai tugas berdasarkan mata pelajaran ──
    getByMapel: async (mapel) => {
        const response = await AxiosConfig.get(`/nilai-tugas/mapel/${mapel}`);
        return response.data;
    },

    // ── POST tambah nilai tugas baru ───────────
    create: async (payload) => {
        // payload: { id_siswa, nama_siswa, nama_tugas, mata_pelajaran, nilai, tanggal_pengumpulan, keterangan }
        const response = await AxiosConfig.post("/nilai-tugas", payload);
        return response.data;
    },

    // ── PUT update nilai tugas ─────────────────
    update: async (id, payload) => {
        const response = await AxiosConfig.put(`/nilai-tugas/${id}`, payload);
        return response.data;
    },

    // ── DELETE hapus nilai tugas ───────────────
    delete: async (id) => {
        const response = await AxiosConfig.delete(`/nilai-tugas/${id}`);
        return response.data;
    },
};