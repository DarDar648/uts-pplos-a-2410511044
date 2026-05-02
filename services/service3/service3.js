const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3001;

app.use(express.json());

// koneksi DB
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '545454',
  database: 'rumah_sakit'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// routes
app.post('/reservasi', (req, res) => {
  const { nama_pasien, jam } = req.body;

  const sql = `INSERT INTO reservasi (nama_pasien, id_dokter, tanggal, jam)
  SELECT ?, id_dokter, CURDATE(), ? FROM jadwal
  WHERE hari = DAYNAME(CURDATE())
  AND TIME(?) BETWEEN jam_mulai AND jam_selesai;`;

  db.query(sql, [nama_pasien, jam, jam], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.affectedRows === 0) {
    return res.status(400).send({
      message: "Tidak ada jadwal dokter di jam tersebut"
    });
  }

    res.status(201).send({ nama_pasien, jam });
  });
});

app.get('/dokter', (req, res) => {
  db.query('SELECT * FROM jadwal JOIN dokter ON jadwal.id_dokter = dokter.id_dokter ORDER BY id_jadwal', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

app.post('/selesai', (req, res) => {
  const { id_reservasi, diagnosis, total, jam_selesai } = req.body;

  const sql = `INSERT INTO log_kunjungan (id_reservasi, diagnosis, total, jam_selesai) VALUES (?, ?, ?, ?);`;

  db.query(sql, [id_reservasi, diagnosis, total, jam_selesai], (err, result) => {
    if (err) return res.status(500).send(err);

    res.status(201).send({ id_reservasi, diagnosis, total, jam_selesai });
  });
});

app.get('/reservasi', (req, res) => {
  db.query(`SELECT reservasi.id_reservasi, reservasi.nama_pasien, 
  dokter.nama AS nama_dokter, reservasi.tanggal, reservasi.jam 
  FROM reservasi 
  INNER JOIN dokter 
  ON reservasi.id_dokter = dokter.id_dokter ORDER BY id_reservasi;`, 
  (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

app.get('/log', (req, res) => {
  db.query(`SELECT log_kunjungan.id_log, log_kunjungan.id_reservasi, log_kunjungan.nama_pasien, 
  dokter.nama AS nama_dokter, log_kunjungan.tanggal, log_kunjungan.jam, log_kunjungan.jam_selesai, 
  log_kunjungan.diagnosis, log_kunjungan.total  
  FROM log_kunjungan 
  INNER JOIN dokter 
  ON log_kunjungan.id_dokter = dokter.id_dokter ORDER BY id_log`, 
    (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

app.get('/log/:id_dokter', (req, res) => {
  const { id_dokter } = req.params;

  const sql = `SELECT log_kunjungan.id_log, log_kunjungan.id_reservasi, log_kunjungan.nama_pasien, 
  dokter.nama AS nama_dokter, log_kunjungan.tanggal, log_kunjungan.jam, log_kunjungan.jam_selesai, 
  log_kunjungan.diagnosis, log_kunjungan.total  
  FROM log_kunjungan 
  INNER JOIN dokter 
  ON log_kunjungan.id_dokter = dokter.id_dokter 
  WHERE log_kunjungan.id_dokter = ?
  ORDER BY id_log`;

  db.query(sql, [id_dokter], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


// jalankan service
app.listen(port, () => {
  console.log(`Service1 jalan di port ${port}`);
});
