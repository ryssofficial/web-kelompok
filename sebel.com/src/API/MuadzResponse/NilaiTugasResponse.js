import { AxiosConfig } from "../AxiosConfig";

// ─────────────────────────────────────────────
// API: NilaiTugasResponse
// Base endpoint: /nilai-tugas
// Sinkron dengan NilaiTugasModel backend:
//   - primary key  : id_nilai
//   - relasi siswa : { siswa: { nama_siswa, nis_siswa } }  (nested via nestRelation)
//   - filter utama : per rombel + per mapel
// ─────────────────────────────────────────────

export const NilaiTugasResponse = {

    // ── GET semua data nilai tugas ─────────────
    // Response: [{ id_nilai, tugas_ke, nilai, tanggal_input, siswa: { nama_siswa, nis_siswa } }]
    getAll: async () => {
        const response = await AxiosConfig.get("/nilai-tugas");
        return response.data;
    },

    // ── GET nilai tugas berdasarkan ID ─────────
    getById: async (id) => {
        const response = await AxiosConfig.get(`/nilai-tugas/${id}`);
        return response.data;
    },

    // ── GET nilai tugas per rombel (endpoint utama) ──
    // Cocok dengan: NilaiTugasModel.listNilaiSiswaPerMapel(idRombel, idMapel)
    getByRombelAndMapel: async (idRombel, idMapel) => {
        const response = await AxiosConfig.get(`/nilai-tugas/rombel/${idRombel}/mapel/${idMapel}`);
        return response.data;
    },

    // ── GET nilai tugas per rombel saja ───────
    getByRombel: async (idRombel) => {
        const response = await AxiosConfig.get(`/nilai-tugas/rombel/${idRombel}`);
        return response.data;
    },

    // ── POST tambah nilai tugas baru ───────────
    // payload sesuai fillable backend:
    // { id_anggota, id_mapel, tugas_ke, nilai, id_guru, tanggal_input }
    create: async (payload) => {
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