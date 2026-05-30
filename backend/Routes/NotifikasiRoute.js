// backend/Routes/NotifikasiRoute.js
import express from "express";
import NotifikasiController from "../Controllers/NotifikasiController.js";
import { AuthToken } from "./../Services/AuthToken.js"; // Sesuaikan path tempat fungsi authenticateToken Anda berada

const expressRouter = express.Router();

// Proteksi semua rute di bawah ini dengan JWT Middleware
expressRouter.use(AuthToken);

// Pemetaan Rute API sesuai permintaan Frontend
expressRouter.get("/", NotifikasiController.getAll);
expressRouter.put("/read-all", NotifikasiController.markAllAsRead); // Taruh baris ini di atas /:id agar tidak tabrakan kueri
expressRouter.put("/:id/read", NotifikasiController.markAsRead);
expressRouter.delete("/:id", NotifikasiController.deleteNotif);

export default expressRouter;