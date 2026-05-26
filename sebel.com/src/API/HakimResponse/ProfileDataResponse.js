import { AxiosConfig } from "../AxiosConfig";
import { API_URL } from "../API_URL";

const PROFILE_URL = `${API_URL}/profile`; // Diasumsikan endpoint dasar: /api/profile atau sejenisnya

/**
 * ProfileDataResponse
 * API layer khusus fitur Profil Guru/Siswa.
 * Endpoint diasumsikan membaca ID user secara aman di backend menggunakan JWT token.
 * * Target Endpoint:
 * GET /profile        → Ambil data profil user yang sedang login
 * PUT /profile/update → Perbarui data lengkap (nama, alamat, ttl, email)
 * PUT /profile/password → Perbarui password akun
 */

export const ProfileDataResponse = {

    /**
     * Ambil data profil lengkap milik user yang sedang aktif login.
     * Backend akan mendeteksi user berdasarkan JWT Token yang dikirim di header.
     * @returns {Promise<Object>} data profil lengkap (fullName, alamat, ttl, email)
     */
    getProfile: async () => {
        return await AxiosConfig.get(PROFILE_URL);
    },

    /**
     * Perbarui data profil (Nama Lengkap, Alamat, Tempat Tanggal Lahir, Email).
     * @param {Object} updatedData - { fullName, alamat, ttl, email }
     * @returns {Promise<Object>} data profil yang telah diperbarui beserta pesan sukses
     */
    updateProfile: async (updatedData) => {
        return await AxiosConfig.put(`${PROFILE_URL}/update`, updatedData);
    },

    /**
     * Perbarui password user setelah divalidasi.
     * @param {Object} passwordData - { currentPassword, newPassword, confirmPassword }
     * @returns {Promise<Object>} pesan status sukses dari backend
     */
    updatePassword: async (passwordData) => {
        return await AxiosConfig.put(`${PROFILE_URL}/password`, passwordData);
    }
};