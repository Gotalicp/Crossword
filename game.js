var words = [];
const size = 15;
const grids = [];
const Rotation = {
    Horizontal: 0,
    Vertical: 1
}

var possibleSize = [];

for (let x = 0; x < size; x++) {
    grids[x] = [];
    for (let y = 0; y < size; y++) {
        var tempId = x + "-" + y
        $("#container").append(`<div style="" id=${tempId} class='grid'></div>`);
        $('#' + tempId).css({ top: y * (900 / size) + 'px', left: x * (900 / size) + 'px' })
        grids[x][y] = {
            char: null
        }
    }
}
$(".grid").width(900 / size);
$(".grid").height(900 / size);

function getRandomFromList() {
    if (possibleSize.length ===     0) {
        return null;
    }
    return Math.floor(Math.random() * possibleSize.length)
}

async function search4Word(x, y, r, temp) {
    await fetch(`/word`, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: temp
    })
        .then(response => response.text())
        .then((response) => {
            if (response.length === 0 && possibleSize.length !== 0) {
                return false
            } else {
                console.log(response)
                words.push({
                    possition: { x, y, r },
                    word: response,
                    chars: response.split('')
                })
                placeWord(words[words.length - 1])
                return true
            }
        })
        .catch(err => {
            console.log(err)
            return false
        })
}
function placeWord(word) {
    var temp = 0;
    console.log(word)
    switch (word.possition.r) {
        case Rotation.Vertical:
            for (var y = word.possition.y; y < word.possition.y + word.chars.length; y++) {
                grids[word.possition.x][y].char = word.chars[temp++];
                $(`#${word.possition.x}-${y}`).text(grids[word.possition.x][y].char.toUpperCase());
                $(`#${word.possition.x}-${y}`).css("background-color", "white");
            }
            break;
        case Rotation.Horizontal:
            for (var x = word.possition.x; x < word.possition.x + word.chars.length; x++) {
                grids[x][word.possition.y].char = word.chars[temp++];
                $(`#${x}-${word.possition.y}`).text(grids[x][word.possition.y].char.toUpperCase());
                $(`#${x}-${word.possition.y}`).css("background-color", "white");
            }
            break;
    }
}

function startAbleX(x, y) {
    const hasCharAbove = y > 0 && grids[x][y - 1].char !== null
    const hasCharBelow = y < size - 1 && grids[x][y + 1].char !== null
    const hasCharLeft = x > 0 && grids[x - 1][y].char !== null
    const hasCharCurrent = grids[x][y].char !== null
    if (!hasCharLeft && (hasCharCurrent || (!hasCharAbove && !hasCharBelow))) {
        console.log("true")
        return true
    }
    console.log("false")
    return false;
}
function startAbleY(x, y) {
    const hasCharAbove = y > 0 && grids[x][y - 1].char !== null
    const hasCharLeft = x > 0 && grids[x - 1][y].char !== null
    const hasCharRight = x < size - 1 && grids[x + 1][y].char !== null
    const hasCharCurrent = grids[x][y].char !== null
    if (!hasCharAbove && (hasCharCurrent || (!hasCharLeft && !hasCharRight))) {
        console.log("true")
        return true
    }
    console.log("false")
    return false;
}
async function checkForSuitable(x, y, r) {
    if (possibleSize.length == 0) {
        return null
    }
    var tempWord = '';
    var int = getRandomFromList()
    console.log("wordsize:" + possibleSize[int])
    switch (r) {
        case Rotation.Vertical:
            for (let i = y; i < possibleSize[int]; i++) {
                if (grids[x][i].char === null) {
                    tempWord += '_'
                } else {
                    tempWord += grids[x][i].char
                }
            }
            break;
        case Rotation.Horizontal:
            for (let i = x; i < x + possibleSize[int]; i++) {
                if (grids[i][y].char == null) {
                    tempWord += '_'
                } else {
                    tempWord += grids[i][y].char
                }
            }
            break;
    }
    possibleSize.splice(int, 1)
    if (await search4Word(x, y, r, tempWord) === false) {
        await checkForSuitable(x, y, r)
    }
}

async function generateSize(x, y, r) {
    var hasCharAbove
    var hasCharBelow
    var hasCharOnCurrent
    var hasCharLeft
    var hasCharRight
    switch (r) {
        case Rotation.Horizontal:
            if (startAbleX(x, y)) {
                for (let i = x + 1; i < size - x; i++) {
                    hasCharAbove = y > 0 && grids[i][y - 1].char !== null
                    hasCharOnCurrent = grids[i][y].char !== null
                    hasCharLeft = i > 0 && grids[i - 1][y].char !== null
                    hasCharRight = i < size - 1 && grids[i + 1][y].char !== null
                    if (hasCharOnCurrent) {
                        possibleSize.push(-1 * (x - (i + 1)))
                    } else if (hasCharAbove) {
                        break
                    } else if (!hasCharLeft == !hasCharRight) {
                        possibleSize.push(-1 * (x - (i + 1)))
                    } else {
                        continue
                    }
                }
            }
            break
        case Rotation.Vertical:
            if (startAbleY(x, y)) {
                for (let i = (y + 1); i < size - y; i++) {
                    hasCharAbove = i > 0 && grids[x][i - 1].char !== null
                    hasCharBelow = i < size - 1 && grids[x][i + 1].char !== null
                    hasCharLeft = x > 0 && grids[x - 1][i].char !== null
                    hasCharOnCurrent = grids[x][i].char !== null
                    if (hasCharOnCurrent) {
                        possibleSize.push(-1 * (y - (i + 1)))
                    } else if (hasCharLeft) {
                        break
                    } else if (!hasCharAbove == !hasCharBelow) {
                        possibleSize.push(-1 * (y - (i + 1)))
                    } else {
                        continue
                    }
                }
            }
            break
    }
    possibleSize = possibleSize.filter(num => num >= 3 && num <= 10);
    return (possibleSize.length > 0)
}

async function generatePuzzle() {
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            for (let r = 0; r < 2; r++) {
                console.log("x:" + x + " y:" + y + " r:" + r)
                possibleSize = []
                console.log('getting size')
                if (await generateSize(x, y, r)) {
                    console.log(`${possibleSize} is possible`)
                    console.log('generating word')
                    await checkForSuitable(x, y, r)
                }
            }
        }
    }
}
async function button() {
    generatePuzzle();
}