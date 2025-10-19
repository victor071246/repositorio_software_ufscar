import mysql from 'mysql2/promise';
import dontenv from 'dotenv';
import path from 'path';

dontenv.config({ path: path.resolve(__dirname, '../../.env') });

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});
