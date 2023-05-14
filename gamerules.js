function splitArray(sql){
  return String(sql).split(' ')
  }
  
  
  //creating the arrays and grids
  var words = [];
  const size = 15;
  const grids = [];
  for (let i = 0; i < size; i++) {
    grids[i] = [];
    for(let j =0 ;j < size ; j++){
      var tempId = i+""+j
      $("#container").append(`<div id=${tempId} class='grid'></div>`);
      grids[i][j] = {
        row: i,
        col: j,
        used: false,
        char: null
      };
    }
  }
  $(".grid").width(900/size);
  $(".grid").height(900/size);
  
  function indexWordChecker(){
    let index = -1;
    words.forEach(function(){
      index+=1
    })
    return index;
  }
  
  async function placeWord(index){
    switch(words[index].rotation){
      case 1:
        var temp = 0;
          for(let i = words[index].firsty; i < words[index].firsty + words[index].charArray.length ;i++){
            grids[words[index].firstx][i].char = words[index].charArray[temp++];
            grids[words[index].firstx][i].used = true;
            var idTemp = '#'+i+''+words[index].firsty
            $(idTemp).html("<p>"+grids[words[index].firstx][i].char + "</p>");
  
          }
      break;
      case 2:
        var temp = 0;
          for(let i = words[index].firstx; i < words[index].firstx + words[index].charArray.length ;i++){
            grids[i][words[index].firsty].char = words[index].charArray[temp++];
            grids[i][words[index].firsty].used = true;
            var idTemp = '#'+words[index].firstx+''+i
            $(idTemp).html('<p> ${grids[i][words[index].firsty].char} </p>');

          }
      break;
    }
  }
  
  function randomNub(max){
    return  Math.floor(Math.random() * max);
  }
  
  function checkIfUsed(index , indey){
    try{
      if(grids[index][indey].used==true){
        return false
      }else{
        return true
      }
    }catch(err){
      console.log(err);
      return true
    }
  }
  
  function checkIfPlaceable(index, indey, r){
      switch(r){
        case 1:
          if(checkIfUsed(index -1 ,indey)==true && checkIfUsed(index,indey-1)==true){
          return true;
          }else{return false}
        break;
        case 2:
          if(checkIfUsed(index-1,indey) == true && checkIfUsed(index +1 ,indey)==true && checkIfUsed(index,indey-1)==true){
            return true
            }else{return false}
        break;
      }
  }
  
 async function checkForSuitable(x ,y,r){
    let temp ='';
    let values
    switch(r){
      case 1:
      var size = randomNub((15-y)-3)+3;
      for(let i = 0; i <size ; i++){
        console.log(i)
        if(grids[x][y+i].char == null){
          temp += '_'
        }else{
          temp+= grids[x][y+i].char
        }    
      }
      break;
      case 2:
        var index = randomNub((15-x)-3)+3;
        for(let i = 0; i <size ; i++){
          if(grids[x+i][y].char == null){
            temp += '_'
          }else{
            temp+= grids[x+i][y].char
          }    
        }
      break
    }
    values = await search4Word(temp)
    console.log(values + ':values')
    words.push({firstx:x,firsty:y,rotation:r,word:values, charArray:values.split('')})
    await placeWord(indexWordChecker())
  }
  
  async function search4Word(temp){
      const theWord = await fetch(`/word`,{
        method: 'POST',
        headers: {
        'Content-Type': 'text/plain'},
        body: temp
      })
      return theWord.json();
  }

  async function postTest(){
    const temp = 'word'
      const theWordo = await fetch(`/test`,{
        method: 'POST',
        headers: {
        'Content-Type': 'text/plain'},
        body: temp
      })
      console.log("theWordo")
     console.log(theWordo)
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

  async function generatePuzzle(){
    for(let i = 0; i < size ; i++){
      for(let j=0;j<size;j++){
        for(let r=1;r<2;r++){
          if(checkIfPlaceable(i ,j,r)==true){
            await checkForSuitable(i,j,r)
            console.log(words)
          }
        }
      }
    }
    makeBlacks();
  }
  async function button(){
    generatePuzzle();
    // let tempWord = [{}]
    // tempWord = await search4Word()
    // console.log("tempWord") 
    // console.log(tempWord)
   } 