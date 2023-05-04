const size = 15;
const grid = new Array(size);
for (let i = 0; i < size; i++) {
  grid[i] = new Array(size).fill('');
}

function placeWord(word, x, y, dx, dy) {
  for (let i = 0; i < word.length; i++) {
    const ix = x + i * dx;
    const iy = y + i * dy;
    grid[iy][ix] = word[i];
  }
}

const firstWord = words[0];
const startX = Math.floor(size / 2 - firstWord.length / 2);
const startY = Math.floor(size / 2);
if (Math.random() < 0.5) {
  placeWord(firstWord, startX, startY, 1, 0);
} else {
  placeWord(firstWord, startX, startY, 0, 1);
}

for (let i = 1; i < words.length; i++) {
  const word = words[i];
  const positions = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          if (x + dx * (word.length - 1) < 0 ||
              x + dx * (word.length - 1) >= size ||
              y + dy * (word.length - 1) < 0 ||
              y + dy * (word.length - 1) >= size) continue;
          let fits = true;
          for (let j = 0; j < word.length; j++) {
            const ix = x + j * dx;
            const iy = y + j * dy;
            if (grid[iy][ix] !== '' && grid[iy][ix] !== word[j]) {
              fits = false;
              break;
            }
          }
          if (fits) {
            positions.push({ x, y, dx, dy });
          }
        }
      }
    }
  }
  if (positions.length > 0) {
    const { x, y, dx, dy } = positions[Math.floor(Math.random() * positions.length)];
    placeWord(word, x, y, dx, dy);
  }
}
