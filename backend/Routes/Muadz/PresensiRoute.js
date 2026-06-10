// src/Routes/Muadz/PresensiRoute.js
import express from 'express';
import PresensiController from '../../Controllers/PresensiController.js';
import BaseRoutes from '../../Services/BaseRoutes.js';

const router = express.Router();

/**
 * Registrasi Rute menggunakan helper BaseRoutes
 * BaseRoutes secara otomatis akan menyisipkan middleware AuthToken 
 * kecuali pada route yang mengandung "/login" atau "/register"
 */
const routes = [
    BaseRoutes.generate('get', '/', PresensiController.index),
    BaseRoutes.generate('get', '/rombel/:id_rombel', PresensiController.getByRombel)
];

// Eksekusi pendaftaran ke dalam router
routes.forEach(route => route(router));

export default router;