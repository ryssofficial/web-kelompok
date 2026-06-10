//  KODE YANG BENAR
import express from "express";
import BaseRoutes from "../../Services/BaseRoutes.js";
import KeuanganController from "../../Controllers/KeuanganController.js";

const KeuanganRouter = express.Router();

// Pastikan yang dimasukkan ke dalam kurung adalah KeuanganRouter
const RegisterKeuangan = BaseRoutes.generate("get", "/rombel", KeuanganController.getSiswaDanWaliByIdGuru);
RegisterKeuangan(KeuanganRouter); 

export default KeuanganRouter;