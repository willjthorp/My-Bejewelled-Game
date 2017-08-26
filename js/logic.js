game = function() {
  var board = [];
  var rows = 5;
  var columns = 8;
  var score = 0;
  var colors = ["red", "yellow", "green"];
  var selectedOrbs = [];

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
              if (selectedOrbs[0][2] === selectedOrbs[1][2]) {
                console.log('Error - same color!');
              } else {
                switchOrbs(selectedOrbs, board);
                checkForRowMatches(flipMatrix(checkForRowMatches(board)));
              }
              selectedOrbs = [];
            }
        },

        getScore: function() {
          return score;
        }

      };
};

var game = game();

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
  }
  return board;
}


function switchOrbs (selectedOrbs, board) {
  board[selectedOrbs[0][0]][selectedOrbs[0][1]] = selectedOrbs[1][2];
  board[selectedOrbs[1][0]][selectedOrbs[1][1]] = selectedOrbs[0][2];
  return board;
}


function checkForRowMatches(board) {
  var tempArray = [];
  var nulls = [];
  for (i = 0; i < board.length; i++) {
    for (j = 0; j < board[i].length; j++) {
      tempArray.push(board[i][j]);
      console.log(tempArray);
      if (j > 0 && tempArray[tempArray.length - 2] !== tempArray[tempArray.length - 1]) {
        if (tempArray.length < 4) {
          tempArray = [tempArray[tempArray.length - 1]];
        } else  {
            console.log('popping and replacing');
            tempArray.pop();
            return replaceWithNulls(tempArray, nulls, board);
          }
      } else {
         if ((j === board[i].length - 1) && tempArray.length > 2) {
           console.log('replacing');
           return replaceWithNulls(tempArray, nulls, board);
         }
      }
    }
    tempArray = [];
  }
  return board;
}


function replaceWithNulls(tempArray, nulls, board) {
  nulls = generateNulls(tempArray);
  board[i] = [].concat.apply([], board[i].splice((j - tempArray.length), tempArray.length, nulls));
  return board;
}


function generateNulls (tempArray) {
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






// function boardToEmptyPositions(board) {
//   return board.reduce(function (result1, row, rowIndex) {
//     return row.reduce(function (result2, column, columnIndex) {
//       return !column ? result2.concat([{ x: rowIndex, y: columnIndex }])
//         : result2;
//     }, result1);
//   }, []);
// }
