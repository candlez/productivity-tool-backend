import mysql, { type Pool } from 'mysql2/promise';

import { environment } from './environment.js';

export const db: Pool = mysql.createPool({
    host: environment.MYSQL_HOST,
    port: environment.MYSQL_PORT,
    user: environment.MYSQL_USERNAME,
    password: environment.MYSQL_PASSWORD,
    database: environment.MYSQL_DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});