// backend/controllers/Middleware/SiswaAuthController.js
import BaseController from "./BaseController.js";
import SiswaModel from "../Models/SVA/SiswaModel.js";
import HashCrypt from "../Utils/Bcrypt.js"; // Memuat utilitas enkripsi password Anda
import jwt from "jsonwebtoken";
import { sendResponse, sendError } from "../Utils/Response.js";

class SiswaAuthController extends BaseController {
    constructor() {
        super(SiswaModel);
    }

    login = async (req, res) => {
        console.log(`[System] Data masuk ke server => NIS = ${req.body.identifier} Password = ${req.body.password}`);
        await this.execute(res, async () => {
            // 🌟 SINKRONISASI: Ambil 'identifier' dari req.body sesuai kiriman frontend Anda
            const { identifier, password } = req.body;

            // Validasi awal: Memastikan input tidak dikirim kosong
            if (!identifier || !password) {
                return sendError(res, 400, "NIS dan password wajib diisi.");
            }

            // Cari data siswa di database berdasarkan NIS (menggunakan nilai dari variabel identifier)
            const siswa = await this.model.query()
                .where('nis', '=', identifier) // 🌟 Tetap kueri ke kolom 'nis_siswa'
                .first();

            // Jika data siswa tidak ditemukan
            if (!siswa) {
                return sendError(res, 401, "Kredensial salah, NIS tidak terdaftar.");
            }

            // Inisialisasi komparasi password
            const crypt = new HashCrypt(siswa.passwordSiswa);
            const isPasswordValid = await crypt.comparing(password);

            if (!isPasswordValid) {
                return sendError(res, 401, "Kredensial salah, password tidak cocok.");
            }

            // Buat payload token JWT
            const jwtPayload = {
                id: siswa.idSiswa, 
                nis: siswa.nisSiswa,
                nama: siswa.namaSiswa,
                role: "siswa"
            };

            const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "8h" });

            // Kirim respon balik ke frontend
            return sendResponse(res, 200, "Login Berhasil, Sesi Anda telah aktif.", {
                token: token,
                user: {
                    id: siswa.idSiswa,
                    nis: siswa.nisSiswa,
                    nama: siswa.namaSiswa,
                    role: "siswa"
                }
            });
        });
    }
}

export default new SiswaAuthController();