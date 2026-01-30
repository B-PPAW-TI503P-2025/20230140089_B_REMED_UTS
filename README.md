#
Laporan Pengembangan Aplikasi: Lib-Geo (Library Geolocation)

##
1. Pendahuluan
Lib-Geo adalah sistem manajemen perpustakaan berbasis web yang mengintegrasikan fitur Geolocation. Aplikasi ini memastikan validasi peminjaman buku dilakukan berdasarkan lokasi pengguna secara real-time, memberikan lapisan keamanan dan akurasi data tambahan bagi pengelola perpustakaan.

##
2. Cara Menjalankan Aplikasi

Untuk menjalankan aplikasi ini di lingkungan lokal, ikuti langkah-langkah berikut:
###
Prasyarat
•	Node.js (Versi 14 atau terbaru)
•	Laragon/MYSQL
###
Langkah Instalasi

1.	Ekstrak Source Code: Pastikan semua file berada dalam folder project.
   
2.	Instalasi Dependensi: Buka terminal di folder tersebut dan jalankan: npm install
	
4.	Konfigurasi Database
	
6.	Jalankan Server : node index.js
   

 ##
 3.Dokumentasi Antarmuka
###
Berikut adalah komponen utama dari antarmuka pengguna aplikasi Lib-Geo Library Geolocation):

LOGIN ADMIN
<img width="940" height="530" alt="image" src="https://github.com/user-attachments/assets/c3d9ea94-1305-4382-8bc0-4ebee74e3e92" />
Deskripsi: Halaman ini digunakan oleh pustakawan untuk mengelola data. Dashboard admin memiliki fitur CRUD (Create, Read, Update, Delete) buku dan pemantauan log lokasi peminjam.

LOGIN USER
<img width="940" height="385" alt="image" src="https://github.com/user-attachments/assets/0a0d2800-53e3-4a17-80ec-e533a6159858" />
Deskripsi: Antarmuka khusus mahasiswa untuk melihat katalog buku yang tersedia. Mahasiswa diwajibkan mengaktifkan izin GPS pada browser untuk dapat menekan tombol "Pinjam".

##
4. Daftar API (Endpoints)
   
Sistem ini menggunakan RESTful API dengan kontrol akses berbasis role (peran).
###
4.1. Public Endpoints

Akses terbuka untuk semua pengguna terautentikasi

•	GET /api/books : Mengambil daftar seluruh koleksi buku

•	GET /api/books/:id : Mengambil informasi detail satu buku spesifik, berdasarkan id
###
4.2. Admin Mode

Membutuhkan Header: x-user-role: admin

•	POST /api/books : Menambahkan koleksi buku baru ke database

•	PUT /api/books/:id : Memperbarui informasi buku (judul, penulis, atau stok)

•	DELETE /api/books/:id : Menghapus buku dari sistem, bersasarkan id
###
4.3. User Mode 

Membutuhkan Header: x-user-role: user & x-user-id: [id]

•	POST /api/borrow : Melakukan peminjaman buku.

  •	Payload wajib menyertakan koordinat latitude dan longitude dari perangkat user.

##
DOkumentasi Screenshooot

Public : GET /api/books : Melihat semua buku
<img width="940" height="437" alt="image" src="https://github.com/user-attachments/assets/ad17c4c8-14ee-4e2d-80c3-73147979a8d6" />

GET /api/books/:id : Detail buku
<img width="940" height="382" alt="image" src="https://github.com/user-attachments/assets/0124e124-a2c9-4191-acf0-cbed47327d28" />

Admin Mode (Header x-user-role: admin):

POST /api/books : Tambah buku baru
<img width="940" height="378" alt="image" src="https://github.com/user-attachments/assets/ac52b248-40d5-46de-8ad9-58c7676c6103" />

PUT /api/books/:id : Update buku
<img width="940" height="410" alt="image" src="https://github.com/user-attachments/assets/57401024-dccd-45f7-8ee4-2c41c4d15ab6" />

DELETE /api/books/:id : Hapus buku
<img width="940" height="342" alt="image" src="https://github.com/user-attachments/assets/3b139928-d4f2-49fb-b639-f852b4e85949" />

User Mode (Header x-user-role: user & x-user-id: [id]): 

POST /api/borrow : Meminjam buku
<img width="940" height="423" alt="image" src="https://github.com/user-attachments/assets/ffef7e5a-ccf6-49dc-96e9-942d12bb27af" />
