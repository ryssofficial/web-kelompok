// backend/db.js
import pg from 'pg'; // Mengimpor pustaka pg
import 'dotenv/config'; // Memastikan variabel lingkungan .env langsung dimuat

// Membuat satu instance Pool koneksi global
const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Mengekspor metode query secara langsung agar bisa dipakai oleh QueryBuilder/BaseModel
export default {
    query: (text, params) => pool.query(text, params),
};