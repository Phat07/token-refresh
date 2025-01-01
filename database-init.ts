const mysql = require('mysql2/promise');

async function createDatabaseIfNotExists() {
  // Cấu hình kết nối cơ sở dữ liệu
  const host = 'localhost';
  const user = 'root';
  const password = 'admin';
  const databaseName = 'hairhub';

  // Kết nối đến cơ sở dữ liệu hệ thống
  const pool = mysql.createPool({
    host,
    user,
    password,
  });

  try {
    // Tạo cơ sở dữ liệu nếu chưa tồn tại
    await pool.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`);
    console.log(`Database "${databaseName}" created or already exists.`);
  } catch (error) {
    console.error('Error creating database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createDatabaseIfNotExists();
