import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.NAME,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    // ssl : true // enable this for production 
});

export default pool;