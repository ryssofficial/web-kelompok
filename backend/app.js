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

dotenv.config();
const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000; 

const whitelist = ['http://localhost:5173'];

app.use(cors({
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true); 
        } else {
        callback(new Error('Akses ditolak oleh CORS! Domain Anda tidak terdaftar.')); // Ditolak
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
        'Content-Type', 'Authorization', 
        'Authorization',
        'ngrok-skip-browser-warning'
    ]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', RouteControl);
app.use((req, res) => sendNotFound(res));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`=============================================================`);
    console.log(`== 🚀 Backend SEBEL berjalan di: http://localhost:${PORT}     ==`);
    console.log(`== 🔓 JWT TOKEN SIAP DIGUNAKAN                             ==`);
    console.log(`=============================================================`);
});



app.get('/', (req, res) => { res.send('Backend API SEBEL berjalan dengan baik!'); });