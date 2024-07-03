const path = require('path');
require('dotenv').config({
    override: true,
    path: path.resolve(__dirname, 'development.env')
});
const {Pool, Client} = require('pg');

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.NAME,
    password: process.env.PASSWORD,
    port: process.env.PORT
});


//  using client
(async () => {
    const client = await pool.connect (); 
    try {
        const {rows} = await client.query('SELECT current_user');
        const currentUser = rows[0]['current_user']
        console.log(currentUser);
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
    }
}) ();


// using pool 
/*(async () => {
    try {
        const {rows} = await pool.query('SELECT current_user');
        const currentUser = rows[0]['current_user']
        console.log(currentUser);
    } catch (err) {
        console.error(err);
    }
}) ();
*/