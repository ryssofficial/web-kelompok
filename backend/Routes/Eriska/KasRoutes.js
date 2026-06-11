import express from "express";
import BaseRoutes from "../../Services/BaseRoutes.js";
import KeuanganController from "../../Controllers/KeuanganController.js";

const KasRouter = express.Router();

// ── GET ──────────────────────────────────────────────────────────────────────
// Ambil data kas berdasarkan id_rombel → GET /kas?id_rombel=...
BaseRoutes.generate("get", "/", KeuanganController.getKasByRombel)(KasRouter);

// Ambil riwayat pemasukkan kas → GET /pemasukkan-kas?id_kas=...
BaseRoutes.generate("get", "/pemasukkan", KeuanganController.getRiwayatPemasukkanKas)(KasRouter);

// Ambil riwayat pengeluaran kas → GET /pengeluaran-kas?id_kas=...
BaseRoutes.generate("get", "/pengeluaran", KeuanganController.getRiwayatPengeluaranKas)(KasRouter);

// ── POST ─────────────────────────────────────────────────────────────────────
// Tambah pemasukkan kas → POST /pemasukkan-kas
BaseRoutes.generate("post", "/pemasukkan", KeuanganController.tambahPemasukkanKas)(KasRouter);

// Tambah pengeluaran kas → POST /pengeluaran-kas
BaseRoutes.generate("post", "/pengeluaran", KeuanganController.tambahPengeluaranKas)(KasRouter);

// ── DELETE ───────────────────────────────────────────────────────────────────
// Hapus pemasukkan kas → DELETE /pemasukkan-kas/:id
BaseRoutes.generate("delete", "/pemasukkan/:id", KeuanganController.hapusPemasukkanKas)(KasRouter);

// Hapus pengeluaran kas → DELETE /pengeluaran-kas/:id
BaseRoutes.generate("delete", "/pengeluaran/:id", KeuanganController.hapusPengeluaranKas)(KasRouter);

export default KasRouter;