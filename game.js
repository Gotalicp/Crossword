var words = [];
const size = 15;
const grids = [];
const Rotation = {
    Horizontal: 0,
    Vertical: 1
}

var possibleSize = [];

for (let i = 0; i < size; i++) {
    grids[i] = [];
    for (let j = 0; j < size; j++) {
        var tempId = i + "-" + j
        $("#container").append(`<div style="" id=${tempId} class='grid'></div>`);
        $('#' + tempId).css({ top: i * (900 / size) + 'px', left: j * (900 / size) + 'px' })
        grids[i][j] = {
            char: null
        }
    }
}
$(".grid").width(900 / size);
$(".grid").height(900 / size);

function getRandomFromList() {
    if (possibleSize.length === 0) {
        return null;
    }
    return possibleSize[Math.floor(Math.random() * possibleSize.length)];
}

async function search4Word(x, y, r, temp) {
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
            words.push({
                possition: { x, y, r },
                word: response,
                chars: response.split('')
            })
            placeWord(words[words.length - 1])
        })
        .catch(err => {
            console.log(err)
        })
}
function placeWord(word) {
    var temp = 0;
    console.log(word)
    switch (word.possition.r) {
        case Rotation.Horizontal:
            for (var i = word.possition.y; i < word.possition.y + word.chars.length; i++) {
                grids[word.possition.x][i].char = word.chars[temp++];
                $(`#${word.possition.x}-${i}`).text(grids[word.possition.x][i].char.toUpperCase());
                $(`#${word.possition.x}-${i}`).css("background-color", "white");
            }
            break;
        case Rotation.Vertical:
            for (var i = word.possition.x; i < word.possition.x + word.chars.length; i++) {
                grids[i][word.possition.y].char = word.chars[temp++];
                $(`#${i}-${word.possition.y}`).text(grids[i][word.possition.y].char.toUpperCase());
                $(`#${i}-${word.possition.y}`).css("background-color", "white");
            }
            break;
    }
}

function startAbleX(x, y) {
    var hasCharAbove = y > 0 && grids[x][y - 1].char !== ''
    var hasCharOnLeft = x > 0 && grids[x - 1][y].char !== '' 
    if (hasCharAbove || hasCharOnLeft) {
        return false;
    }
    return true;
}
function startAbleY(x, y) {
    var hasCharAbove = y > 0 && grids[x][y - 1].char !== ''
    var hasCharToLeftOfBelow = y < size - 1 && x > 0 && grids[x - 1][y + 1].char !== ''
    if (hasCharAbove || hasCharToLeftOfBelow) {
        return false
    }
    return true
}
async function checkForSuitable(x, y, r) {
    possibleSize = possibleSize.filter(num => num > 3);
    if (possibleSize.length == 0) {
        return null
    }
    var tempWord = '';
    var size = getRandomFromList()
    switch (r) {
        case Rotation.Horizontal:
            console.log('indexSize' + size)
            for (let i = y; i < y + size; i++) {
                console.log(i)
                if (grids[x][i].char == null) {
                    tempWord += '_'
                } else {
                    tempWord += grids[x][i].char
                }
            }
            console.log(tempWord)
            await search4Word(x, y, r, tempWord)
            break;
        case Rotation.Vertical:
            for (let i = x; i < x + size; i++) {
                if (grids[i][y].char == null) {
                    tempWord += '_'
                } else {
                    tempWord += grids[i][y].char
                }
            }
            console.log(tempWord)
            await search4Word(x, y, r, tempWord)
            break;
    }
}

function generateSize(x, y, r) {
    switch (r) {
        case Rotation.Horizontal:
            if (startAbleX(x, y)) {
                for (let i = x; i < size - x; i++) {
                    var hasCharAbove = !x === 0 && grids[x - 1][y].char !== ''
                    var hasCharOnLeft = !y === 0 && grids[x][y - 1] !== ''
                    if (hasCharAbove && hasCharOnLeft) {
                    } else if (!hasCharAbove && x === 0) {
                        possibleSize.push(-1 * (x - (i + 1)))
                    } else if (!hasCharOnLeft && y === 0) {
                        possibleSize.push(-1 * (x - (i + 1)))
                    } else {
                        possibleSize.push(-1 * (x - (i + 1)))
                    }
                }
            }
            break;
        case Rotation.Vertical:
            if (startAbleY(x, y)) {
                for (let i = y; i < size - y; i++) {
                    var hasCharAbove = !x === 0 && grids[x - 1][y].char !== ''
                    var hasCharOnLeft = !y === 0 && grids[x][y - 1] !== ''
                    if (hasCharAbove && hasCharOnLeft) {
                    } else if (!hasCharAbove && x === 0) {
                        possibleSize.push(-1 * (x - (i + 1)))
                    } else if (!hasCharOnLeft && y === 0) {
                        possibleSize.push(-1 * (x - (i + 1)))
                    } else {
                        possibleSize.push(-1 * (x - (i + 1)))
                    }
                }
            }
            break;
    }
    console.log(`${possibleSize} is possible`)
}

async function generatePuzzle() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            for (let r = 0; r < 2; r++) {
                console.log("x:" + j + " y:" + i + " r:" + r)
                possibleSize = []
                console.log('getting size')
                generateSize(j, i, r)
                console.log('generating word')
                await checkForSuitable(j, i, r)
            }
        }
    }
}
async function button() {
    generatePuzzle();
}