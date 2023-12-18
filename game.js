var words = [];
const size = 15;
const grids = [];
const Rotation = {
    Horizontal: 0,
    Vertical: 1
}
var possibleSize = [];
init()

function getRandomFromList(numberList) {
    if (numberList.length === 0) {
        return null;
    }
  return numberList[Math.floor(Math.random() * numberList.length)];
}

function init(){
    for (let i = 0; i < size; i++) {
        grids[i] = [];
        for (let j = 0; j < size; j++) {
            var tempId = i + "-" + j
            $("#container").append(`<div style="" id=${tempId} class='grid'></div>`);
            $('#'+tempId).css({top:i*(900/size)+'px',left:j*(900/size)+'px'})
            grids[i][j] = {
              char: null
            }
        }
    }
    $(".grid").width(900 / size);
    $(".grid").height(900 / size);
}


async function getWord(x,y,r,req) {
    try{
        var temp = await search4Word(req)
        words.push({
            position:{x,y,r},
            word:temp,
            chars:temp.split('')
        })
        await placeWord(indexWordChecker())
        return temp
    }catch(err){
    console.log(err)
    }
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
async function placeWord() {
    var temp = 0;
    word = words[lastIndexOf(words)]
    switch (word.Rotation) {
        case Rotation.Vertical:
            for (let i = word.position.y; i < word.position.y + word.charArray.length; i++) {
                grids[word.position.x][i].char = word.charArray[temp++];
                var idTemp = '#' + word.position.x + '-' + i
                $(idTemp).text(grids[word.position.x][i].char.toUpperCase());
                $(idTemp).css("background-color", "white");
            }
        break;
        case Rotation.Horizontal:
            for (let i = word.position.x; i < word.position.x + word.charArray.length; i++) {
                grids[i][word.possition.y].char = word.charArray[temp++];
                var idTemp = '#' + i + '-' + word.possition.y
                $(idTemp).text(grids[i][word.position.y].char.toUpperCase());
                $(idTemp).css("background-color", "white");
            }
        break;
    }
}

function startAbleX(x,y){
    try {
        if(grids[x-1][y].char!=null && grids[x+1][y-1].char!=null){
            return true 
        }
    }catch{
        console.log("out of bounds")
        return true    
    }
    return false
}
function startAbleY(x,y){
    try {
        if(grids[x][y-1].char!=null && grids[x-1][1+y].char!=null){
            return true
        }
    }catch{
        console.log("out of bounds")
        return true
    }
    return false
}
async function checkForSuitable(x, y, r) {
    possibleSize = possibleSize.filter(num => num > 3);
    if(possibleSize.length == 0){ 
        return null
    }
    let temp = '';
    var size = getRandomFromList()
    switch (r) {
        case Rotation.Horizontal:
            console.log('indexSize'+size)
            for (let i = y; i < y+size; i++) {
              console.log(i)
                if (grids[x][i].char == null) {
                    temp += '_'
                } else {
                    temp += grids[x][i].char
                }
            }
            console.log(temp)
            console.log(await getWord(x,y,r,temp))
            break;
        case Rotation.Vertical:
            for (let i = x; i < x + size; i++) {
                if (grids[i][y].char == null) {
                    temp += '_'
                } else {
                    temp += grids[i][y].char
                }
            }
            console.log(temp)
            console.log (await getWord(x,y,r,temp))
            break;
    }
}

function generateSize(x,y,r){
    switch(r){
        case Rotation.Horizontal:
            if(startAbleX(x,y)==true){
                for(let i = x; i < size-x; i ++){
                    if(grids[i][y-1].char!=null && grids[i+1][y].char!=null){
                        possibleSize.push(-1*(x-(i+1)))
                    }
                }
            }
        break;
        case Rotation.Vertical:
            if(startAbleY(x,y)==true){
                for(let i = y; i < size-y; i ++){
                    if(grids[i][y-1].char!=null && grids[i+1][y].char!=null){
                        possibleSize.push(-1*(x-(i+1)))
                    }
                }
            }
        break;
    }
}

async function generatePuzzle() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            for (let r = 0; r < 2; r++) {
                possibleSize=null
                generateSize()
                placeWord()
            }
        }
    }
}
async function button() {
    generatePuzzle();
}