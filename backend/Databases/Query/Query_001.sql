---------------------------------------
-- 1. DATA Single Valued Attribute (SVA)
---------------------------------------
CREATE TABLE IF NOT EXISTS public.tahun_akademik (
    id_tahun SERIAL PRIMARY KEY,
    tahun_ajaran VARCHAR(9) NOT NULL,
    semester VARCHAR(6) NOT NULL,
    status_aktif BOOLEAN DEFAULT false
);
ALTER TABLE IF EXISTS public.tahun_akademik OWNER TO "USERS";

CREATE TABLE IF EXISTS public.siswa (
    id_siswa SERIAL PRIMARY KEY,  
    nis_siswa BIGINT NOT NULL UNIQUE, 
    nama_siswa VARCHAR(50) NOT NULL, 
    tahun_masuk SMALLINT NOT NULL, 
    tahun_keluar SMALLINT DEFAULT NULL, 
    password_siswa VARCHAR(255) NOT NULL UNIQUE
);
ALTER TABLE IF EXISTS public.siswa OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.mata_pelajaran (
    id_mapel SERIAL PRIMARY KEY, 
    mapel VARCHAR(50) NOT NULL,
    kurikulum VARCHAR(20) NOT NULL,
    stok_buku INT DEFAULT 0,
    buku_untuk_kelas SMALLINT NOT NULL,
    CONSTRAINT check_tingkat_sd CHECK (buku_untuk_kelas >= 1 AND buku_untuk_kelas <= 6)
);
ALTER TABLE IF EXISTS public.mata_pelajaran OWNER TO "USERS";

