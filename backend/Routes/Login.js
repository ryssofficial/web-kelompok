// backend/Routes/Login.js
import express from "express";
import BaseRoutes from "../Services/BaseRoutes.js"; // Memuat template pembungkus rute milik Anda
import SiswaAuthController from "../Controllers/SiswaAuthController.js";
import GuruAuthController from "../Controllers/GuruAuthController.js";
<<<<<<< HEAD
=======
import AdminController from "../Controllers/AdminController.js";
>>>>>>> 9bf985957936c2816537faa53d9005f1d4a69f4d

const expressRouter = express.Router();

/**
 * Mendaftarkan rute POST untuk login siswa.
 * Menggunakan method static 'generate' bawaan dari class BaseRoutes Anda.
 * * Sesuai logika di dalam BaseRoutes Anda: Karena path mengandung kata '/login',
 * rute ini otomatis diidentifikasi sebagai PUBLIC ROUTE dan tidak akan dicegat oleh AuthToken (Bebas Akses).
 */
const registerLoginRoute = BaseRoutes.generate("post", "/login/siswa", SiswaAuthController.login);
registerLoginRoute(expressRouter);

<<<<<<< HEAD

=======
const registerAdminLogin = BaseRoutes.generate("POST", "/login/admin", AdminController.login);
registerAdminLogin(expressRouter);
>>>>>>> 9bf985957936c2816537faa53d9005f1d4a69f4d
// POST /auth/login/guru — public (FIX: route ini sebelumnya tidak ada!)
const registerGuruLogin = BaseRoutes.generate("post", "/login/guru", GuruAuthController.login);
registerGuruLogin(expressRouter);

const registerGoogleLogin = BaseRoutes.generate("post", "/login/google", GuruAuthController.googleLogin);
registerGoogleLogin(expressRouter);

// Ekspor objek router untuk disambungkan ke file master BaseRoute
export default expressRouter;