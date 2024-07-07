import database from "../database/connection.js";

const createTodosTableSQL = ` CREATE TABLE IF NOT EXISTS todos (
    id serial PRIMARY KEY,
    name varchar(255),
    is_complete boolean DEFAULT false,
    created_by integer REFERENCES users(id),
    created_at timestamp DEFAULT NOW()
);`

async function createTodoTable() {
    try {
        await database.query(createTodosTableSQL);
        console.log("Todos table created");
    } catch (err) {
        return console.log(`Error creating table: ${err}`);
    }
}

export default createTodoTable;