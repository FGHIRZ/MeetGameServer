let mysql = require('mysql');

// let connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     port     : 3306,
//     password : '1234',
//     database : 'my_schema'
// });

let connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    port     : 3306,
    password : 'MeetGame69!',
    database : 'db'
});

connection.connect();

module.exports = connection