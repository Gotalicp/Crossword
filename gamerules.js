//makes the grid and word constructors
function Word(firstx, firsty , rotation){
  this.firstx = firstx;
  this.firsty = firsty;
  this.rotation = rotation;
  this.char = word;
  charArray = word.split('')
  this.size = charArray.lenght
  this.clue = clue
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

function placeWord(index){
  switch(words[index].rotation){
    case 1:
      var temp = 0;
        for(let i = words[index].firstx; i < words[index].firstx+size ;i++){
          grids[i][firsty].char = charArray[temp++];
          grids[firstx][i].used = true;

        }
    break;
    case 2:
      var temp = 0;
        for(let i = words[index].firsty; i < words[index].firsty+size ;i++){
          grids[firstx][i].char = charArray[temp++];
          grids[firstx][i].used = true;
        }
    break;
  }
}

function randomNub(max){
  return  Math.floor(Math.random() * max);
}

function checkIfUsed(index , indey){
  try{
    if(grid[index][indey].used == true){
      return false
    }else{
      return true
    }
  }catch(err){
    console.log('out of bounds');
    return true
  }
}

function checkIfPlaceable(r,index, indey){
    switch(r){
      case 1:
        if(checkIfPlaceable(index - 1,indey) == true && checkIfPlaceable(index,indey - 1) == true && checkIfPlaceable(index,indey + 1) == true ){
        return true;
        }else{return false}
      break;
      case 2:
        if(checkIfPlaceable(index - 1,indey) == true && checkIfPlaceable(index,indey - 1) == true && checkIfPlaceable(index+1,indey) == true ){
          return true
          }else{return false}
      break;
    }
}

function checkForSuitable(x ,y,r){
  let temp = '';
  switch(r){
    case 1:
    var index = randomSize((15-x)-3)+3;
    for(let i = 0; i <index ; i++){
      if(grid[x+i][y].char == null){
        temp += '_'
      }else{
        temp+= grid[x+i][y].char
      }    
    }
    break;
    case 2:
      var index = randomSize((15-y)-3)+3;
      for(let i = 0; i <index ; i++){
        if(grid[x][y+1].char == null){
          temp += '_'
        }else{
          temp+= grid[x][y+1].char
        }    
      }
    break
  }
  // if(==){
  //   return false;
  // }
  words.push(Word(x,y,r,sql))
}

function generatePuzzle(){
  for(let i = 0; i < size ; i++){
    for(let j=0;j<size;j++){
      for(let r=1;r<2;r++){
        if(checkIfPlaceable(r, x ,y)){
          if(checkForSuitable(i,j,r)!=false){

          }
        }
      }
    }
  }
}

async function button() {
  const res = await fetch(`/kur/duma`);
  console.log(await res.text())
}