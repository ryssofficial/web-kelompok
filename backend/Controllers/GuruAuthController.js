// backend/Controllers/GuruAuthController.js
import jwt from "jsonwebtoken";
// Pastikan fetch tersedia (Node 18+ otomatis punya fetch)

export default class GuruAuthController {
    static googleLogin = async (req, res) => {
        const { token, role } = req.body;
        if (!token || !role) { 
            return res.status(400).json({ success: false, message: "Token dan role wajib diisi." }); 
        }

        try {
            // Verifikasi token ke Google
            const googleRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", { 
                headers: { Authorization: `Bearer ${token}` }, 
            });
            
            if (!googleRes.ok) { 
                throw new Error("Token Google tidak valid atau sudah expired."); 
            }
            
            const payload = await googleRes.json();
            if (!payload.email_verified) { 
                return res.status(403).json({ success: false, message: "Email Google belum diverifikasi." }); 
            }
            
            // Generate JWT Internal
            const jwtToken = jwt.sign(
                { id: payload.sub, email: payload.email, nama: payload.name, foto: payload.picture, role },
                process.env.JWT_SECRET, // Gunakan process.env agar sama dengan AuthToken.js Anda
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
    }
}