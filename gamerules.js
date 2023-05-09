//makes the grid and word constructors
function Word(firstx, firsty , rotation, word, clue){
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
const words = new Array();
const size = 15;
const grids = new Array(size);
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
        }
    break;
    case 2:
      var temp = 0;
        for(let i = words[index].firsty; i < words[index].firsty+size ;i++){
          grids[firstx][i].char = charArray[temp++];
        }
    break;
  }
}
function randomRotation(){
  return Math.random() + 1;
}
function randomSize(){
  return  Math.floor(Math.random() * 13) + 3;
}
function placeFirst(){
words[0].firstx=0;
words[0].firsty=0;
words[0].rotation = 1;

}