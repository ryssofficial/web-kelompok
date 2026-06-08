// src/Routes/Muadz/NilaiTugasRoute.js
import express from 'express';
import NilaiTugasController from '../../Controllers/NilaiTugasController.js';
import BaseRoutes from '../../Services/BaseRoutes.js';

const router = express.Router();

/**
 * Registrasi Rute menggunakan helper BaseRoutes
 * BaseRoutes secara otomatis akan menyisipkan middleware AuthToken
 * kecuali pada route yang mengandung "/login" atau "/register"
 */
const routes = [
    // GET /nilai-tugas                                   → semua data
    BaseRoutes.generate('get', '/', NilaiTugasController.index),

    // GET /nilai-tugas/rombel/:id_rombel                 → filter per kelas
    BaseRoutes.generate('get', '/rombel/:id_rombel', NilaiTugasController.getByRombel),

    // GET /nilai-tugas/rombel/:id_rombel/mapel/:id_mapel → filter kelas + mapel
    BaseRoutes.generate('get', '/rombel/:id_rombel/mapel/:id_mapel', NilaiTugasController.getByRombelAndMapel),
];

// Eksekusi pendaftaran ke dalam router
routes.forEach(route => route(router));

export default router;