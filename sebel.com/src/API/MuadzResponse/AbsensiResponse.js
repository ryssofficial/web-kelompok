// src/services/AbsensiResponse.js
import { AxiosConfig } from "../AxiosConfig";
import { API_URL } from "../API_URL";

export const AbsensiResponse = {
    getAll: async () => {
        try {
            const response = await AxiosConfig.get("/presensi");
            return response.data;
        } catch (error) {
            console.error("Gagal mengambil data, menggunakan mock data:", error);
            return {
                status: "success",
                data: [
                    { id_presensi: 1, id_anggota: 10, tugas_ke: 1, tanggal_penilaian: "2026-05-20", status_kehadiran: "Hadir", nama_siswa: "Budi Santoso", nis_siswa: "0012345" },
                    { id_presensi: 2, id_anggota: 11, tugas_ke: 1, tanggal_penilaian: "2026-05-20", status_kehadiran: "Izin", nama_siswa: "Siti Rahayu", nis_siswa: "0012346" },
                    { id_presensi: 3, id_anggota: 12, tugas_ke: 2, tanggal_penilaian: "2026-05-21", status_kehadiran: "Sakit", nama_siswa: "Ahmad Fauzi", nis_siswa: "0012347" }
                ]
            };
        }
    },

    getByRombel: async (idRombel) => {
        try {
            const response = await AxiosConfig.get(`/presensi/rombel/${idRombel}`);
            return response.data;
        } catch (error) {
            console.error(`Gagal mengambil data rombel ${idRombel}:`, error);
            throw error;
        }
    },

    // 🛠️ TAMBAHKAN FUNGSI INI AGAR TOMBOL DELETE BERFUNGSI
    delete: async (idPresensi) => {
        try {
            // Asumsi endpoint delete di backend adalah DELETE /api/presensi/:id
            const response = await AxiosConfig.delete(`/presensi/${idPresensi}`);
            return response.data;
        } catch (error) {
            console.error(`Gagal menghapus data presensi ${idPresensi}:`, error);
            throw error;
        }
    }
};