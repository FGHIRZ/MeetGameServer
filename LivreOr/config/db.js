let mysql = require('mysql');

let connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    port     : 3306,
    password : '1234',
    database : 'my_schema'
});

connection.connect();

module.exports = connection