// backend/Routes/Login.js
import express from "express";
import BaseRoutes from "../Services/BaseRoutes.js"; // Memuat template pembungkus rute milik Anda
import SiswaAuthController from "../Controllers/SiswaAuthController.js";

const expressRouter = express.Router();

/**
 * Mendaftarkan rute POST untuk login siswa.
 * Menggunakan method static 'generate' bawaan dari class BaseRoutes Anda.
 * * Sesuai logika di dalam BaseRoutes Anda: Karena path mengandung kata '/login',
 * rute ini otomatis diidentifikasi sebagai PUBLIC ROUTE dan tidak akan dicegat oleh AuthToken (Bebas Akses).
 */
const registerLoginRoute = BaseRoutes.generate("post", "/login/siswa", SiswaAuthController.login);

// Menjalankan fungsi penutupan (closure execution) yang dihasilkan oleh constructor BaseRoutes Anda
registerLoginRoute(expressRouter);

// Ekspor objek router untuk disambungkan ke file master BaseRoute
export default expressRouter;