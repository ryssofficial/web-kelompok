// backend/Routes/RouteControl.js
import express from "express";
import Login from "./Login.js"
import NotifikasiRoute from "./NotifikasiRoute.js";
import DashboardRoute from "./Aris/DashboardRoute.js";
<<<<<<< HEAD
import KasRoutes from "./Eriska/KasRoutes.js";
import TabunganRoutes from "./Eriska/TabunganRoutes.js";
=======
import PresensiRoute from "./Muadz/PresensiRoute.js"
>>>>>>> dac1379680c86bac6bf404a30ee196c1cc924593

/**
 * CONTOH: TINGGAL IMPORT AJA
 * import siswaRoutes from "./Eriska/siswaRoutes.js";
 * import keuanganRoutes from "./Muadz/keuanganRoutes.js"; - Contoh anggota lain
 */

const BaseRouter = express.Router();

/**
 * 🗺️ CENTRAL ROUTE REGISTER
 * Tempat menggabungkan seluruh sub-route komponen aplikasi.
 * Setiap rute di bawah ini otomatis akan memiliki prefix '/api' dari app.js
 *
 * CONTOH: baseRouter.use("/siswa", siswaRoutes);
 */

BaseRouter.use("/auth", Login);
BaseRouter.use("/notifikasi", NotifikasiRoute);
BaseRouter.use("/dashboard", DashboardRoute);
<<<<<<< HEAD
BaseRouter.use("/kas", KasRoutes);
BaseRouter.use("/tabungan", TabunganRoutes);
=======
BaseRouter.use("/presensi", PresensiRoute);
>>>>>>> dac1379680c86bac6bf404a30ee196c1cc924593

export default BaseRouter;