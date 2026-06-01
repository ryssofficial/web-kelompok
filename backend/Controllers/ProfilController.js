class ProfilController {
    // 1. Ambil data profil Siswa (Dipanggil oleh rute /profil-siswa)
    async getProfilSiswa(req, res) {
        try {
            // Simulasi data dari database - property disamakan dengan state frontend kamu
            const dataSiswa = {
                fullName: "Hakim Fitur", 
                alamat: "Surabaya, Jawa Timur",
                ttl: "Surabaya, 10 Oktober 2005",
                email: "hakim@siswa.sch.id"
            };

            return res.status(200).json({
                status: "success",
                message: "Data profil siswa berhasil diambil",
                data: dataSiswa // dimasukkan ke dalam object 'data' sesuai response.data di frontend
            });
        } catch (error) {
            return res.status(500).json({ status: "error", message: error.message });
        }
    }

    // 2. Ambil data profil Guru (Dipanggil oleh rute /profil-guru)
    async getProfilGuru(req, res) {
        try {
            // Simulasi data guru
            const dataGuru = {
                fullName: "Pak Budi Utomo, S.Kom.",
                alamat: "Sidoarjo, Jawa Timur",
                ttl: "Malang, 12 Januari 1988",
                email: "budi.utomo@guru.sch.id"
            };

            return res.status(200).json({
                status: "success",
                message: "Data profil guru berhasil diambil",
                data: dataGuru
            });
        } catch (error) {
            return res.status(500).json({ status: "error", message: error.message });
        }
    }

    // 3. Update data profil (Dipanggil oleh rute /profil-update)
    async updateProfil(req, res) {
        try {
            // Menangkap data fullName, alamat, ttl, email yang dikirim lewat form onSubmit kamu
            const { fullName, alamat, ttl, email } = req.body; 

            // TODO: Di sini nanti jalankan query UPDATE ke database kelompok kalian

            // Mengembalikan response sukses agar trigger alert(...) di frontend berjalan
            return res.status(200).json({
                status: "success",
                message: "Profil berhasil diperbarui!",
                data: { fullName, alamat, ttl, email } 
            });
        } catch (error) {
            return res.status(500).json({ 
                status: "error", 
                message: "Gagal memperbarui database: " + error.message 
            });
        }
    }
}

export default new ProfilController();