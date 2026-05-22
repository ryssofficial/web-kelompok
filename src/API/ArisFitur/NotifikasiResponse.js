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
     * @returns {Promise<Array>}
     */
    getAll: async () => {
        return await AxiosConfig.get(NOTIF_URL);
    },

    /**
     * @param {number} id - id_notif
     * @returns {Promise<Object>}
     */
    markAsRead: async (id) => {
        return await AxiosConfig.put(`${NOTIF_URL}/${id}/read`, {});
    },

    /**
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