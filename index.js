const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mysql = require('mysql');
var bodyParser = require('body-parser');
const { re } = require('mathjs');
var router = express.Router()

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }))


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'entries'
});

connection.connect((err) => {
  if (err) {
    return console.error(err)
  }
  console.log('Database connected')
})


function randomWord(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      var json =  JSON.parse(JSON.stringify(results));
      console.log(results)
      console.log(json[0].word)
      resolve(json[0].word);
    })
  })
}

app.post('/word', async (req, res) => {
  return new Promise((resolve, reject) => {
    var temp = req.body
    const query = 'SELECT * FROM entries WHERE word LIKE \''+temp+'\' ORDER BY RAND() LIMIT 1;'
    randomWord(query).then((results)=>{
    res.send(results)
    resolve(results)
  });
});
})

app.use(express.static(path.join(__dirname,'views')))

app.get('/', (req, res) => {
    res.sendFile('crossword.html', {root : '.'})
})

app.use(express.static('./'))

app.listen('3000', () => {
    console.log(`Server listening on port ${port}`);
});