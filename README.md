# SIKOM BEM (Sistem Informasi dan Komunikasi BEM)

Sistem Informasi untuk mengelola kegiatan, kehadiran, dokumen (proposal/LPJ), dan pendaftaran kepanitiaan di lingkungan Badan Eksekutif Mahasiswa (BEM).

## 🚀 Fitur Aplikasi

1. **Autentikasi & Role Management**
   - Login untuk Mahasiswa dan Admin.
   - Manajemen akses berdasarkan role (ADMIN, MAHASISWA, SuperAdmin).
2. **Manajemen Acara (Event Management)**
   - Pembuatan dan pengelolaan acara (termasuk status dan visibilitas).
   - Pendaftaran acara oleh mahasiswa.
3. **Sistem Presensi (Attendance)**
   - Presensi menggunakan QR Code, Token unik, maupun secara Manual.
   - Fitur ekspor data kehadiran.
4. **Manajemen Dokumen (Document Tracking)**
   - Pengajuan dan pelacakan status dokumen seperti Proposal dan LPJ.
5. **Rekrutmen Kepanitiaan (Committee Recruitment)**
   - Pendaftaran divisi kepanitiaan dengan pertanyaan kustom (Custom Questions).
   - Penilaian dan pengelolaan status kelulusan peserta (Divisi 1 atau Divisi 2).
6. **Sistem Poin Mahasiswa**
   - Pemberian poin keaktifan mahasiswa.
7. **Pengumuman (Announcements)**
   - Publikasi informasi/pengumuman terbaru kepada seluruh pengguna sistem.
8. **Audit Trail (Audit Logs)**
   - Log sistem untuk mencatat aktivitas penting admin atau pengguna.

## 🛠️ Cara Setup

Ikuti langkah-langkah berikut untuk menjalankan project di environment lokal:

1. **Clone Repository (Jika belum)**
   ```bash
   git clone https://github.com/rwbu69/sikom-bem.git
   cd sikom-bem
   ```

2. **Install Dependencies**
   Pastikan Anda telah menginstal Node.js versi 18+.
   ```bash
   npm install
   ```

3. **Setup Database**
   Aplikasi ini menggunakan SQLite untuk proses development (`dev.db`). Anda hanya perlu melakukan push schema Prisma ke database:
   ```bash
   npx prisma db push
   ```
   *(Catatan: Jika diperlukan seeding data awal, jalankan `npx prisma db seed`)*

4. **Jalankan Development Server**
   ```bash
   npm run dev
   ```

## 🧪 Cara Tes Aplikasinya Jalan atau Tidak

1. Pastikan proses `npm run dev` pada terminal berjalan sukses tanpa pesan *error* merah.
2. Buka browser kesayangan Anda dan kunjungi URL **[http://localhost:3000](http://localhost:3000)**.
3. Jika antarmuka/halaman *login* atau beranda berhasil dimuat dengan baik, tandanya aplikasi berjalan sempurna.
4. Coba melakukan interaksi sederhana seperti membuka *dashboard* admin atau *dashboard* mahasiswa untuk memastikan *routing* bekerja.
