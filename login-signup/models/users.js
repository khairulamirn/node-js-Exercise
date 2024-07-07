import database from "../database/connection.js";

const query = `CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY, 
    username varchar(255) UNIQUE,
    email varchar(255) UNIQUE,
    password varchar(255),
    created_at timestamp DEFAULT NOW()
);`


async function createTableUsers() {
    try { 
        await database.query(query);
        console.log("Users table created");
    } catch (err) {
        return console.log(`Error creating table: ${err}`);
    }
}

export default createTableUsers;