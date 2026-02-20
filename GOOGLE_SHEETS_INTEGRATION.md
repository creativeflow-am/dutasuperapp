
# 📊 Panduan Sinkronisasi Database Google Sheets (v11 - Auto Setup)

Ikuti langkah-langkah ini untuk membangun backend otomatis menggunakan Google Sheets dan Google Drive. Anda tidak perlu membuat tab atau header secara manual lagi!

---

### Langkah 1: Buat Spreadsheet Baru
1. Buat Google Sheets baru di [sheet.new](https://sheet.new).
2. Beri nama file: `CreativeFlow_Database_Robust`.
3. **Biarkan kosong**, jangan buat tab atau header apa pun. Script akan membuatnya untuk Anda.

---

### Langkah 2: Setup Google Apps Script
1. Di Spreadsheet, klik **Extensions** > **Apps Script**.
2. Hapus semua kode default.
3. Salin isi file `google-apps-script.txt` ke dalam editor script.
4. Klik **Save** (ikon disket), beri nama proyek: `CreativeFlow_Engine`.

---

### Langkah 3: Deploy sebagai Web App
1. Klik tombol **Deploy** > **New Deployment**.
2. Pilih tipe: **Web App**.
3. **Execute as**: `Me` (Email Anda).
4. **Who has access**: `Anyone`.
5. Klik **Deploy**.
6. Klik **Authorize Access** dan pilih akun Google Anda. Jika muncul "Google hasn't verified this app", klik *Advanced* > *Go to CreativeFlow_Engine (unsafe)*.
7. Salin **Web App URL** (Contoh: `https://script.google.com/macros/s/.../exec`).

---

### Langkah 4: Hubungkan ke Frontend
1. Buka file `services/googleSheetService.ts`.
2. Ganti nilai `const API_URL` dengan URL yang Anda salin tadi.
3. Simpan file.
4. **Refresh Aplikasi**: Saat aplikasi pertama kali memuat, script akan otomatis membuat semua tab (`Content`, `Evidence`, `Performance`, dll) di Spreadsheet Anda.

---

### Fitur Keunggulan v11:
- **Auto-Setup**: Script otomatis membuat tab dan header jika belum ada.
- **Header Agnostik**: Anda bisa mengubah nama header di Sheet, sistem tetap sinkron.
- **Drive Storage**: File otomatis tersimpan di folder Drive `CreativeFlow_Assets`.
- **Auto Sharing**: File yang diunggah otomatis memiliki izin akses publik.

---

### Langkah 5: Integrasi Google Drive (Otomatis)
Sistem ini sudah dilengkapi dengan fitur **Auto-Drive Storage**. Setiap kali Anda mengunggah file (PDF/Gambar) melalui form "Evidence", script akan:
1. Mendeteksi data Base64 dari frontend.
2. Membuat folder `CreativeFlow_Assets` di Google Drive Anda secara otomatis.
3. Menyimpan file tersebut ke Drive.
4. Mengatur izin file menjadi "Anyone with link can view".
5. Mengganti data Base64 di Spreadsheet dengan **URL Link Drive** yang permanen.

**Penting:** Pastikan Anda memberikan izin saat melakukan deployment (Langkah 4) agar script memiliki akses ke Google Drive Anda.

---

### Troubleshooting & Tips
- **Gagal Sinkron?** Pastikan URL di `API_URL` sudah benar dan deployment di Apps Script diatur ke "Anyone".
- **Header Tidak Muncul?** Pastikan baris pertama di setiap tab Spreadsheet sudah diisi sesuai tabel di Langkah 2.
- **File Terlalu Besar?** Batas upload melalui Apps Script adalah sekitar 10MB-50MB tergantung koneksi. Disarankan kompres gambar sebelum upload.
- **Keamanan**: Jangan bagikan URL `API_URL` Anda kepada orang yang tidak berwenang karena ini adalah pintu akses ke database Anda.
