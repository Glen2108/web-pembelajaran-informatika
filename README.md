# 🎓 Learning Hub Informatika — SMAN 4 Manado

Portal Pembelajaran dan Presensi Mandiri Terpadu untuk Mata Pelajaran Informatika di SMAN 4 Manado. Aplikasi web ini dirancang responsif, modern, dan real-time untuk memudahkan interaksi antara Siswa dan Guru.

---

## 🌟 Fitur Utama

### 🎓 Portal Siswa
* **Presensi Online Mandiri:** Pencatatan jam login siswa secara otomatis tanpa menumpuk data berulang.
* **Sistem Ingat Perangkat:** Memanfaatkan `localStorage` untuk menyimpan Nama dan Kelas di perangkat siswa (*Remember Me*).
* **Materi Pelajaran Interaktif:** 
  * Filter berbasis **Tab Kelas (Semua Kelas, Kelas X, XI, XII)** dalam 1 wadah ringkas.
  * Pembatasan akses berbasis kelas (*Grade Match Lock*).
  * Fitur hitung mundur waktu pembukaan materi (*Unlock Countdown Timer*).
* **Pengumpulan Tugas via Google Drive:** Form kumpul tugas mudah dengan validasi tenggat waktu (*Deadline Control*) serta panduan integrasi Google Drive.
* **Integrasi Portal Sekolah:** Akses langsung ke sistem presensi terpadu sekolah melalui modal interaktif.

### 🛡️ Panel Admin / Guru
* **Dashboard Rekapitulasi Realtime:** Indikator statistik otomatis untuk total kehadiran, modul materi, tugas aktif, dan pengumpulan tugas.
* **Filter & Pencarian Presensi:** Pencarian data siswa beserta filter per tingkat kelas.
* **Manajemen Konten:** Fitur menambah dan menghapus materi pelajaran maupun tugas siswa.
* **Export Data ke CSV/Excel:** Mengunduh rekap riwayat presensi dan pengumpulan tugas dalam sekali klik.
* **Reset Tahun Ajaran Baru:** Fitur pembersihan database jangka panjang secara aman.

---

## 🛠️ Teknologi yang Digunakan

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Styling & Framework UI:** [Tailwind CSS CDN](https://tailwindcss.com/)
* **Icon & Typography:** FontAwesome 6, Google Fonts (*Plus Jakarta Sans*)
* **Database & Backend:** [Firebase Realtime Database](https://firebase.google.com/) (SDK v10.8.0 Compat)
* **Storage Local:** Web Storage API (`localStorage`)

---

## 🚀 Cara Menjalankan Proyek

1. **Clone Repositori ini:**
   ```bash
   git clone [https://github.com/username/informatika-sman4-manado.git](https://github.com/username/informatika-sman4-manado.git)
