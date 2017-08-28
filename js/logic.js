
game = function() {
  var board = [];
  var rows = 5;
  var columns = 8;
  var score = 0;
  var colors = ["red", "yellow", "green", "blue", "purple"];
  var selectedOrbs = [];
  var possibleMove = false;
  var movesRemaining = 10;
  var matchMade = false;
  var rowChecks = [];

  board = createBoard(board, rows, columns, colors);


  return {

        getBoard: function () {
          return board;
        },

        selectOrb: function (x, y) {

          if (selectedOrbs.length < 1) {                        // First Orb selected
            selectedOrbs.push([x, y, board[x][y]]);
            console.log(selectedOrbs);
            return selectedOrbs;

          } else if (selectedOrbs.length < 2) {                         // Second orb selected
              selectedOrbs.push([x, y, board[x][y]]);
                if (selectedOrbs[0][2] === selectedOrbs[1][2]) {              // If color are the same give error
                  console.log('Error - same color!');
                  selectedOrbs = [];
                } else if ((selectedOrbs[0][0] === selectedOrbs[1][0]) && (selectedOrbs[0][1] === selectedOrbs[1][1] + 1) ||
                           (selectedOrbs[0][0] === selectedOrbs[1][0]) && (selectedOrbs[0][1] === selectedOrbs[1][1] - 1) ||
                           (selectedOrbs[0][1] === selectedOrbs[1][1]) && (selectedOrbs[0][0] === selectedOrbs[1][0] + 1) ||
                           (selectedOrbs[0][1] === selectedOrbs[1][1]) && (selectedOrbs[0][0] === selectedOrbs[1][0] - 1)) {          // If valid move....
                   orbs = selectedOrbs;
                   board = switchOrbs(orbs, board);               // Switch orbs position
                   setTimeout(function() {
                     board = checkMatches();                                // Check for matches
                     for (i=0; i < board.length; i++) {
                       for (j=0; j < board[i].length; j++)
                         if (board[i][j] === null) {
                           possibleMove = true;
                         }
                     }
                     if (!possibleMove) {
                       console.log('Error - not valid move!');
                       console.log("switching orbs back");
                       board = switchOrbsBack(orbs, board);
                     } else {
                        setTimeout (function () {
                          board = cascadeOrbs(board);
                          game.movesRemaining--;
                        }, 400);
                     }
                     possibleMove = false;
                   }, 1000);

                } else {
                    console.log('Error - orbs must be adjacent!');                      // Give error if orbs not adjacent
                  }
                game.selectedOrbs = [];
                return selectedOrbs;
            }
        },

        getScore: function() {
          return score;
        },

        selectedOrbs : selectedOrbs,
        colors : colors,
        movesRemaining : movesRemaining,
        possibleMove : possibleMove

      };
};

var game = game();


function checkMatches() {
  return flipMatrix(checkForColumnMatches(flipMatrix(checkForRowMatches(game.getBoard())[0]), flipMatrix(checkForRowMatches(game.getBoard())[1])));
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

function switchOrbsBack(orbs, board) {
  board[orbs[0][0]][orbs[0][1]] = orbs[0][2];
  board[orbs[1][0]][orbs[1][1]] = orbs[1][2];
  return board;
}

function checkForRowMatches(board) {
  var tempArray = [];
  var nulls = [];
  var storedMatches = [];
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
              tempArray = [];
            }
        } else {
           if ((j === board[i].length - 1) && tempArray.length > 2) {
             console.log('replacing');
             replaceWithNullsAtEnd(tempArray, nulls, board);
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
  var reducedArray;
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
              tempArray = [];
            }
        } else {
           if ((j === originalBoard[i].length - 1) && tempArray.length > 2) {
             console.log('replacing');
             replaceWithNullsAtEnd(tempArray, nulls, updatedBoard);
             tempArray = [];
           }
         }

    }
    tempArray = [];
  }
  return updatedBoard;
}


function checkForNulls(element, index, array) {
  console.log("checking temp array for nulls");
  return element != null;
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
  console.log("generating nulls");
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
