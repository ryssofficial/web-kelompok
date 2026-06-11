// src/Routes/Muadz/PresensiRoute.js
import express from 'express';
import PresensiController from '../../Controllers/PresensiController.js';
import BaseRoutes from '../../Services/BaseRoutes.js';

const router = express.Router();

const routes = [
    BaseRoutes.generate('get',    '/',                    PresensiController.index),
    BaseRoutes.generate('get',    '/rombel/:id_rombel',   PresensiController.getByRombel),
    BaseRoutes.generate('post',   '/',                    PresensiController.create),
    BaseRoutes.generate('delete', '/:id',                 PresensiController.delete),
];

routes.forEach(route => route(router));
export default router;