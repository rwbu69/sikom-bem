# SIKOM BEM (Sistem Informasi dan Komunikasi BEM)

SIKOM BEM adalah sebuah sistem informasi berbasis web yang dibangun untuk memodernisasi dan mendigitalisasi pengelolaan kegiatan, kehadiran, dokumen, serta rekrutmen kepanitiaan di lingkungan Badan Eksekutif Mahasiswa (BEM).

---

## 🛠️ Stack Teknologi yang Digunakan

Aplikasi ini dikembangkan dengan *stack* modern untuk menjamin performa, skalabilitas, dan pengalaman pengguna yang maksimal:

- **Framework**: [Next.js](https://nextjs.org/) (App Router) dengan TypeScript.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Komponen antarmuka dari [shadcn/ui](https://ui.shadcn.com/) dan `@base-ui/react`.
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) dengan database lokal SQLite (`dev.db`).
- **Autentikasi**: Custom JWT (JSON Web Tokens) menggunakan library `jose` dan enkripsi *password* menggunakan `bcryptjs`.
- **Fitur Tambahan**: 
  - `html5-qrcode` & `qrcode.react` untuk *generate* dan *scanning* QR Code presensi.
  - `xlsx` untuk ekspor data tabel laporan ke file Excel.
  - `sonner` untuk notifikasi Toast yang elegan.
  - `lucide-react` untuk ikon-ikon minimalis yang konsisten.

---

## 🚀 Rincian Fitur Aplikasi

Sistem ini membagi akses menjadi 2 peran utama: **Admin** (Pengurus BEM) dan **Mahasiswa** (Pengguna Umum).

### 1. Manajemen Akun & Autentikasi (Auth)
- **Login Terpusat**: Sistem autentikasi aman dengan *role-based access control* (RBAC).
- **Profil Pengguna**: Mahasiswa dapat memperbarui *password* dan data diri, serta melihat akumulasi **Poin Keaktifan**.
- **User Management (Admin)**: Admin dapat mereset *password* default, mengubah *role* pengguna, dan memonitor data mahasiswa.

### 2. Manajemen Kegiatan (Events)
- **Buat & Edit Kegiatan**: Admin dapat membuat *event* baru, mengatur kuota (kapasitas), visibilitas (UMUM/INTERNAL), jadwal, serta status kegiatan (DRAFT, OPEN, ONGOING, COMPLETED).
- **Pendaftaran Mahasiswa**: Mahasiswa dapat mendaftarkan diri pada kegiatan yang berstatus *OPEN* dan memantau status pendaftaran mereka (Pending, Confirmed, Rejected).

### 3. Sistem Kepanitiaan (Committee Recruitment)
- **Buka Oprec**: Admin dapat membuka pendaftaran kepanitiaan untuk suatu *event* dan membuat divisi-divisi spesifik beserta kuota dan pertanyaan kustom (*Custom Questions*).
- **Pendaftaran Panitia**: Mahasiswa dapat melamar hingga maksimal 2 pilihan divisi, mengisi alasan/motivasi, dan melampirkan portofolio.
- **Seleksi**: Admin dapat melihat daftar pelamar dan meluluskan mahasiswa ke Divisi 1 atau Divisi 2, ataupun menolaknya.

### 4. Presensi Kehadiran Terpadu (Attendance)
- **Scan QR Code**: Admin menampilkan QR Code, dan mahasiswa melakukan *scan* menggunakan kamera ponsel.
- **Token Unik**: Tersedia *fallback* berupa input Token unik jika kamera gagal berfungsi.
- **Manual Check-In**: Admin dapat mengabsen mahasiswa secara manual melalui *dashboard*.
- **Ekspor Data**: Data kehadiran dapat diunduh oleh Admin ke dalam format *spreadsheet* (.xlsx) untuk laporan fisik.

### 5. Manajemen Dokumen (Proposal & LPJ)
- **Upload Berkas**: Mahasiswa/Panitia dapat mengunggah dokumen berekstensi `.pdf` untuk keperluan Proposal atau Laporan Pertanggungjawaban (LPJ).
- **Tracking Status**: Admin dapat meninjau (*review*) dokumen tersebut, mengubah statusnya menjadi *Approved*, *Rejected*, atau meminta revisi, serta mengunduh berkasnya.

### 6. Pengumuman & Audit Log
- **Pengumuman**: Platform informasi satu arah dari BEM (Admin) yang langsung tampil di *dashboard* seluruh mahasiswa.
- **Audit Logs**: Sistem log otomatis (di *background*) yang mencatat aktivitas krusial admin (contoh: pembuatan kegiatan, penghapusan dokumen) demi akuntabilitas sistem.

