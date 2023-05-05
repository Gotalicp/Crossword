//connects sql to js
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'englsihdictionary'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

//makes the grid and word arrays
const words = new Array();
const size = 15;
const grid = new Array(size);
for (let i = 0; i < size; i++) {
  grid[i] = new Array(size).fill('');
}

//places the words in place
function placeWord(word, x, y, dx, dy) {
  for (let i = 0; i < word.length; i++) {
    const ix = x + i * dx;
    const iy = y + i * dy;
    grid[iy][ix] = word[i];
  }
}

//getting and placing the first word in the middle
connection.query('SELECT word FROM entries ;WHERE CHAR_LENGTH(word) > 3 ;ORDER BY RAND(); LIMIT 1', (error, results, fields) => {
  if (error) throw error;
  words[0] = results;
});
const startX = Math.floor(size / 2 - words[0].length / 2);
const startY = Math.floor(size / 2);
if (Math.random() < 0.5) {
  placeWord(words[0], startX, startY, 1, 0);
} else {
  placeWord(words[0], startX, startY, 0, 1);
}