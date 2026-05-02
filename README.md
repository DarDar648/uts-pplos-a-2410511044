# uts-pplos-a-2410511044

Deskripsi

Project ini merupakan implementasi sistem rumah sakit berbasis arsitektur microservice menggunakan Node.js dan MySQL. Sistem pada awalnya terdiri dari beberapa service (auth-service, service2, service3, dan gateway). Namun pada implementasi akhir, hanya service3 yang berhasil berjalan secara stabil dan digunakan sebagai service utama database.

Video Dokumentasi

https://youtu.be/SPF8xzrUoTE

Arsitektur Sistem
Desain Awal (Microservice)
Auth Service
Service 2 (Business Logic Service)
Service 3 (Database Service)
API Gateway
Implementasi Akhir
Service 3 (MySQL Service)
Fungsi Service 3

Service 3 berfungsi sebagai pusat pengelolaan data sistem rumah sakit yang mencakup:

Data dokter
Jadwal dokter
Reservasi pasien
Log kunjungan
Struktur Database
Tabel dokter
id_dokter (Primary Key)
nama
Tabel jadwal
id_jadwal (Primary Key)
id_dokter (Foreign Key)
hari
jam_mulai
jam_selesai
Tabel reservasi
id_reservasi (Primary Key)
nama_pasien
id_dokter
tanggal
jam
Tabel log_kunjungan
id_log (Primary Key)
id_reservasi
nama_pasien
id_dokter
tanggal
jam
jam_selesai
diagnosis
total
Teknologi yang Digunakan
Node.js
Express.js
MySQL
Git & GitHub
Cara Menjalankan Project

Untuk menjalankan seluruh service yang tersedia, gunakan file berikut:

runservice.bat
Kesimpulan

Pada awalnya sistem dirancang menggunakan arsitektur microservice lengkap. Namun pada implementasi akhir, sistem disederhanakan menjadi satu service utama yaitu service3 yang berfungsi sebagai database service untuk seluruh operasi sistem rumah sakit.

Catatan

Project ini tetap merepresentasikan konsep microservice meskipun hanya satu service yang digunakan pada implementasi akhir.
