import express from "express";
import BaseRoutes from "../../Services/BaseRoutes.js";
import ProfilController from "../../Controllers/ProfilController.js";

const ProfilRouter = express.Router();

// Pendaftaran rute fitur profil data (Siswa & Guru) via BaseRoutes closure generator
BaseRoutes.generate("get", "/profil-siswa", ProfilController.getProfilSiswa)(ProfilRouter);
BaseRoutes.generate("get", "/profil-guru", ProfilController.getProfilGuru)(ProfilRouter);
BaseRoutes.generate("put", "/profil-update", ProfilController.updateProfil)(ProfilRouter);

export default ProfilRouter;