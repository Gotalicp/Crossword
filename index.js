const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'Gotalic',
  password: 'password',
  database: 'entries'
});

// connection.connect(function(err){
// connection.query('SELECT word FROM entries WHERE CHAR_LENGTH(word) > 3 ORDER BY RAND() LIMIT 1', (error, results) => {
//       console.log(results);
//     });
//     connection.query('SELECT *', (error, results, fields) => {
//         console.log(results);
//       });/
// });

function randomword(temp) {
  let sql = 'SELECT word FROM entries WHERE word like '+temp+' ORDER BY RAND() LIMIT 1;';
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(result);
      }
    });
  });
}

app.get('/kur/:word', async (req, res) => {
  // const word = await randomword();
  console.log(req.params.word)
  res.send("8===>");
})

// app.get("/", async function(req, res) {
//   const result = await randomword();
//   res.send(result);
//   console.log(randomword());
// });

app.use(express.static(path.join(__dirname,'views')))

app.get('/', (req, res) => {
    res.sendFile('crossword.html', {root : '.'})
})

app.use(express.static('./'))

app.listen('3000', () => {
    console.log(`Server listening on port ${port}`);
});