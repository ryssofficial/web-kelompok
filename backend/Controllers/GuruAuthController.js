// backend/Controllers/GuruAuthController.js
import BaseController from "./BaseController.js";
import GuruModel from "../Models/MVA/GuruModel.js";
import HashCrypt from "../Utils/Bcrypt.js";
import jwt from "jsonwebtoken";
import { sendResponse, sendError } from "../Utils/Response.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class GuruAuthController extends BaseController {
    constructor() {
        super(GuruModel);
    }

    // =============================================
    // LOGIN MANUAL GURU (email + password)
    // POST /auth/login/guru
    // =============================================
    login = async (req, res) => {
        console.log(`[System] Data masuk ke server => Email = ${req.body.identifier}`);
        await this.execute(res, async () => {
            const { identifier, password } = req.body;

            if (!identifier || !password) {
                return sendError(res, 400, "Email dan password wajib diisi.");
            }

            // Cari guru berdasarkan email
            const guru = await this.model.query()
                .where('email', '=', identifier)
                .first();

            if (!guru) { return sendError(res, 401, "Kredensial salah, email tidak terdaftar."); }

            console.log('Data guru ditemukan, memproses verifikasi password...');

            // Ambil hash password (camelCase & snake_case fallback)
            const passwordHash = guru.passwordGuru || guru.password_guru;

            if (!passwordHash) { return sendError(res, 401, "Akun ini tidak memiliki password. Gunakan login Google."); }

            const crypt = new HashCrypt(passwordHash);
            const isPasswordValid = await crypt.comparing(password);

            if (!isPasswordValid) { return sendError(res, 401, "Kredensial salah, password tidak cocok."); }

            console.log('Password valid, membuat token...');

            const jwtPayload = {
                id: guru.idGuru || guru.id_guru,
                email: guru.email,
                nama: guru.namaGuru || guru.nama_guru,
                role: "guru"
            };

            const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "8h" });

            return sendResponse(res, 200, "Login Berhasil, Sesi Anda telah aktif.", {
                token: token,
                user: jwtPayload
            });
        });
    }

    // =============================================
    // LOGIN GOOGLE GURU
    // POST /auth/login/google
    // =============================================
    googleLogin = async (req, res) => {
        await this.execute(res, async () => {
            const { token, role } = req.body;

            if (!token) {
                return sendError(res, 400, "Token Google wajib dikirim.");
            }

            // Ambil data user langsung dari API Google menggunakan Access Token
            const googleResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`);
            
            if (!googleResponse.ok) {
                return sendError(res, 401, "Token Google tidak valid atau sudah kedaluwarsa.");
            }

            const payload = await googleResponse.json();
            const googleId = payload.sub;
            const email = payload.email;
            const nama = payload.name || "Guru Google User"; // Fallback jika nama tidak tersedia di scope tokeninfo

            // Cari guru berdasarkan google_id atau email
            let guru = await this.model.query()
                .where('google_id', '=', googleId)
                .first();

            if (!guru) {
                guru = await this.model.query()
                    .where('email', '=', email)
                    .first();
            }

            if (!guru) { return sendError(res, 403, "Akun Google ini tidak terdaftar sebagai guru."); }

            const jwtPayload = {
                id: guru.idGuru || guru.id_guru,
                email: guru.email,
                nama: guru.namaGuru || guru.nama_guru || nama,
                role: role || "guru"
            };

            const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "7d" });

            return sendResponse(res, 200, "Login Google Berhasil.", {
                token: jwtToken,
                user: jwtPayload
            });
        });
    }
}

export default new GuruAuthController();