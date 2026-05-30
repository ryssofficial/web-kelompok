/**
 * ⚠️JANGAN DIUBAH YA TEMAN-TEMAN!
 */

import express from "express";
import "./Utils/GenerateJWT.js";
import cors from "cors";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { sendNotFound } from "./Utils/Response.js";
import RouteControl from "./Routes/RouteControl.js";

dotenv.config();
const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000; // 🌟 Perbaikan: Satukan definisi PORT di sini

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', RouteControl);
app.use((req, res) => sendNotFound(res));

app.listen(PORT, () => {
    console.log(`=============================================================`);
    console.log(`== 🚀 Backend SEBEL berjalan di: http://localhost:${PORT}  ==`);
    console.log(`== 🔓 JWT TOKEN SIAP DIGUNAKAN                             ==`);
    console.log(`=============================================================`);
});

// --- DAFTAR RUTE API (TIDAK ADA YANG DIUBAH) ---

app.get('/', (req, res) => { res.send('Backend API SEBEL berjalan dengan baik!'); });

app.post("/api/auth/login/guru", async (req, res) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) { return res.status(400).json({ success: false, message: "Email dan password wajib diisi." }); }

    try {
        if (password.length < 4) { return res.status(401).json({ success: false, message: "Password guru minimal 4 karakter (Simulasi Gagal)." }); }
        const usernameSample = identifier.split("@")[0];
        const namaGuru = usernameSample.charAt(0).toUpperCase() + usernameSample.slice(1);
        const jwtToken = jwt.sign(
            {
                id: `GURU-${usernameSample.toUpperCase()}`,
                email: identifier,
                nama: `Bapak/Ibu ${namaGuru}`,
                role: "guru",
            },
            JWT_SECRET,
            { expiresIn: "8h" }
        );

        return res.json({
            success: true,
            token: jwtToken,
            user: { 
                email: identifier, 
                nama: `Bapak/Ibu ${namaGuru}`, 
                foto: "https://placehold.co/150", 
                role: "guru" 
            },
        });

    } catch (err) { return res.status(500).json({ success: false, message: "Terjadi kesalahan server internal." }); }
});

app.post("/api/auth/google", async (req, res) => {
    const { token, role } = req.body;
    if (!token || !role) { return res.status(400).json({ success: false, message: "Token dan role wajib diisi." }); }

    try {
        const googleRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", { headers: { Authorization: `Bearer ${token}` }, });
        if (!googleRes.ok) { throw new Error("Token Google tidak valid atau sudah expired."); }
        
        const payload = await googleRes.json();
        if (!payload.email_verified) { return res.status(403).json({ success: false, message: "Email Google belum diverifikasi." }); }
        
        const jwtToken = jwt.sign(
            {
                id: payload.sub,
                email: payload.email,
                nama: payload.name,
                foto: payload.picture,
                role,
            },
            JWT_SECRET,
            { expiresIn: "8h" }
        );

        return res.json({
            success: true,
            token: jwtToken,
            user: { email: payload.email, nama: payload.name, foto: payload.picture, role },
        });
    } catch (err) {
        console.error("Google auth error:", err.message);
        return res.status(401).json({ success: false, message: err.message });
    }
});

app.get("/api/auth/profile", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ id_guru: decoded.id, role: decoded.role, id_rombel: 1 });
    } catch {
        res.status(401).json({ message: "Token tidak valid." });
    }
});