const express = require('express');
const path = require('path');
const { sequelize, Book, BorrowLog, User } = require('./db');
const { checkRole } = require('./middleware');

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// --- Relasi ---
BorrowLog.belongsTo(Book, { foreignKey: 'bookId' });
Book.hasMany(BorrowLog, { foreignKey: 'bookId' });

// --- AUTH ENDPOINT ---
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username, password } });
        if (user) {
            // Kirim data lengkap untuk disimpan di localStorage
            res.json({ 
                success: true, 
                role: user.role, 
                userId: user.id, 
                username: user.username 
            });
        } else {
            res.status(401).json({ success: false, message: "Username/Password Salah!" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- REGISTRASI ENDPOINT ---
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Cek apakah username sudah dipakai
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: "Username sudah digunakan!" });
        }

        // Simpan user baru (default role: user)
        const newUser = await User.create({ 
            username, 
            password, 
            role: 'user' 
        });

        res.status(201).json({ success: true, message: "Registrasi Berhasil!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- ROUTING HALAMAN ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public/admin.html')));
app.get('/user', (req, res) => res.sendFile(path.join(__dirname, 'public/user.html')));

// --- API ENDPOINTS ---

//ambil semua bku 
app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.findAll();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//admn detail bku by id 
app.get('/api/books/:id', async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ message: "Buku tidak ditemukan" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//admin tambah buku
app.post('/api/books', checkRole('admin'), async (req, res) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (err) {
        res.status(400).json({ message: "Gagal tambah buku: " + err.message });
    }
});

//admim upadte buku
app.put('/api/books/:id', checkRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Book.update(req.body, { where: { id } });
        if (updated) {
            const updatedBook = await Book.findByPk(id);
            return res.json({ message: "Buku berhasil diupdate", data: updatedBook });
        }
        throw new Error('Buku tidak ditemukan');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//admin hapus buku
app.delete('/api/books/:id', checkRole('admin'), async (req, res) => {
    try {
        const result = await Book.destroy({ where: { id: req.params.id } });
        if (!result) return res.status(404).json({ message: "Buku tidak ditemukan" });
        res.json({ message: "Buku berhasil dihapus" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//admin riwayat peminjaman
app.get('/api/admin/history', checkRole('admin'), async (req, res) => {
    try {
        const history = await BorrowLog.findAll({
            include: [{ model: Book, attributes: ['title'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// user pinjam buku
app.post('/api/borrow', checkRole('user'), async (req, res) => {
    const { bookId, latitude, longitude } = req.body;
    const userId = req.headers['x-user-id'];

    if (!userId || !latitude || !longitude) {
        return res.status(400).json({ message: "Data tidak lengkap (ID User/Lokasi)" });
    }

    try {
        const book = await Book.findByPk(bookId);
        if (!book || book.stock <= 0) return res.status(400).json({ message: "Stok habis!" });

        await book.update({ stock: book.stock - 1 });
        const log = await BorrowLog.create({ 
            userId, bookId, latitude, longitude, borrowDate: new Date() 
        });
        res.json({ message: "Berhasil pinjam!", data: log });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 3000;
sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));
});