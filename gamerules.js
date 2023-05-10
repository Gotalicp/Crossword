//makes the grid and word constructors
// var words = [{
//   firstx : '0',
//   firsty : '0',
//   rotation : '0',
//   sql: '0',
//   size: '0',
//   charArray: '0',
//   clue: '0',
// }];
// function Word(firstx, firsty , rotation, sql){
//   this.firstx = firstx;
//   this.firsty = firsty;
//   this.rotation = rotation;
//   this.sql = sql
//   var charArray
//   var size
//   var clue
// }
function splitArray(sql){
return String(sql).split(' ')
}


function Grid(x, y, used , char){
  this.x = x;
  this.y = y;
  this.used = used;
  this.char = char;
  
}

//creating the arrays and grids
var words = [];
const size = 15;
var grids = new Array(size);
for (let i = 0; i < size; i++) {
  grids[i] = new Array(size).fill('');
  for(let j =0 ;j < size ; j++){
    $("#container").append("<div class='grid'></div>");
    grids[i][j] = new Grid(i,j,false,null)
  }
}
$(".grid").width(900/size);
$(".grid").height(900/size);

function indexWordChecker(){
  let index = -1;
  console.log(words)
  words.forEach(function(){
    index+=1
  })
  return index;
}

function placeWord(index){
  switch(parseInt(words[index].rotation)){
    case 2:
      var temp = 0;
        for(let i = words[index].firstx; i < words[index].firstx + words[index].charArray.length ;i++){
          grids[i][words[index].firsty].char = words[index].charArray[temp++];
          grids[i][words[index].firstx].used = true;

        }
    break;
    case 1:
      var temp = 0;
        for(let i = words[index].firsty; i < words[index].firsty+size ;i++){
          grids[words[index].firstx][i].char = words[index].charArray[temp++];
          grids[words[index].firstx][i].used = true;
        }
    break;
  }
}

function randomNub(max){
  return  Math.floor(Math.random() * max);
}

function checkIfUsed(index , indey){
  try{
    if(grids[index][indey].used == true){
      return false
    }else{
      return true
    }
  }catch(err){
    console.log('out of bounds');
    return true
  }
}

function checkIfPlaceable(index, indey, r){
    switch(r){
      case 1:
        if(checkIfUsed(index - 1,indey)){
        return true;
        }else{return false}
      break;
      case 2:
        if(checkIfUsed(index,indey-1)){
          return true
          }else{return false}
      break;
    }
}

function checkForSuitable(x ,y,r){
  let temp = '';
  switch(r){
    case 1:
    var size = randomNub((15-x)-3)+3;
    for(let i = 0; i <size ; i++){
      if(grids[x+i][y].char == null){
        temp += '_'
      }else{
        temp+= grids[x+i][y].char
      }    
    }
    break;
    case 2:
      var index = randomNub((15-y)-3)+3;
      for(let i = 0; i <size ; i++){
        if(grids[x][y+1].char == null){
          temp += '_'
        }else{
          temp+= grids[x][y+1].char
        }    
      }
    break
  }
  let tempWord = search4Word(temp)
  console.log(tempWord + ' tempword')
  words.push({firstx:x,firsty:y,rotation:r,word:tempWord, charArray:splitArray(tempWord)})
  placeWord(indexWordChecker())
}

async function search4Word(temp){
  const data = {wordScript:temp}
  const res = await fetch(`/word`,{
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
// .then(response => console.log(response))
// .then(data =>{console.log(data)})
}

function makeBlacks(){
  for(let i = 0; i < size; i++){
    for(let j=0;j<size;j++){
      if(grids[i][j].used == false){
        $("grid").css("background-color", "black");
      }
    }
  }
}
function generatePuzzle(){
  for(let i = 0; i < size-2 ; i++){
    for(let j=0;j<size-2;j++){
      for(let r=1;r<2;r++){
        if(checkIfPlaceable(i ,j,r)){
          if(checkForSuitable(i,j,r)!=false){
          }
        }
      }
    }
  }
  makeBlacks();
}
function button(){
generatePuzzle();
}