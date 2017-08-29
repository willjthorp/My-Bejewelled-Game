

createGame = function () {

    var board = [];
    var rows = 5;
    var columns = 8;
    var totalScore = 0;
    var moveScore = 0;
    var multiplier = 0;
    var colors = ["red", "yellow", "green", "blue", "purple"];
    var possibleMove = false;
    var movesRemaining = 10;
    var matchMade = false;
    var selectedOrbs = [];
    var counter = 1;

    board = createBoard(board, rows, columns, colors);

    return {
      board: board,
      totalScore: totalScore,
      moveScore: moveScore,
      multiplier: multiplier,
      colors: colors,
      possibleMove: false,
      movesRemaining: 10,
      matchMade: false,
      selectedOrbs: selectedOrbs,

    };


  };

var game = createGame();


function selectOrb(x, y) {
  game.selectedOrbs.push([x, y, game.board[x][y]]);
  if (game.selectedOrbs.length > 1) {
    if (checkIfValidMove(game.selectedOrbs)) {
      game.board = switchOrbs(game.selectedOrbs, game.board);
      processMove();
      processBoard();
      console.log('too fast');
    } else {
      console.log("Not valid move!");
      game.selectedOrbs = [];
    }
  }
  console.log(game.selectedOrbs);
}


function processMove () {
  game.matchMade = false;
  setTimeout(function() {
    $('.onmatch')[0].play();
    game.board = checkMatches(game.board);
    if (game.matchMade) {
      game.multiplier++;
      setTimeout (function () {
        game.board = cascadeOrbs(game.board);
        game.movesRemaining--;
      }, 300);
    } else {
      game.board = switchOrbsBack(game.selectedOrbs, game.board);
      $(".error-box").addClass("fadeInUp");
    }
    game.selectedOrbs = [];
    while (game.matchMade) {
        if (game.counter != 1) {
          game.movesRemaining++;
        }
        console.log(game.counter);
        game.counter++;
        processMove ();
        processBoard ();
    }
    game.counter = 1;
  }, 500);
}





function checkIfPossible(board) {
  for (i=0; i < board.length; i++) {
    for (j=0; j < board[i].length; j++)
      if (game.board[i][j] === null) {
        game.possibleMove = true;
      }
  }
  return game.possibleMove;
}


function checkIfValidMove (selectedOrbs) {
  return ((selectedOrbs[0][0] === selectedOrbs[1][0]) && (selectedOrbs[0][1] === selectedOrbs[1][1] + 1) ||
          (selectedOrbs[0][0] === selectedOrbs[1][0]) && (selectedOrbs[0][1] === selectedOrbs[1][1] - 1) ||
          (selectedOrbs[0][1] === selectedOrbs[1][1]) && (selectedOrbs[0][0] === selectedOrbs[1][0] + 1) ||
          (selectedOrbs[0][1] === selectedOrbs[1][1]) && (selectedOrbs[0][0] === selectedOrbs[1][0] - 1));
}


function checkMatches(board) {
  return flipMatrix(checkForColumnMatches(flipMatrix(checkForRowMatches(board)[0]), flipMatrix(checkForRowMatches(board)[1])));
}

function cascadeOrbs (board) {
    for (i=0; i < board.length; i++) {
      for (j=0; j < board[i].length; j++)
        if (board[i][j] === null) {
          for (a = i; a > 0; a--) {
            board[a][j] = board[a-1][j];
          }
          board[0][j] = getRandomColor(game.colors);
        }
    }
    return board;
}


function createBoard(board, rows, columns, colors) {
  var hasChanged = true;
  for (i = 0; i < rows; i++) {
      board.push([]);
    for (j = 0; j < columns; j++) {
      board[i].push(getRandomColor(colors));
    }
  }
  return flipMatrix(changeRowMatches(flipMatrix(changeRowMatches(board, colors)), colors));
}


function getRandomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}


function changeRowMatches(board, colors, hasChanged) {
  var tempArray = [];
  for (i = 0; i < board.length; i++) {
    for (j = 0; j < board[i].length; j++) {
      if (tempArray.length < 3) {
        tempArray.push(board[i][j]);
      } else {
        tempArray.push(board[i][j]);
        tempArray.shift();
      }
      if (tempArray[0] === tempArray[1] && tempArray[1] === tempArray[2]) {
        swapColor(i, j, colors, tempArray, board);
      }
    }
    tempArray = [];
  }
  return board;
}

