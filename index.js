const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  database: 'entries'
});

connection.connect(function(err){
connection.query('SELECT word FROM entries WHERE CHAR_LENGTH(word) > 3 ORDER BY RAND() LIMIT 1', (error, results, fields) => {
      console.log(results);
    });
    connection.query('SELECT *', (error, results, fields) => {
        console.log(results);
      });
});

app.use(express.static(path.join(__dirname,'views')))

app.get('/', (req, res) => {
    res.sendFile('crossword.html', {root : '.'})
})

app.use(express.static('./  '))

app.listen('3000', () => {
    console.log(`Server listening on port ${port}`);
});