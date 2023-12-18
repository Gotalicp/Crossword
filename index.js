const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mysql = require('mysql');

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }))


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'entries'
});

connection.connect((err) => {
  if (err) {
    return console.error(err)
  }
  console.log('Database connected')
})


function randomWord(sql, params) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (error, results) => {
      if (error) {
        reject(error)
      } else {
        if (results.length === 0) {
          console.log('No matching records found.');
          resolve('');
        } else {
          console.log('Matching records:', results);
          const parsedResults = JSON.parse(JSON.stringify(results));
          if (Object.keys(parsedResults).length === 0) {
            console.log('Parsed results are empty.');
            resolve('');
          } else {
            resolve(parsedResults[0].word);
          }
        }
      }
    });
  });
}

app.post('/word', async (req, res) => {
  try {
    const result = await randomWord('SELECT * FROM entries WHERE word LIKE ? ORDER BY RAND() LIMIT 1;', [`${req.body}`]);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.use(express.static(path.join(__dirname, 'views')))

app.get('/', (req, res) => {
  res.sendFile('crossword.html', { root: '.' })
})

app.use(express.static('./'))

app.listen('3000', () => {
  console.log(`Server listening on port ${port}`);
});