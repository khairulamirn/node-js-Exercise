import pg from 'pg';
import createTableUser from '../models/user.js';
import createTableTodo from '../models/todo.js';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const database = new Pool({
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

async function testConnectionAndLog() {
    try {
        await database.connect(); // connect to database
        const queryTime = await database.query('SELECT NOW()');
        const databaseName = await database.query('SELECT current_database()');
        const currentTime = queryTime.rows[0].now;
        const currentDatabase = databaseName.rows[0].current_database;
        console.log(`Connected to ${currentDatabase} at ${currentTime}`);
        await createTableUser();
        await createTableTodo();
    } catch (err) {
        console.error("Error connecting to database: ", err);
    }
}

testConnectionAndLog();

export default database;