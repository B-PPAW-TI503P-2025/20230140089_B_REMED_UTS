const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'library_db', 
  process.env.DB_USER || 'root', 
  process.env.DB_PASS || '', 
  {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql'
  }
);

const Book = sequelize.define('Book', {
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 }
});

const BorrowLog = sequelize.define('BorrowLog', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  bookId: { type: DataTypes.INTEGER, allowNull: false },
  borrowDate: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  latitude: { type: DataTypes.FLOAT },
  longitude: { type: DataTypes.FLOAT }
});

// --- MODEL USER BARU ---
const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'user'), defaultValue: 'user' }
});

// Seeder Otomatis
sequelize.sync().then(async () => {
  const count = await User.count();
  if (count === 0) {
    await User.bulkCreate([
      { username: 'admin', password: '123', role: 'admin' },
      { username: 'mhs101', password: '123', role: 'user' }
    ]);
    console.log("✅ Database Ready & User Seeder Created!");
  }
});

module.exports = { sequelize, Book, BorrowLog, User };