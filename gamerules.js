var words = [];
const size = 15;
const grids = [];
for (let i = 0; i < size; i++) {
  grids[i] = [];
  for (let j = 0; j < size; j++) {
      var tempId = i + "-" + j
      $("#container").append(`<div style="" id=${tempId} class='grid'></div>`);
      $('#'+tempId).css({top:i*(900/size)+'px',left:j*(900/size)+'px'})
      grids[i][j] = {
          row: i,
          col: j,
          usedX: false,
          usedY: false,
          char: null
      };
  }
}
$(".grid").width(900 / size);
$(".grid").height(900 / size);

function indexWordChecker() {
  let index = -1;
  words.forEach(function() {
      index += 1
  })
  return index;
}

async function placeWord(index) {
  var temp = 0;
  switch (words[index].rotation) {
      case 0:
          for (let i = words[index].firsty; i < words[index].firsty + words[index].charArray.length; i++) {
              grids[words[index].firstx][i].char = words[index].charArray[temp++];
              grids[words[index].firstx][i].usedX = true;
              grids[words[index].firstx+1][i].usedX = true;
              var idTemp = '#' + words[index].firstx + '-' + i
              $(idTemp).text(grids[words[index].firstx][i].char.toUpperCase());
              $(idTemp).css("background-color", "white");
          }
          grids[words[index].firstx][words[index].firsty].usedX = false;
          grids[words[index].firstx][words[index].firsty+ words[index].charArray.length].usedX = false;
          break;
      case 1:
          for (let i = words[index].firstx; i < words[index].firstx + words[index].charArray.length; i++) {
              grids[i][words[index].firsty].char = words[index].charArray[temp++];
              grids[i][words[index].firsty].usedY = true;
              grids[i][words[index].firsty+1].usedY = true;
              var idTemp = '#' + i + '-' + words[index].firsty
              $(idTemp).text(grids[i][words[index].firsty].char.toUpperCase());
              $(idTemp).css("background-color", "white");
          }
          grids[words[index].firstx][words[index].firsty].usedY = false;
          grids[words[index].firstx+ words[index].charArray.length][words[index].firsty].usedY = false;
          break;
  }
}

function randomNub(max) {
  return Math.floor(Math.random() * (max - 2)) + 3;
}

function checkIfUsed(index, indey, r) {
  switch (r) {
      case 0:
          try {
              if (grids[index][indey].usedX == true) {
                  return false
              } else {
                  return true
              }
          } catch (err) {
              console.log(err);
              return true
          }
          break;
      case 1:
          try {
              if (grids[index][indey].usedY == true) {
                  return false
              } else {
                  return true
              }
          } catch (err) {
              console.log(err);
              return true
          }
          break;
  }
}


function checkIfPlaceable(index, indey, r) {
  switch (r) {
      case 0:
          if (indey < size - 2) {
              if (checkIfUsed(index, indey, r) == true) {
                  return true;
              } else {
                  return false
              }
          }
          return false
          break;
      case 1:
          if (index < size - 2) {
              if (checkIfUsed(index, indey, r) == true) {
                  return true;
              } else {
                  return false
              }
          }
          return false
          break;
  }
}

function checkForSuitableLength(x, y, r) {
  var index = 0;
  console.log(x+'x' + y+'y')
  switch (r) {
      case 0:
               for (let i = y; i < size - y; i++) {
                if(grids[x][i].usedX==false){
                  index++
                }else{
                  console.log(index)
                  return index
                }
              }
          break
      case 1:
          for (let i = x; i < size - x; i++) {
              if(grids[i][y].usedY==false){
              index++
          }else{
            console.log(index)
            return index}
          }
      break
  }
  console.log('no found used')
  console.log('returning'+index)
  return index;
}

async function checkForSuitable(x, y, r) {
  let temp = '';
  let TempWord
  switch (r) {
      case 0:
          var indexSize = randomNub(checkForSuitableLength(x, y, r));
          for (let i = y; i < y+indexSize; i++) {
            console.log(i)
              if (grids[x][i].char == null) {
                  temp += '_'
              } else {
                  temp += grids[x][i].char
              }
          }
          console.log(temp)
          break;
      case 1:
          var indexSize = randomNub(checkForSuitableLength(x, y, r));
          for (let i = x; i < x +indexSize; i++) {
              if (grids[i][y].char == null) {
                  temp += '_'
              } else {
                  temp += grids[i][y].char
              }
          }
          console.log(temp)
          break;
  }
 console.log (await getWord(x,y,r,temp))
}

async function getWord(x,y,r,temp) {
  var TempWord = await search4Word(temp)
  
  words.push({
      firstx: x,
      firsty: y,
      rotation: r,
      word:TempWord,
      charArray: TempWord.split('')
  })
  await placeWord(indexWordChecker())
  return TempWord
}

async function search4Word(temp) {
  var returnWord;
      const theWord = await fetch(`/word`, {
          method: 'POST',
          headers: {
              'Content-Type': 'text/plain'
          },
          body: temp
      })
      .then(response => response.text())
      .then((response) => {
          console.log(response)
          returnWord=response
      })
      .catch(err => {
        console.log(err)
        return null
      })
      return returnWord;
}

async function generatePuzzle() {
  console.log(words)
  for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
          for (let r = 0; r < 2; r++) {
              console.log(i, j, r)
              if (checkIfPlaceable(i, j, r) == true) {
                  await checkForSuitable(i, j, r)
              }
          }
      }
  }
}
async function button() {
  generatePuzzle();
}