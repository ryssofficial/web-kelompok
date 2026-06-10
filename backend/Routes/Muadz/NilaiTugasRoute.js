// src/Routes/Muadz/NilaiTugasRoute.js
import express from 'express';
import NilaiTugasController from '../../Controllers/NilaiTugasController.js';
import BaseRoutes from '../../Services/BaseRoutes.js';

const router = express.Router();

const routes = [
    BaseRoutes.generate('get',    '/',                                  NilaiTugasController.index),
    BaseRoutes.generate('get',    '/rombel/:id_rombel',                 NilaiTugasController.getByRombel),
    BaseRoutes.generate('get',    '/rombel/:id_rombel/mapel/:id_mapel', NilaiTugasController.getByRombelAndMapel),
    BaseRoutes.generate('post',   '/',                                  NilaiTugasController.create),
    BaseRoutes.generate('put',    '/:id',                               NilaiTugasController.update),
    BaseRoutes.generate('delete', '/:id',                               NilaiTugasController.delete),
];

routes.forEach(route => route(router));
export default router;