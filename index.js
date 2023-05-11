const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mysql = require('mysql');
var bodyParser = require('body-parser')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'entries'
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.post('/word', async (req, res) => {
  try {
    var temp = Object.values(req.body)
    console.log(temp + ' temp')
    const query = 'SELECT * FROM entries WHERE word LIKE\'_____\' ORDER BY RAND() LIMIT 1;'
    const result  =  randomWord(query);
  } catch (err) {
    console.error(err);
  }
});

function randomWord(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err);
      }
      else {
        console.log(result)
        resolve(result);
      }
    });
  });
}

app.use(express.static(path.join(__dirname,'views')))

app.get('/', (req, res) => {
    res.sendFile('crossword.html', {root : '.'})
})

app.use(express.static('./'))

app.listen('3000', () => {
    console.log(`Server listening on port ${port}`);
});