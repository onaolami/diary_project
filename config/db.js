const mysql = require('mysql2');

 const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'diary_db',
    password:'password'
 });

module.exports = connection;