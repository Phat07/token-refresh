require('dotenv').config();
const mysql = require('mysql2/promise');

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE_NAME,
      port: process.env.DB_PORT,
    });

    console.log('Connected to MySQL database!');
    // Perform database operations here
    await connection.end();
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
  }
}

connectToDatabase();
