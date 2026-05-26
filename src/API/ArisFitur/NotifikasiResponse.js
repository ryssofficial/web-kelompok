import { AxiosConfig } from "../AxiosConfig";

const endpoint = "/notifikasi";
export const NotifikasiResponse = {
    /**
     * Ambil semua notifikasi milik user
     * @returns {Promise<Array>}
     */
    getAll: async () => {
        return await AxiosConfig.get(endpoint);
    },

    /**
     * Tandai satu notif sebagai sudah dibaca
     * @param {number|string} id - id_notif
     * @returns {Promise<Object>}
     */
    markAsRead: async (id) => {
        return await AxiosConfig.put(`${endpoint}/${id}/read`, {});
    },

    /**
     * Tandai semua notif sebagai sudah dibaca
     * @returns {Promise<Object>}
     */
    markAllAsRead: async () => {
        return await AxiosConfig.put(`${endpoint}/read-all`, {});
    },

    /**
     * Hapus satu notifikasi berdasarkan id_notif.
     * @param {number|string} id - id_notif
     * @returns {Promise<Object>}
     */
    delete: async (id) => {
        return await AxiosConfig.delete(endpoint, id);
    }
};