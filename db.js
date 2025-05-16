import mysql from 'mysql2/promise';

export const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});