---

## 💻 Cara Setup Lingkungan Development

Ikuti panduan berikut untuk menjalankan sistem secara lokal di komputer Anda:

### Prasyarat
- Node.js versi 18 atau yang lebih baru.
- Git.

### Langkah-langkah
1. **Clone Repository**
   ```bash
   git clone https://github.com/rwbu69/sikom-bem.git
   cd sikom-bem
   ```

2. **Instalasi Dependencies**
   ```bash
   npm install
   ```

3. **Inisialisasi Database (SQLite)**
   Aplikasi secara otomatis menggunakan file `dev.db` untuk keperluan pengembangan. Lakukan sinkronisasi skema Prisma:
   ```bash
   npx prisma db push
   ```
   *(Opsional: Jika ada file `prisma/seed.ts`, Anda bisa menjalankan perintah `npx prisma db seed` untuk mengisi data *dummy*)*.

4. **Jalankan Aplikasi**
   ```bash
   npm run dev
   ```

5. **Akses Aplikasi**
   Buka *browser* Anda dan arahkan ke alamat **[http://localhost:3000](http://localhost:3000)**.

---

## 🧪 Cara Tes Semua Fitur Aplikasinya

Untuk memastikan semua modul berjalan semestinya, lakukan pengujian fungsional dengan skenario berikut:

### A. Pengujian Autentikasi
1. Akses `http://localhost:3000/login`.
2. Lakukan login sebagai **Admin** (pastikan Anda sudah membuat atau melakukan *seed* user dengan role `ADMIN`).
3. Lakukan *logout* dan coba *login* kembali menggunakan akun dengan role `MAHASISWA`. 
4. Jika halaman *dashboard* yang tertampil berbeda (*Admin Dashboard* vs *Student Dashboard*), maka sistem *Routing* dan *Auth Guard* berjalan sempurna.

### B. Pengujian Kegiatan & Pendaftaran
1. **(Admin)** Buka menu **Manajemen Kegiatan**, lalu klik tombol **Buat Kegiatan Baru**. Isi detail (Nama, Kuota, Visibilitas UMUM) dan *Publish*.
2. **(Mahasiswa)** Login menggunakan akun mahasiswa, cari kegiatan yang baru saja dibuat, lalu klik **Daftar Kegiatan**.
3. **(Admin)** Cek tabel Pendaftar di detail kegiatan tersebut dan pastikan nama mahasiswa tersebut muncul, lalu ubah statusnya menjadi *Confirmed*.

### C. Pengujian Presensi Kehadiran
1. **(Admin)** Masuk ke detail suatu kegiatan yang statusnya *ONGOING*. Buka menu **Presensi / Kehadiran**.
2. **(Admin)** Tampilkan **QR Code** layar penuh.
3. **(Mahasiswa)** Buka menu **Absen / Scan QR** di ponsel, dan cobalah *scan* QR code di layar Admin. Jika berhasil, sistem akan merespon dengan notifikasi sukses.
4. **(Admin & Mahasiswa)** Uji juga fitur absen dengan **Token** unik (kombinasi huruf/angka) untuk memastikan jalur *fallback* berfungsi.
5. **(Admin)** Klik tombol **Export Data (Excel)** dan pastikan file `.xlsx` terunduh dengan data kehadiran yang valid.

### D. Pengujian Manajemen Dokumen
1. **(Mahasiswa)** Buka salah satu kegiatan, masuk ke bagian Dokumen/Berkas. Unggah sebuah file `.pdf` simulasi (contoh: Proposal).
2. **(Admin)** Masuk ke panel admin, buka **Arsip / Dokumen**, temukan dokumen yang baru diunggah, coba klik tombol **Unduh** untuk mengecek integritas file, dan ubah statusnya menjadi *Approved*.

### E. Pengujian Rekrutmen Kepanitiaan (Oprec)
1. **(Admin)** Masuk ke halaman detail Kegiatan, pilih **Buka Oprec**. Buat 2 Divisi (misal: Acara & Humas) dan tambahkan *Custom Question*.
2. **(Mahasiswa)** Di halaman detail acara yang sama, temukan seksi Rekrutmen Kepanitiaan dan klik **Lamar Panitia**. Pilih Divisi Acara sebagai opsi 1, dan Divisi Humas sebagai opsi 2. Isi alasan dan Submit.
3. **(Admin)** Buka halaman **Pelamar Kepanitiaan**, temukan pelamar tersebut, dan klik aksi **Terima di Divisi 1**. Pastikan status pelamar langsung diperbarui.