function swapColor (i, j, colors, tempArray, board) {
  board[i][j-1] = colors[(colors.indexOf(tempArray[1]) + 2) % 3];
  tempArray[1] = board[i][j-1];
  if (i > 0 && i < board.length - 1 && board[i-1][j-1] === tempArray[1] && board[i+1][j-1] === tempArray[1]) {
    board[i][j-1] = colors[(colors.indexOf(tempArray[1]) + 2) % 3];
    tempArray[1] = board[i][j-1];
  }
  return board;
}

function switchOrbs (selectedOrbs, board) {
  board[selectedOrbs[0][0]][selectedOrbs[0][1]] = selectedOrbs[1][2];
  board[selectedOrbs[1][0]][selectedOrbs[1][1]] = selectedOrbs[0][2];
  return board;
}

function switchOrbsBack(selectedOrbs, board) {
  board[selectedOrbs[0][0]][selectedOrbs[0][1]] = selectedOrbs[0][2];
  board[selectedOrbs[1][0]][selectedOrbs[1][1]] = selectedOrbs[1][2];
  return board;
}

function checkForRowMatches(board) {
  var tempArray = [];
  var nulls = [];
  var originalBoard = jQuery.extend(true, [], board);
  var updatedBoard = [];
  for (i = 0; i < board.length; i++) {
    for (j = 0; j < board[i].length; j++) {
      tempArray.push(board[i][j]);
        if (j > 0 && (tempArray[tempArray.length - 2] !== tempArray[tempArray.length - 1])) {
          if (tempArray.length < 4) {
            tempArray = [tempArray[tempArray.length - 1]];
          } else  {
              console.log('popping and replacing');
              tempArray.pop();
              replaceWithNulls(tempArray, nulls, board);
              game.matchMade = true;
              tempArray = [];
            }
        } else {
           if ((j === board[i].length - 1) && tempArray.length > 2) {
             console.log('replacing');
             replaceWithNullsAtEnd(tempArray, nulls, board);
             game.matchMade = true;
             tempArray = [];
           }
         }

    }
    tempArray = [];
    updatedBoard = board;
  }
  return [originalBoard, updatedBoard];
}


function checkForColumnMatches(originalBoard, updatedBoard) {
  var tempArray = [];
  var nulls = [];
  for (i = 0; i < originalBoard.length; i++) {
    for (j = 0; j < originalBoard[i].length; j++) {
      tempArray.push(originalBoard[i][j]);
        if (j > 0 && (tempArray[tempArray.length - 2] !== tempArray[tempArray.length - 1])) {
          if (tempArray.length < 4) {
            tempArray = [tempArray[tempArray.length - 1]];
          } else  {
              console.log('popping and replacing');
              tempArray.pop();
              replaceWithNulls(tempArray, nulls, updatedBoard);
              game.matchMade = true;
              tempArray = [];
            }
        } else {
           if ((j === originalBoard[i].length - 1) && tempArray.length > 2) {
             console.log('replacing');
             replaceWithNullsAtEnd(tempArray, nulls, updatedBoard);
             game.matchMade = true;
             tempArray = [];
           }
         }

    }
    tempArray = [];
  }
  return updatedBoard;
}


function replaceWithNulls(tempArray, nulls, board) {
  nulls = generateNulls(tempArray);
  console.log("replacing with " + tempArray.length + " nulls");
  board[i].splice((j - tempArray.length), tempArray.length, nulls);
  board[i] = [].concat.apply([], board[i]);
  return board;
}

function replaceWithNullsAtEnd(tempArray, nulls, board) {
  nulls = generateNulls(tempArray);
  console.log("replacing with " + tempArray.length + " nulls");
  board[i].splice((j - tempArray.length + 1), tempArray.length, nulls);
  board[i] = [].concat.apply([], board[i]);
  return board;
}


function generateNulls (tempArray) {
  game.moveScore += tempArray.length;
  return tempArray.map(function(x) {
    return null;
  });
}


function flipMatrix(matrix) {
  return matrix.reduce(function (result1, row, rowIndex) {
    return row.reduce(function (result2, item, columnIndex) {
      if (!result2[columnIndex]) {
        result2[columnIndex] = [];
      }
      result2[columnIndex].push(item);
      return result2;
    }, result1);
  }, []);
}
