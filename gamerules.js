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
    var temp=0;
    switch(words[index].rotation){
      case 0:
          for(let i = words[index].firsty; i < words[index].firsty + words[index].charArray.length ;i++){
            grids[words[index].firstx][i].char = words[index].charArray[temp++];
            grids[words[index].firstx][i].used = true;
            var idTemp = '#'+words[index].firstx+''+i
            $(idTemp).html("<p>"+grids[words[index].firstx][i].char + "</p>");
            $(idTemp).css("background-color", "white");
  
          }
      break;
      case 1:
          for(let i = words[index].firstx; i < words[index].firstx + words[index].charArray.length ;i++){
            grids[i][words[index].firsty].char = words[index].charArray[temp++];
            grids[i][words[index].firsty].used = true;
            var idTemp = '#'+i+''+words[index].firsty
            $(idTemp).html("<p>" +grids[i][words[index].firsty].char + "</p>");
            $(idTemp).css("background-color", "white");

          }
      break;
    }
  }
  
  function randomNub(max){
  return Math.floor(Math.random() * (max - 2)) + 3;
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

  function checkIfSameUsed0(index , indey){
    try{
      if(grids[index][indey].used==false && grids[index][index-1].used==true){
        return false
      }else{
        return true
      }
    }catch(err){
      console.log(err);
      return true
    }
  }

  function checkIfSameUsed1(index , indey){
    try{
      if(grids[index][indey].used==false && grids[index-1][index].used==true){
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
      case 0:
        if(indey < size - 2){
          if(checkIfUsed(index, indey-1)==true && checkIfUsed(index-1, indey+1)==true && checkIfSameUsed0(index,indey)==true){
            return true;
            }else{console.log('false');return false}
        }console.log('false');return false
      break;
      case 1:
        if(index < size - 2){
        if(checkIfUsed(index -1 ,indey)==true && checkIfUsed(index+1, indey-1)==true && checkIfSameUsed1(index,indey)==true){
          return true;
          }else{console.log('false');return false}
        }console.log('false');return false
      break;  
    }
  }
  
 async function checkForSuitable(x ,y,r){
    let temp ='';
    let values
    switch(r){
      case 0:
        var indexSize = randomNub(15-y);
      for(let i = 0; i <indexSize ; i++){
        if(grids[x][y+i].char == null){
          temp += '_'
        }else{
          temp+= grids[x][y+i].char
        }    
      }
      console.log(temp)
      break;
      case 1:
        var indexSize = randomNub(15-x);
        for(let i = 0; i <indexSize ; i++){
          if(grids[x+i][y].char == null){
            temp += '_'
          }else{
            temp+= grids[x+i][y].char
          }     
        }
        console.log(temp)
      break;
    }
    values = await search4Word(temp)
    if(values!=null){
        words.push({firstx:x,firsty:y,rotation:r,word:values, charArray:values.split('')})
        await placeWord(indexWordChecker())
    }
  }

  async function search4Word(temp){
    try{
      const theWord = await fetch(`/word`,{
        method: 'POST',
        headers: {
        'Content-Type': 'text/plain'},
        body: temp
      })
      return theWord.json();
    }catch(err){
      console.log(err)
      return null
    }
  }

  async function generatePuzzle(){
    console.log(words)
    for(let i = 0; i < size; i++){
      for(let j = 0; j < size; j++){
        for(let r = 0 ; r < 2; r++){
          console.log(i,j,r)
          if(checkIfPlaceable(i, j, r)==true){
            await checkForSuitable(i, j, r)
          }
        }
      }
    }
  }
  async function button(){
    generatePuzzle();
   } 