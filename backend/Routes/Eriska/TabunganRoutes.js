import express from "express";
import BaseRoutes from "../../Services/BaseRoutes.js";
import KeuanganController from "../../Controllers/KeuanganController.js";

const TabunganRouter = express.Router();

// ── GET ──────────────────────────────────────────────────────────────────────
// Ambil daftar tabungan semua siswa di rombel → GET /tabungan?id_rombel=...
BaseRoutes.generate("get", "/", KeuanganController.getTabunganByRombel)(TabunganRouter);

// Ambil detail tabungan satu siswa → GET /tabungan/:id
BaseRoutes.generate("get", "/:id", KeuanganController.getDetailTabungan)(TabunganRouter);

// Ambil riwayat setor tabungan → GET /pemasukkan?id_tabungan=...
BaseRoutes.generate("get", "/setor", KeuanganController.getRiwayatSetor)(TabunganRouter);

// Ambil riwayat tarik tabungan → GET /pengeluaran?id_tabungan=...
BaseRoutes.generate("get", "/tarik", KeuanganController.getRiwayatTarik)(TabunganRouter);

// ── POST ─────────────────────────────────────────────────────────────────────
// Setor tabungan siswa → POST /pemasukkan
BaseRoutes.generate("post", "/setor", KeuanganController.setorTabungan)(TabunganRouter);

// Tarik tabungan siswa → POST /pengeluaran
BaseRoutes.generate("post", "/tarik", KeuanganController.tarikTabungan)(TabunganRouter);

// ── DELETE ───────────────────────────────────────────────────────────────────
// Hapus riwayat setor → DELETE /pemasukkan/:id
BaseRoutes.generate("delete", "/setor/:id", KeuanganController.hapusSetor)(TabunganRouter);

// Hapus riwayat tarik → DELETE /pengeluaran/:id
BaseRoutes.generate("delete", "/tarik/:id", KeuanganController.hapusTarik)(TabunganRouter);

export default TabunganRouter;