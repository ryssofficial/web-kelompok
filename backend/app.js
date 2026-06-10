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
import bcrypt from 'bcrypt';

const passwordSaja = 'ramadhani6';
const saltRounds = 10; // Standar keamanan bcrypt

bcrypt.hash(passwordSaja, saltRounds, function(err, hash) {
    if (err) {
        console.error("Waduh, gagal nge-hash:", err);
        return;
    }
    console.log(`\n==================================================`);
    console.log(`Password Asli : ${passwordSaja}`);
    console.log(`Hasil Bcrypt  : ${hash}`);
    console.log(`==================================================\n`);
    console.log(`Silakan salin hasil Bcrypt di atas ke database kamu!`);
});

dotenv.config();
const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000; 

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', RouteControl);
app.use((req, res) => sendNotFound(res));

app.listen(PORT, () => {
    console.log(`=============================================================`);
    console.log(`== 🚀 Backend SEBEL berjalan di: http://localhost:${PORT}     ==`);
    console.log(`== 🔓 JWT TOKEN SIAP DIGUNAKAN                             ==`);
    console.log(`=============================================================`);
});



app.get('/', (req, res) => { res.send('Backend API SEBEL berjalan dengan baik!'); });