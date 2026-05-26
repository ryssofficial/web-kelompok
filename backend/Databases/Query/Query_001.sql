---------------------------------------
-- 1. DATA Single Valued Attribute (SVA)
---------------------------------------
CREATE TABLE IF NOT EXISTS public.tahun_akademik (
    id_tahun SERIAL PRIMARY KEY,
    tahun_ajaran VARCHAR(9) NOT NULL,
    semester VARCHAR(6) NOT NULL,
    status_aktif BOOLEAN DEFAULT false
);
ALTER TABLE public.tahun_akademik OWNER TO "USERS";

CREATE TABLE IF NOT EXISTS public.siswa (
    id_siswa SERIAL PRIMARY KEY,  
    nis_siswa BIGINT NOT NULL UNIQUE, 
    nama_siswa VARCHAR(50) NOT NULL, 
    tahun_masuk SMALLINT NOT NULL, 
    tahun_keluar SMALLINT DEFAULT NULL, 
    password_siswa VARCHAR(255) NOT NULL UNIQUE
);
ALTER TABLE public.siswa OWNER TO postgres;

CREATE TABLE IF NOT EXISTS public.mata_pelajaran (
    id_mapel SERIAL PRIMARY KEY, 
    mapel VARCHAR(50) NOT NULL,
    kurikulum VARCHAR(20) NOT NULL,
    stok_buku INT DEFAULT 0,
    buku_untuk_kelas SMALLINT NOT NULL,
    CONSTRAINT check_tingkat_sd CHECK (buku_untuk_kelas >= 1 AND buku_untuk_kelas <= 6)
);
ALTER TABLE public.mata_pelajaran OWNER TO "USERS";

CREATE TABLE IF NOT EXISTS public.kategori_rombel (
    id_kategori SERIAL PRIMARY KEY, 
    kategori CHAR(1) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.jabatan (
    id_jabatan SERIAL PRIMARY KEY,
    nama_jabatan VARCHAR(20) NOT NULL UNIQUE
);
ALTER TABLE public.jabatan OWNER TO postgres;

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
ALTER TABLE public.guru OWNER TO "USERS";

CREATE TABLE IF NOT EXISTS public.kelompok_jabatan (
    id_kelompok SERIAL PRIMARY KEY, 
    id_jabatan INT NOT NULL, 
    id_guru INT NOT NULL, 
    
    CONSTRAINT fk_jabatan FOREIGN KEY (id_jabatan) REFERENCES public.jabatan(id_jabatan), 
    CONSTRAINT fk_guru FOREIGN KEY (id_guru) REFERENCES public.guru(id_guru)
);
-- Perbaikan Typo: kelompook -> kelompok
ALTER TABLE public.kelompok_jabatan OWNER TO "USERS";

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
ALTER TABLE public.rombel OWNER TO "USERS";

CREATE TABLE IF NOT EXISTS public.anggota_rombel (
    id_anggota SERIAL PRIMARY KEY,
    id_rombel INT NOT NULL,
    id_siswa INT NOT NULL,
    status_siswa VARCHAR(20) DEFAULT 'Aktif', 
    
    CONSTRAINT fk_anggota_rombel FOREIGN KEY (id_rombel) REFERENCES public.rombel(id_rombel) ON DELETE CASCADE,
    CONSTRAINT fk_anggota_siswa FOREIGN KEY (id_siswa) REFERENCES public.siswa(id_siswa) ON DELETE CASCADE,
    CONSTRAINT unique_siswa_per_tahun UNIQUE (id_rombel, id_siswa)
);
ALTER TABLE public.anggota_rombel OWNER TO "USERS";

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
ALTER TABLE public.jadwal OWNER TO "USERS";

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
ALTER TABLE public.tabungan OWNER TO postgres;

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
ALTER TABLE public.log_data OWNER TO postgres;

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
ALTER TABLE public.notifikasi OWNER TO "USERS";

CREATE TABLE IF NOT EXISTS public.kas (
    id_kas SERIAL PRIMARY KEY,
    id_rombel INT NOT NULL UNIQUE, 
    saldo_kas NUMERIC(12,2) DEFAULT 0,
    
    CONSTRAINT fk_kas_rombel FOREIGN KEY (id_rombel) REFERENCES public.rombel(id_rombel) ON DELETE CASCADE
);
ALTER TABLE public.kas OWNER TO postgres;

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