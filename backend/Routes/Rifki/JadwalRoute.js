import express from "express";
import BaseRoutes from "../../Services/BaseRoutes.js";
import JadwalController from "../../Controllers/JadwalController.js";

const JadwalRouter = express.Router();

// Pendaftaran rute fitur jadwal-pelajaran (Siswa) dan jadwalMengajar (Guru) via BaseRoutes closure generator
BaseRoutes.generate("get", "/jadwal-pelajaran", JadwalController.getJadwalPelajaran)(JadwalRouter);
BaseRoutes.generate("get", "/jadwal-mengajar", JadwalController.getJadwalMengajar)(JadwalRouter);

export default JadwalRouter;