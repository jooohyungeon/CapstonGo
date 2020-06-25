var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '203.233.111.5',
    port: 3306,
    user: 'aham',
    password: '1234',
    database: 'abf'
});

module.exports = connection;