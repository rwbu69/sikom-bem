# Panduan Desain UI/UX (SIKOM BEM)

Dokumen ini adalah aturan wajib (*Single Source of Truth*) untuk pengembangan antarmuka pengguna pada sistem ini. Seluruh komponen harus merujuk pada aturan di bawah dan **dilarang menggunakan gaya mentah Tailwind** di luar sistem token.

## 1. Filosofi Desain
*   **Fungsional & Padat (Admin):** Panel admin adalah alat kerja, bukan brosur pemasaran. Ruang kosong (*whitespace*) digunakan dengan efisien, hierarki data jelas, dan meminimalkan pergerakan kursor yang tidak perlu.
*   **Fokus & Besar (Mahasiswa):** Layar mahasiswa difokuskan untuk layar ponsel (360px). Elemen yang bisa disentuh (tombol, input) harus berukuran besar (minimal tinggi 48px).

## 2. Palet Warna (Tokens)
Jangan pernah menggunakan kelas warna bawaan Tailwind (seperti `bg-blue-600` atau `text-slate-900`) langsung di komponen. Selalu gunakan warna kustom yang didefinisikan dalam `@theme` di `globals.css`.

*   **Primary:** Warna aksen utama (merujuk pada identitas institusi BEM).
*   **Surface:** Latar belakang utama aplikasi (putih atau *off-white* hangat).
*   **Surface-Muted:** Latar belakang untuk elemen sekunder (*hover states*, kartu sekunder).
*   **Border:** Warna garis pembatas (Abu-abu hangat terang).
*   **Text-Main:** Teks primer (Abu-abu sangat gelap, hindari hitam pekat `#000000`).
*   **Text-Muted:** Teks sekunder (Label, *placeholder*).

## 3. Aturan Bentuk & Bayangan (Geometry & Depth)
*   **Radius Tunggal (Border Radius):** Maksimal sudut lengkung adalah **6px** (`rounded-md` dalam skala default Tailwind).
    *   *Pengecualian:* Elemen melingkar penuh (Avatar profil).
    *   *Dilarang:* Penggunaan `rounded-2xl`, `rounded-3xl`, dan seterusnya pada *Card* atau bungkus halaman.
*   **Garis Tepi (Border):** Gunakan border `1px solid` dengan warna `border` untuk membatasi ruang (kartu, form, *header*).
*   **Bayangan (Shadow):** **Dilarang keras** menggunakan *shadow* pada *Card* konvensional. UI harus terlihat datar (*flat*) dan menyatu.
    *   *Pengecualian:* *Shadow* ringan (`shadow-sm` atau `shadow-md`) diizinkan HANYA pada elemen melayang vertikal seperti *Dropdown Menu*, *Modal/Dialog*, dan *Toasts*.

## 4. Tipografi
Skala font dibatasi untuk menjaga konsistensi vertikal.
*   **Heading:** `Bricolage Grotesque`. Gunakan HANYA untuk judul halaman (H1), metrik statistik raksasa, dan layar pendaratan utama. Tidak boleh digunakan untuk teks paragraf atau label.
*   **Body:** `Plus Jakarta Sans`. Font pekerja keras untuk semua elemen teks antarmuka (form, tabel, navigasi, deskripsi).
*   **Mono:** Digunakan secara eksklusif untuk NIM, Kode Kegiatan, dan token yang bersifat unik/di- *generate*.

## 5. Pola Komponen & Kosmetik
*   **Zero Decorative Animations:** Dilarang menggunakan animasi berlebihan (`animate-in`, `zoom-in`, `fade-in` berdurasi panjang). Interaksi harus instan.
*   **Empty State:** Saat tidak ada data, tampilkan teks sederhana dan satu ikon (opsional) dengan warna redup. DILARANG MENGGUNAKAN EMOJI (👻, 🎉, dll).
*   **Copywriting:** Harus singkat, lugas, dan sehari-hari. 
    *   *Buruk:* "Yayy! Selamat! Berkas LPJ berhasil diunggah dengan sempurna ke dalam database sistem!"
    *   *Baik:* "Berkas LPJ berhasil diunggah."

## 6. Prosedur Pengembangan
1. Jika butuh tata letak baru, rakit menggunakan blok yang sudah ada (*PageHeader*, *StatBlock*, komponen UI dasar).
2. Jangan pernah menduplikasi warna atau properti statis di *inline style*.
3. Utamakan tampilan responsif (*Mobile-First*) terutama pada rute `(mahasiswa)`.