CREATE TABLE IF NOT EXISTS public.kategori_rombel (
    id_kategori SERIAL PRIMARY KEY, 
    kategori CHAR(1) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.jabatan (
    id_jabatan SERIAL PRIMARY KEY,
    nama_jabatan VARCHAR(20) NOT NULL UNIQUE
);
ALTER TABLE IF EXISTS public.jabatan OWNER TO postgres;

---------------------------------
-- 2. DATA MULTI VALUED ATTRIBUTE
---------------------------------

CREATE TABLE IF NOT EXISTS public.guru (
    id_guru SERIAL PRIMARY KEY, 
    dapodik VARCHAR(20) NOT NULL UNIQUE,
    nip VARCHAR(18) DEFAULT NULL UNIQUE,
    nama_guru VARCHAR(50) NOT NULL,
    id_jabatan INT NOT NULL,
    google_id VARCHAR(225) UNIQUE,
    email VARCHAR(100), 
    password_guru VARCHAR(255) NOT NULL UNIQUE, 
    
    CONSTRAINT fk_id_jabatan FOREIGN KEY (id_jabatan) REFERENCES public.jabatan(id_jabatan)
);
ALTER TABLE IF EXISTS public.guru OWNER TO "USERS";

CREATE TABLE IF NOT EXISTS public.kelompok_jabatan (
    id_kelompok SERIAL PRIMARY KEY, 
    id_jabatan INT NOT NULL, 
    id_guru INT NOT NULL, 
    
    CONSTRAINT fk_jabatan FOREIGN KEY (id_jabatan) REFERENCES public.jabatan(id_jabatan), 
    CONSTRAINT fk_guru FOREIGN KEY (id_guru) REFERENCES public.guru(id_guru)
);
-- Perbaikan Typo: kelompook -> kelompok
ALTER TABLE IF EXISTS public.kelompok_jabatan OWNER TO "USERS";

CREATE TABLE IF NOT EXISTS public.rombongan_mapel(
    id_rombongan SERIAL PRIMARY KEY,  
    id_mapel INT NOT NULL, 
    id_guru INT NOT NULL, 

    CONSTRAINT fk_rombongan_mapel FOREIGN KEY (id_mapel) REFERENCES public.mata_pelajaran(id_mapel), 
    CONSTRAINT fk_rombongan_guru_mapel FOREIGN KEY (id_guru) REFERENCES public.guru(id_guru)
);

CREATE TABLE IF NOT EXISTS public.pengajar(
    id_pengajar SERIAL PRIMARY KEY, 
    id_mapel INT NOT NULL, 
    id_guru INT NOT NULL, 
    CONSTRAINT fk_pengajar_mapel FOREIGN KEY (id_mapel) REFERENCES public.mata_pelajaran(id_mapel), 
    CONSTRAINT fk_pengajar_guru FOREIGN KEY (id_guru) REFERENCES public.guru(id_guru)
);

--------------------------------------------------
-- 3. KEBUTUHAN DATA KELAS
--------------------------------------------------

CREATE TABLE IF NOT EXISTS public.rombel (
    id_rombel SERIAL PRIMARY KEY, 
    kelas SMALLINT NOT NULL, 
    id_kategori INT NOT NULL, 
    id_guru INT NOT NULL, 
    id_tahun INT NOT NULL, 
    
    CONSTRAINT fk_kategori_rombel FOREIGN KEY (id_kategori) REFERENCES public.kategori_rombel(id_kategori), 
    CONSTRAINT fk_wali_kelas FOREIGN KEY (id_guru) REFERENCES public.guru(id_guru), 
    CONSTRAINT fk_tahun_akademik FOREIGN KEY (id_tahun) REFERENCES public.tahun_akademik(id_tahun)
);
ALTER TABLE IF EXISTS public.rombel OWNER TO "USERS";

CREATE TABLE IF NOT EXISTS public.anggota_rombel (
    id_anggota SERIAL PRIMARY KEY,
    id_rombel INT NOT NULL,
    id_siswa INT NOT NULL,
    status_siswa VARCHAR(20) DEFAULT 'Aktif', 
    
    CONSTRAINT fk_anggota_rombel FOREIGN KEY (id_rombel) REFERENCES public.rombel(id_rombel) ON DELETE CASCADE,
    CONSTRAINT fk_anggota_siswa FOREIGN KEY (id_siswa) REFERENCES public.siswa(id_siswa) ON DELETE CASCADE,
    CONSTRAINT unique_siswa_per_tahun UNIQUE (id_rombel, id_siswa)
);
ALTER TABLE IF EXISTS public.anggota_rombel OWNER TO "USERS";

CREATE TABLE IF NOT EXISTS public.jadwal (
    id_jadwal SERIAL PRIMARY KEY, 
    hari VARCHAR(10) NOT NULL, 
    jam_mulai TIME NOT NULL, 
    jam_selesai TIME NOT NULL, 
    id_mapel INT NOT NULL, 
    id_guru INT NOT NULL, 
    id_rombel INT NOT NULL, 
    id_tahun INT NOT NULL, 
    
    CONSTRAINT check_waktu CHECK (jam_selesai > jam_mulai), 
    CONSTRAINT fk_jadwal_mapel FOREIGN KEY (id_mapel) REFERENCES public.mata_pelajaran(id_mapel), 
    CONSTRAINT fk_jadwal_guru FOREIGN KEY (id_guru) REFERENCES public.guru(id_guru),
    CONSTRAINT fk_jadwal_rombel FOREIGN KEY (id_rombel) REFERENCES public.rombel(id_rombel)
);
ALTER TABLE IF EXISTS public.jadwal OWNER TO "USERS";

CREATE TABLE IF NOT EXISTS public.nilai_tugas (
    id_nilai SERIAL PRIMARY KEY,
    id_anggota INT NOT NULL,
    id_mapel INT NOT NULL,
    tugas_ke SMALLINT NOT NULL DEFAULT 0,
    nilai NUMERIC(5,2) NOT NULL,
    id_guru INT NOT NULL,
    tanggal_input TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, 

    CONSTRAINT fk_nama_siswa FOREIGN KEY (id_anggota) REFERENCES public.anggota_rombel(id_anggota), 
    CONSTRAINT fk_penginput_guru FOREIGN KEY (id_guru) REFERENCES public.guru(id_guru)
);

CREATE TABLE IF NOT EXISTS public.presensi (
    id_presensi SERIAL PRIMARY KEY, 
    id_anggota INT NOT NULL, 
    tugas_ke SMALLINT NOT NULL UNIQUE, 
    tanggal_penilaian TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
    status_kehadiran CHAR(1) CHECK (status_kehadiran IN ('H', 'I', 'S', 'A')),

    CONSTRAINT fk_nilai_anggota FOREIGN KEY (id_anggota) REFERENCES public.anggota_rombel(id_anggota)
);

--------------------------------------------------
-- 4. KEBUTUHAN DATA TABUNGAN SISWA
--------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tabungan (
    id_tabungan SERIAL PRIMARY KEY,
    id_anggota INT NOT NULL,
    id_rombel INT NOT NULL,
    saldo_total NUMERIC(12,2) DEFAULT 0, 
    
    CONSTRAINT fk_tabungan_siswa FOREIGN KEY (id_anggota) REFERENCES public.anggota_rombel(id_anggota),
    CONSTRAINT fk_tabungan_rombel FOREIGN KEY (id_rombel) REFERENCES public.rombel(id_rombel)
);
ALTER TABLE IF EXISTS public.tabungan OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.pemasukkan (
    id_pemasukkan SERIAL PRIMARY KEY, 
    id_tabungan INT NOT NULL, 
    id_guru INT NOT NULL,
    jumlah_masuk NUMERIC(12,2) NOT NULL,
    tanggal_masuk TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    keterangan TEXT, 

    CONSTRAINT fk_pemasukkan_tabungan FOREIGN KEY (id_tabungan) REFERENCES public.tabungan(id_tabungan), 
    CONSTRAINT fk_pemasukkan_guru FOREIGN KEY (id_guru) REFERENCES public.guru(id_guru)
);

CREATE TABLE IF NOT EXISTS public.pengeluaran (
    id_pengeluaran SERIAL PRIMARY KEY, 
    id_tabungan INT NOT NULL,
    id_guru INT NOT NULL,
    jumlah_keluar NUMERIC(12,2) NOT NULL,
    tanggal_keluar TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    keterangan TEXT, 

    CONSTRAINT fk_pengeluaran_tabungan FOREIGN KEY (id_tabungan) REFERENCES public.tabungan(id_tabungan), 
    CONSTRAINT fk_input_tabungan FOREIGN KEY (id_guru) REFERENCES public.guru(id_guru)
);

--------------------------------------------------
-- 5. KEBUTUHAN SYSTEM & KAS KELAS
--------------------------------------------------

CREATE TABLE IF NOT EXISTS public.log_data (
    id_log SERIAL PRIMARY KEY,
    id_guru INT,
    id_siswa INT,
    tanggal_log TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(16) NOT NULL,
    keterangan TEXT DEFAULT 'Daftar Pengunjung'
);
ALTER TABLE IF EXISTS public.log_data OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.notifikasi (
    id_notif SERIAL PRIMARY KEY,
    id_guru INT DEFAULT NULL,
    id_siswa INT DEFAULT NULL,
    judul VARCHAR(100) NOT NULL,
    pesan TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    tanggal_notif TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_notif_guru FOREIGN KEY (id_guru) REFERENCES public.guru(id_guru),
    CONSTRAINT fk_notif_siswa FOREIGN KEY (id_siswa) REFERENCES public.siswa(id_siswa)
);
ALTER TABLE IF EXISTS public.notifikasi OWNER TO "USERS";

CREATE TABLE IF NOT EXISTS public.kas (
    id_kas SERIAL PRIMARY KEY,
    id_rombel INT NOT NULL UNIQUE, 
    saldo_kas NUMERIC(12,2) DEFAULT 0,
    
    CONSTRAINT fk_kas_rombel FOREIGN KEY (id_rombel) REFERENCES public.rombel(id_rombel) ON DELETE CASCADE
);
ALTER TABLE IF EXISTS public.kas OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.pemasukkan_kas (
    id_pemasukkan_kas SERIAL PRIMARY KEY,
    id_kas INT NOT NULL,
    id_guru INT NOT NULL,
    jumlah_masuk NUMERIC(12,2) NOT NULL,
    tanggal_masuk TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    keterangan TEXT,
    
    CONSTRAINT fk_pemasukkan_kas_master FOREIGN KEY (id_kas) REFERENCES public.kas(id_kas),
    CONSTRAINT fk_pemasukkan_kas_guru FOREIGN KEY (id_guru) REFERENCES public.guru(id_guru)
);

CREATE TABLE IF NOT EXISTS public.pengeluaran_kas (
    id_pengeluaran_kas SERIAL PRIMARY KEY,
    id_kas INT NOT NULL,
    id_guru INT NOT NULL,
    jumlah_keluar NUMERIC(12,2) NOT NULL,
    tanggal_keluar TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    keterangan TEXT,
    
    CONSTRAINT fk_pengeluaran_kas_master FOREIGN KEY (id_kas) REFERENCES public.kas(id_kas),
    CONSTRAINT fk_pengeluaran_kas_guru FOREIGN KEY (id_guru) REFERENCES public.guru(id_guru)
);

--------------------------------------------------
-- 6. FUNCTIONS & TRIGGERS
--------------------------------------------------

-- Guru Validation
CREATE OR REPLACE FUNCTION public.fn_validasi_identitas_guru() 
RETURNS trigger AS $$
BEGIN
    IF NEW.nip IS NOT NULL AND LENGTH(NEW.nip) != 18 THEN
        RAISE EXCEPTION 'NIP harus tepat 18 digit angka.';
    END IF;
    IF LENGTH(NEW.dapodik) < 10 THEN
        RAISE EXCEPTION 'Nomor Dapodik tidak valid.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sebelum_simpan_guru
BEFORE INSERT OR UPDATE ON public.guru
FOR EACH ROW EXECUTE FUNCTION public.fn_validasi_identitas_guru();

-- Notifications
CREATE OR REPLACE FUNCTION public.fn_notif_nilai_baru()
RETURNS trigger AS $$
DECLARE
    v_id_siswa INT;
    v_mapel VARCHAR(50);
BEGIN
    SELECT id_siswa INTO v_id_siswa FROM public.anggota_rombel WHERE id_anggota = NEW.id_anggota;
    SELECT mapel INTO v_mapel FROM public.mata_pelajaran WHERE id_mapel = NEW.id_mapel;
    INSERT INTO public.notifikasi (id_siswa, judul, pesan)
    VALUES (v_id_siswa, 'Nilai Tugas Baru', 'Nilai mata pelajaran ' || v_mapel || ' telah diinput.');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notif_nilai_baru
AFTER INSERT ON public.nilai_tugas
FOR EACH ROW EXECUTE FUNCTION public.fn_notif_nilai_baru();

-- Saldo Tabungan Auto-Update
CREATE OR REPLACE FUNCTION public.fn_update_saldo_tabungan() 
RETURNS trigger AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF (TG_TABLE_NAME = 'pemasukkan') THEN
            UPDATE tabungan SET saldo_total = saldo_total + NEW.jumlah_masuk WHERE id_tabungan = NEW.id_tabungan;
        ELSIF (TG_TABLE_NAME = 'pengeluaran') THEN
            UPDATE tabungan SET saldo_total = saldo_total - NEW.jumlah_keluar WHERE id_tabungan = NEW.id_tabungan;
        END IF;
    ELSIF (TG_OP = 'DELETE') THEN
        IF (TG_TABLE_NAME = 'pemasukkan') THEN
            UPDATE tabungan SET saldo_total = saldo_total - OLD.jumlah_masuk WHERE id_tabungan = OLD.id_tabungan;
        ELSIF (TG_TABLE_NAME = 'pengeluaran') THEN
            UPDATE tabungan SET saldo_total = saldo_total + OLD.jumlah_keluar WHERE id_tabungan = OLD.id_tabungan;
        END IF;
    END IF;
    RETURN NULL; 
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_saldo_masuk AFTER INSERT OR DELETE ON public.pemasukkan FOR EACH ROW EXECUTE FUNCTION public.fn_update_saldo_tabungan();
CREATE TRIGGER trg_update_saldo_keluar AFTER INSERT OR DELETE ON public.pengeluaran FOR EACH ROW EXECUTE FUNCTION public.fn_update_saldo_tabungan();

-- Auto Create Tabungan
CREATE OR REPLACE FUNCTION public.fn_auto_create_tabungan()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.tabungan (id_anggota, id_rombel, saldo_total)
    VALUES (NEW.id_anggota, NEW.id_rombel, 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_tabungan
AFTER INSERT ON public.anggota_rombel
FOR EACH ROW EXECUTE FUNCTION public.fn_auto_create_tabungan();

-- Safety Validation: Anti-Saldo Negatif
CREATE OR REPLACE FUNCTION public.fn_cek_saldo_tabungan_cukup()
RETURNS trigger AS $$
DECLARE
    v_saldo_sekarang NUMERIC(12,2);
BEGIN
    SELECT saldo_total INTO v_saldo_sekarang FROM public.tabungan WHERE id_tabungan = NEW.id_tabungan;
    IF (v_saldo_sekarang < NEW.jumlah_keluar) THEN
        RAISE EXCEPTION 'Saldo tidak mencukupi! Sisa saldo: Rp %', v_saldo_sekarang;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validasi_saldo_tabungan
BEFORE INSERT ON public.pengeluaran
FOR EACH ROW EXECUTE FUNCTION public.fn_cek_saldo_tabungan_cukup();

--------------------------------------------------
-- 7. INDEXING
--------------------------------------------------
CREATE INDEX idx_siswa_nama ON public.siswa (nama_siswa);
CREATE UNIQUE INDEX idx_guru_dapodik ON public.guru (dapodik);

-------------------
-- UPDATE QUERY  --
-------------------

INSERT INTO public.jabatan (nama_jabatan)
VALUES 
('Kepala Sekolah'), 
('Staff'), 
('Guru'), 
('Wali Kelas');

----------------------------------------------------------

INSERT INTO public.tahun_akademik (tahun_ajaran, semester)
VALUES
('2025-2026', 'Genap'), 
('2026-2027', 'Ganjil');

----------------------------------------------------------

INSERT INTO public.siswa(
	nis_siswa, 
	nama_siswa, 
	tahun_masuk, 
	tahun_keluar, 
	password_siswa
) VALUES 
('09020624025', 'Arisula Buamona', 2020, null, 'A01B5002');

----------------------------------------------------------

INSERT INTO public.mata_pelajaran(
	mapel, 
	kurikulum, 
	stok_buku, 
	buku_untuk_kelas
) VALUES 
('Matematika', 'merdeka', 100, 1), 
('Bahasa Indonesia', 'merdeka', 100, 1), 
('Bahasa Inggris', 'merdeka', 100, 1);

----------------------------------------------------------

INSERT INTO public.kategori_rombel(
	kategori
) VALUES 
('A'), 
('B'), 
('C');

----------------------------------------------------------

INSERT INTO public.guru(
	dapodik, 
	nip, 
	nama_guru, 
	id_jabatan, 
	google_id, 
	email, 
	password_guru
) VALUES 
('12345678901234567890', '123456789012345678', 'Adisyah Reza', 
4, null, 'ryssofficial1@gmail.com', 'Arisulaa01112005');

----------------------------------------------------------

INSERT INTO public.kelompok_jabatan (id_jabatan, id_guru) VALUES 
(4, 1);

INSERT INTO public.rombongan_mapel (id_mapel, id_guru) VALUES 
(1, 1);

INSERT INTO public.pengajar (id_mapel, id_guru) VALUES 
(1, 1), 
(2, 1);

INSERT INTO public.rombel (kelas, id_kategori, id_guru, id_tahun) VALUES 
(1, 1, 1, 1);

INSERT INTO public.anggota_rombel (id_rombel, id_siswa, status_siswa) VALUES 
(1, 1, 'Aktif');

INSERT INTO public.jadwal (hari, jam_mulai, jam_selesai, id_mapel, id_guru, id_rombel, id_tahun) VALUES 
('Senin', '07:30:00', '09:00:00', 1, 1, 1, 1),
('Selasa', '09:30:00', '11:00:00', 2, 1, 1, 1);

INSERT INTO public.nilai_tugas (id_anggota, id_mapel, tugas_ke, nilai, id_guru) VALUES 
(1, 1, 1, 85.50, 1);

INSERT INTO public.presensi (id_anggota, tugas_ke, status_kehadiran) VALUES 
(1, 1, 'H');

INSERT INTO public.pemasukkan (id_tabungan, id_guru, jumlah_masuk, keterangan) VALUES 
(1, 1, 50000.00, 'Menabung setoran awal');

INSERT INTO public.pengeluaran (id_tabungan, id_guru, jumlah_keluar, keterangan) VALUES 
(1, 1, 20000.00, 'Tarik tunai beli buku');

INSERT INTO public.log_data (id_guru, id_siswa, ip_address, keterangan) VALUES 
(1, null, '192.168.1.10', 'Guru Adisyah login ke sistem'),
(null, 1, '192.168.1.15', 'Siswa Arisula melihat nilai');
INSERT INTO public.notifikasi (id_guru, id_siswa, judul, pesan) VALUES 
(null, 1, 'Pengumuman Libur', 'Hari esok sekolah diliburkan dalam rangka hari besar.');

INSERT INTO public.kas (id_rombel, saldo_kas) VALUES 
(1, 0);

INSERT INTO public.pemasukkan_kas (id_kas, id_guru, jumlah_masuk, keterangan) VALUES 
(1, 1, 100000.00, 'Iuran kas bulanan Januari kelas 1A');

INSERT INTO public.pengeluaran_kas (id_kas, id_guru, jumlah_keluar, keterangan) VALUES 
(1, 1, 35000.00, 'Beli sapu dan kemoceng kelas');

-------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------

----------------------------------------------------------
-- 1. TAMBAH DATA SISWA (Kelas 1 - 6)
----------------------------------------------------------
INSERT INTO public.siswa (nis_siswa, nama_siswa, tahun_masuk, tahun_keluar, password_siswa) VALUES 
('09020624026', 'Budi Santoso', 2021, null, 'SiswaBudi01'),
('09020624027', 'Siti Aminah', 2021, null, 'SitiAminah02'),
('09020624028', 'Joko Widodo', 2022, null, 'JokoW03'),
('09020624029', 'Rina Marlina', 2022, null, 'RinaM04'),
('09020624030', 'Andi Firmansyah', 2023, null, 'AndiF05'),
('09020624031', 'Maya Indah', 2023, null, 'MayaI06'),
('09020624032', 'Eko Prasetyo', 2024, null, 'EkoP07'),
('09020624033', 'Sari Melati', 2024, null, 'SariM08');

----------------------------------------------------------
-- 2. TAMBAH MATA PELAJARAN (Sesuai Kurikulum Merdeka SD)
----------------------------------------------------------
INSERT INTO public.mata_pelajaran (mapel, kurikulum, stok_buku, buku_untuk_kelas) VALUES 
('Pendidikan Pancasila', 'merdeka', 50, 1),
('Ilmu Pengetahuan Alam dan Sosial (IPAS)', 'merdeka', 60, 4),
('Pendidikan Jasmani Olahraga Kesehatan', 'merdeka', 40, 2),
('Seni Budaya dan Prakarya', 'merdeka', 40, 3),
('Pendidikan Agama Islam', 'merdeka', 100, 1);

----------------------------------------------------------
-- 3. TAMBAH DATA GURU & KEPALA SEKOLAH
----------------------------------------------------------
-- Ingat: NIP harus tepat 18 digit angka, Dapodik >= 10 karakter.
INSERT INTO public.guru (dapodik, nip, nama_guru, id_jabatan, email, password_guru) VALUES 
('12345678901234567891', '123456789012345679', 'Bambang Supriyanto', 4, 'bambang@gmail.com', 'GuruBambang01'),
('12345678901234567892', '123456789012345680', 'Sri Wahyuni', 4, 'sriwahyuni@gmail.com', 'GuruSri02'),
('12345678901234567893', '123456789012345681', 'Ahmad Hidayat', 3, 'ahmad@gmail.com', 'GuruAhmad03'),
('12345678901234567894', '123456789012345682', 'Nia Ramadhani', 3, 'nia@gmail.com', 'GuruNia04'),
('12345678901234567895', '123456789012345683', 'Iwan Fals', 1, 'kepsek@gmail.com', 'Kepsek01');

----------------------------------------------------------
-- 4. KELOMPOK JABATAN & PENGAJAR MAPEL
----------------------------------------------------------
INSERT INTO public.kelompok_jabatan (id_jabatan, id_guru) VALUES 
(4, 2), -- Bambang (Wali Kelas)
(4, 3), -- Sri (Wali Kelas)
(3, 4), -- Ahmad (Guru Mata Pelajaran)
(1, 6); -- Iwan (Kepala Sekolah)

INSERT INTO public.pengajar (id_mapel, id_guru) VALUES 
(4, 2), -- Bambang mengajar Pendidikan Pancasila
(5, 3), -- Sri mengajar IPAS
(6, 4), -- Ahmad mengajar PJOK
(8, 2); -- Bambang mengajar Agama Islam

----------------------------------------------------------
-- 5. PEMBAGIAN KELAS (ROMBEL) & ANGGOTA KELAS
----------------------------------------------------------
INSERT INTO public.rombel (kelas, id_kategori, id_guru, id_tahun) VALUES 
(2, 1, 2, 1), -- id_rombel 2: Kelas 2A, Wali Kelas Bambang (id_guru=2)
(3, 1, 3, 1), -- id_rombel 3: Kelas 3A, Wali Kelas Sri (id_guru=3)
(4, 1, 4, 1), -- id_rombel 4: Kelas 4A, Wali Kelas Ahmad (id_guru=4)
(5, 1, 5, 1); -- id_rombel 5: Kelas 5A, Wali Kelas Nia (id_guru=5)

-- Memasukkan siswa ke dalam kelas (Otomatis membuat tabungan baru via Trigger trg_auto_tabungan)
INSERT INTO public.anggota_rombel (id_rombel, id_siswa, status_siswa) VALUES 
(2, 2, 'Aktif'), -- id_anggota 2: Budi di 2A
(2, 3, 'Aktif'), -- id_anggota 3: Siti di 2A
(3, 4, 'Aktif'), -- id_anggota 4: Joko di 3A
(3, 5, 'Aktif'), -- id_anggota 5: Rina di 3A
(4, 6, 'Aktif'), -- id_anggota 6: Andi di 4A
(4, 7, 'Aktif'), -- id_anggota 7: Maya di 4A
(5, 8, 'Aktif'), -- id_anggota 8: Eko di 5A
(5, 9, 'Aktif'); -- id_anggota 9: Sari di 5A

----------------------------------------------------------
-- 6. JADWAL, NILAI, & PRESENSI
----------------------------------------------------------
INSERT INTO public.jadwal (hari, jam_mulai, jam_selesai, id_mapel, id_guru, id_rombel, id_tahun) VALUES 
('Rabu', '07:30:00', '09:00:00', 4, 2, 2, 1), -- Kelas 2A: Pend. Pancasila
('Kamis', '09:30:00', '11:00:00', 5, 3, 3, 1), -- Kelas 3A: IPAS
('Jumat', '07:30:00', '08:30:00', 6, 4, 4, 1); -- Kelas 4A: PJOK

-- Input nilai tugas (otomatis mengirim notifikasi via Trigger trg_notif_nilai_baru)
INSERT INTO public.nilai_tugas (id_anggota, id_mapel, tugas_ke, nilai, id_guru) VALUES 
(2, 4, 1, 90.00, 2), -- Nilai Budi
(3, 4, 1, 88.50, 2), -- Nilai Siti
(4, 5, 1, 75.00, 3); -- Nilai Joko

-- Input presensi (Karena tugas_ke diset UNIQUE di tabel, valuenya harus beda dari yang sebelumnya)
INSERT INTO public.presensi (id_anggota, tugas_ke, status_kehadiran) VALUES 
(2, 2, 'H'), -- Budi: Hadir
(3, 3, 'I'), -- Siti: Izin
(4, 4, 'S'); -- Joko: Sakit

----------------------------------------------------------
-- 7. TABUNGAN SISWA & KAS KELAS
----------------------------------------------------------
-- ID Tabungan berkorespondensi dengan ID Anggota (Budi = 2, Siti = 3, Joko = 4)
INSERT INTO public.pemasukkan (id_tabungan, id_guru, jumlah_masuk, keterangan) VALUES 
(2, 2, 20000.00, 'Tabungan harian Budi'),
(3, 2, 15000.00, 'Tabungan harian Siti'),
(4, 3, 50000.00, 'Tabungan mingguan Joko');

-- Joko (id_tabungan=4) jajan di koperasi ambil dari tabungan
INSERT INTO public.pengeluaran (id_tabungan, id_guru, jumlah_keluar, keterangan) VALUES 
(4, 3, 10000.00, 'Joko tarik tunai jajan koperasi');

-- Buka buku Kas untuk Rombel 2A, 3A, dan 4A
INSERT INTO public.kas (id_rombel, saldo_kas) VALUES 
(2, 0),
(3, 0),
(4, 0);

-- Transaksi Kas Rombel
INSERT INTO public.pemasukkan_kas (id_kas, id_guru, jumlah_masuk, keterangan) VALUES 
(2, 2, 50000.00, 'Iuran Kas kelas 2A dari murid'),
(3, 3, 60000.00, 'Iuran Kas kelas 3A dari murid');

INSERT INTO public.pengeluaran_kas (id_kas, id_guru, jumlah_keluar, keterangan) VALUES 
(2, 2, 15000.00, 'Beli spidol dan penghapus kelas 2A');

----------------------------------------------------------
-- 8. LOG SISTEM
----------------------------------------------------------
INSERT INTO public.log_data (id_guru, id_siswa, ip_address, keterangan) VALUES 
(2, null, '192.168.1.11', 'Guru Bambang login'),
(null, 4, '192.168.1.20', 'Siswa Joko melihat sisa saldo tabungan');