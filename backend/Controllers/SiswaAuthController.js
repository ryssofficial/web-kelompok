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
            const { identifier, password } = req.body;

            if (!identifier || !password) {
                return sendError(res, 400, "NIS dan password wajib diisi.");
            }

            const nisSiswaAngka = parseInt(identifier, 10);
            const siswa = await this.model.query()
                .where('nisSiswa', '=', nisSiswaAngka)
                .first();

            console.log('Masuk ke identifikasi nis siswa');

            if (!siswa) {
                return sendError(res, 401, "Kredensial salah, NIS tidak terdaftar.");
            }

            console.log('Data siswa ditemukan, memproses verifikasi password...');

            // 🌟 PERBAIKAN UTAMA: Ganti siswa.password_siswa menjadi siswa.passwordSiswa (camelCase)
            const passwordHash = siswa.passwordSiswa || siswa.password_siswa; 
            console.log(passwordHash);
            const crypt = new HashCrypt(passwordHash);
            const isPasswordValid = await crypt.comparing(password);

            if (!isPasswordValid) {
                return sendError(res, 401, "Kredensial salah, password tidak cocok.");
            }
            
            console.log('Masuk ke pembuatan token...');

            // 🌟 SINKRONISASI PAYLOAD: Gunakan camelCase agar data token tidak bernilai undefined
            const jwtPayload = {
                id: siswa.idSiswa || siswa.id_siswa, 
                nis: siswa.nisSiswa || siswa.nis_siswa,
                nama: siswa.namaSiswa || siswa.nama_siswa,
                role: "siswa"
            };

            const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "8h" });

            return sendResponse(res, 200, "Login Berhasil, Sesi Anda telah aktif.", {
                token: token,
                user: jwtPayload
            });
        });
    }
}

export default new SiswaAuthController();