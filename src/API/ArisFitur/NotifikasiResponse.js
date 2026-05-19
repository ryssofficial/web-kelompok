import { AxiosConfig } from "../AxiosConfig";
import { API_URL } from "../API_URL";

const NOTIF_URL = API_URL;
/**
 * NotifikasiResponse
 * API layer khusus fitur Notifikasi.
 * Endpoint diasumsikan:
 *   GET    /notifikasi          → ambil semua notif milik user (berdasar token)
 *   GET    /notifikasi/unread   → jumlah notif belum dibaca
 *   PUT    /notifikasi/:id/read → tandai satu notif sebagai sudah dibaca
 *   PUT    /notifikasi/read-all → tandai semua notif sebagai sudah dibaca
 *   DELETE /notifikasi/:id      → hapus satu notifikasi
 */

export const NotifikasiResponse = {

    /**
     * Ambil semua notifikasi milik user yang sedang login.
     * Backend membaca id dari JWT token.
     * @returns {Promise<Array>} list notifikasi
     */
    getAll: async () => {
        return await AxiosConfig.get(NOTIF_URL);
    },

    /**
     * Tandai satu notifikasi sebagai sudah dibaca (is_read = true).
     * @param {number} id - id_notif
     * @returns {Promise<Object>}
     */
    markAsRead: async (id) => {
        return await AxiosConfig.put(`${NOTIF_URL}/${id}/read`, {});
    },

    /**
     * Tandai SEMUA notifikasi milik user sebagai sudah dibaca.
     * @returns {Promise<Object>}
     */
    markAllAsRead: async () => {
        return await AxiosConfig.put(`${NOTIF_URL}/read-all`, {});
    },

    /**
     * Hapus satu notifikasi berdasarkan id_notif.
     * @param {number} id - id_notif
     * @returns {Promise<Object>}
     */
    delete: async (id) => {
        return await AxiosConfig.delete(NOTIF_URL, id);
    },
};