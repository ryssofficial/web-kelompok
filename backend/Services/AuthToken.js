import { sendError } from "../Utils/Response.js";
import jwt from "jsonwebtoken";

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 * @returns 
 */
export const AuthToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('[AuthToken] Header:', authHeader ? 'ADA' : 'TIDAK ADA');
    console.log('[AuthToken] Token:', token ? token.substring(0, 20) + '...' : 'NULL');

    if (!token) return sendError(res, 401, "Akses Ditolak, token kosong");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log('[AuthToken] Error verify:', error.message);
        return sendError(res, 401, "Sesi Berakhir (Token Expired)");
    }
};