
game = function() {
  var board = [];
  var rows = 5;
  var columns = 8;
  var score = 0;
  var colors = ["red", "yellow", "green", "blue", "purple"];
  var selectedOrbs = [];
  var possibleMove = false;
  var movesRemaining = 10;

  board = createBoard(board, rows, columns, colors);

  return {

        getBoard: function () {
          return board;
        },

        selectOrb: function (x, y) {
          if (selectedOrbs.length < 1) {
            selectedOrbs.push([x, y, board[x][y]]);
            return selectedOrbs;
          } else if (selectedOrbs.length < 2) {
              selectedOrbs.push([x, y, board[x][y]]);
              console.log(selectedOrbs);
                if (selectedOrbs[0][2] === selectedOrbs[1][2]) {
                  console.log('Error - same color!');
                } else if ((selectedOrbs[0][0] === selectedOrbs[1][0]) && (selectedOrbs[0][1] === selectedOrbs[1][1] + 1) ||
                           (selectedOrbs[0][0] === selectedOrbs[1][0]) && (selectedOrbs[0][1] === selectedOrbs[1][1] - 1) ||
                           (selectedOrbs[0][1] === selectedOrbs[1][1]) && (selectedOrbs[0][0] === selectedOrbs[0][1] + 1) ||
                           (selectedOrbs[0][1] === selectedOrbs[1][1]) && (selectedOrbs[0][0] === selectedOrbs[0][1] - 1)) {
                   board = switchOrbs(selectedOrbs, board);
                   console.log("switching orbs");
                   board = flipMatrix(checkForRowMatches(flipMatrix(checkForRowMatches(board))));
                   for (i=0; i < board.length; i++) {
                     for (j=0; j < board[i].length; j++)
                       if (board[i][j] === null) {
                         possibleMove = true;
                         cascadeOrbs(i, j, board);
                         // changeBoardColors();
                       }
                   }
                   if (!possibleMove) {
                     $(".orb-container").css("pointer-events", "none");
                     orbs = selectedOrbs;
                     setTimeout (function() {
                       board = switchOrbsBack(orbs, board);
                       console.log('Error - not valid move!');
                       console.log("switching orbs back");
                       $(".orb-container").css("pointer-events", "auto");
                       changeBoardColors();
                     }, 900);
                   }
                   possiblemove = false;
                } else {
                    console.log('Error - orbs must be adjacent!');
                  }
                selectedOrbs = [];
                return selectedOrbs;
            }
        },




        getScore: function() {
          return score;
        },

        selectedOrbs : selectedOrbs

      };
};

var game = game();



function cascadeOrbs (i, j, board) {
  // setTimeout(function(i, j) {
    board[i][j] = board[i-1][j];
    board[i-1][j] = null;
    return board;
  // }, 100);
}




function createBoard(board, rows, columns, colors) {
  var hasChanged = true;
  for (i = 0; i < rows; i++) {
      board.push([]);
    for (j = 0; j < columns; j++) {
      board[i].push(getRandomColor(colors));
    }
  }
  flipMatrix(changeRowMatches(flipMatrix(changeRowMatches(board, colors)), colors));
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
  for (i = 0; i < board.length; i++) {
    for (j = 0; j < board[i].length; j++) {
      tempArray.push(board[i][j]);
      // console.log(tempArray);
      if (j > 0 && tempArray[tempArray.length - 2] !== tempArray[tempArray.length - 1]) {
        if (tempArray.length < 4) {
          tempArray = [tempArray[tempArray.length - 1]];
        } else  {
            console.log('popping and replacing');
            tempArray.pop();
            replaceWithNulls(tempArray, nulls, board);
            return board;
          }
      } else {
         if ((j === board[i].length - 1) && tempArray.length > 2) {
           console.log('replacing');
           replaceWithNullsAtEnd(tempArray, nulls, board);
           return board;
         }
      }
    }
    tempArray = [];
  }
  return board;
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
  console.log('flipping');
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


// function replaceOrbs () {
//
// }
//
// function getEmptyPositions () {
//   var emptyPosition = [];
//   for (i=0; i < board.length; i++) {
//     for (j=0; j < board[i].length; j++)
//       if (board[i][j] === null) {
//         emptyPositions.push();
//       }
//   }
// }



// function boardToEmptyPositions(board) {
//   return board.reduce(function (result1, row, rowIndex) {
//     return row.reduce(function (result2, column, columnIndex) {
//       return !column ? result2.concat([{ x: rowIndex, y: columnIndex }])
//         : result2;
//     }, result1);
//   }, []);
// }
