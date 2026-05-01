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
app.post('/mahasiswa', (req, res) => {
  const { nim, nama, prodi } = req.body;

  const sql = `INSERT INTO mahasiswa (nim, nama, prodi) VALUES (?, ?, ?)`;

  db.query(sql, [nim, nama, prodi], (err, result) => {
    if (err) return res.status(500).send(err);

    res.status(201).send({ nim, nama, prodi });
  });
});

app.get('/dokter', (req, res) => {
  db.query('SELECT * FROM jadwal JOIN dokter ON jadwal.id_dokter = dokter.id_dokter ORDER BY id_jadwal', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

// jalankan service
app.listen(port, () => {
  console.log(`Service1 jalan di port ${port}`);
});