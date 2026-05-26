import { AxiosConfig } from '../AxiosConfig';

// Sesuaikan endpoint ini dengan routing di backend Node.js kamu
const ENDPOINT = '/api/jadwal'; 

export const JadwalAPI = {
    // Mengambil semua data jadwal (bisa ditambahkan parameter role Guru/Siswa jika diperlukan)
    getAllJadwal: async () => {
        return await AxiosConfig.get(ENDPOINT);
    },

    // Menambah jadwal baru
    createJadwal: async (data) => {
        return await AxiosConfig.post(ENDPOINT, data);
    },

    // Mengupdate jadwal berdasarkan ID
    updateJadwal: async (id, data) => {
        return await AxiosConfig.put(ENDPOINT, data, id);
    },

    // Menghapus jadwal berdasarkan ID
    deleteJadwal: async (id) => {
        return await AxiosConfig.delete(ENDPOINT, id);
    }
};