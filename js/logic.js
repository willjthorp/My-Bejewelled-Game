
var settings;

createGame = function () {

    settings = {
      rows: 5,
      columns: 8,
      totalScore: 0,
      moveScore: 0,
      multiplier: 0,
      highScore: 0,
      colors: ["red", "yellow", "green", "blue", "magenta"],
      colorsLarge: ["red-large", "yellow-large", "green-large", "blue-large"],
      possibleMove: false,
      movesRemaining: 10,
      timeRemaining: 10,
      matchMade: false,
      selectedOrbs: [],
      doubleMatch: 0
    };

    settings.board = createBoard([], settings.rows, settings.columns, settings.colors);

    return settings;

  };

var game = createGame();

function timer() {
  $(".movenum").text(game.timeRemaining);
  game.movesRemaining = null;
  var time = setInterval(function() {
    console.log("ticking");
    game.timeRemaining--;
    $(".movenum").text(game.timeRemaining);
    if ($(".main-menu").hasClass("fadeInUp") || isNaN(game.timeRemaining)) {
      clearInterval(time);
    }
    if (game.timeRemaining === 0) {
      clearInterval(time);
      $(".final-score").text(game.totalScore);
      $(".board-container").css("pointer-events", "none");
      animateGameOver ();
    }
  }, 1000);
  return time;
}

function selectOrb (x, y) {
  game.selectedOrbs.push([x, y, game.board[x][y]]);
  if (game.selectedOrbs.length > 1 && checkIfValidMove(game.selectedOrbs)) {
    disableClick();
    game.board = switchOrbs(game.selectedOrbs, game.board);
    processMove();
    processBoard();
  } else if (game.selectedOrbs.length > 1 && !checkIfValidMove(game.selectedOrbs)){
    $(".message-text").text("No can do!");
    animateMessage ();
    game.selectedOrbs = [];
    enableClick();
  }
}

function processMove() {
  game.matchMade = false;
  setTimeout(function() {
    game.board = checkMatches(game.board);
    if (game.matchMade) {
      game.multiplier++;
      $('.onmatch')[0].play();
      setTimeout (function () {
        game.board = cascadeOrbs(game.board);
      }, 400);
    } else if (!game.matchMade && game.multiplier === 0) {
      game.board = switchOrbsBack(game.selectedOrbs, game.board);
      $(".message-text").text("No can do!");
      animateMessage();
      game.selectedOrbs = [];
      enableClick();
      return;
    }
    if (game.matchMade) {
        processMove ();
        processBoard ();
    } else {
      if (!$(".game-over").hasClass("fadeInUp")) {
        enableClick();
      }
      endOfMove();
    }
  }, 600);
}

function endOfMove() {
  if (game.multiplier > 20) {
    $(".message-text").html("Combo x" + game.multiplier + "<br>Out of this world!!!");
    animateMessage();
  } else if (game.multiplier > 10) {
    $(".message-text").html("Combo x" + game.multiplier + "<br>Awesome Combo!!");
    animateMessage();
  } else if (game.multiplier > 5) {
    $(".message-text").html("Combo x" + game.multiplier + "<br>Great Combo!");
    animateMessage();
  }
  game.totalScore += game.moveScore * game.multiplier;
  game.counter = 0;
  game.multiplier = 0;
  game.moveScore = 0;
  game.selectedOrbs = [];
  if (!game.movesRemaining) {
    $(".final-score").text(game.totalScore);
    $(".board-container").css("pointer-events", "none");
    animateGameOver ();
  }
}

function checkIfValidMove (selectedOrbs) {
  return ((selectedOrbs[0][0] === selectedOrbs[1][0]) && (selectedOrbs[0][1] === selectedOrbs[1][1] + 1) ||
          (selectedOrbs[0][0] === selectedOrbs[1][0]) && (selectedOrbs[0][1] === selectedOrbs[1][1] - 1) ||
          (selectedOrbs[0][1] === selectedOrbs[1][1]) && (selectedOrbs[0][0] === selectedOrbs[1][0] + 1) ||
          (selectedOrbs[0][1] === selectedOrbs[1][1]) && (selectedOrbs[0][0] === selectedOrbs[1][0] - 1));
}

function checkMatches(board) {
  var rowMatches = checkForRowMatches(board);
  return flipMatrix(checkForColumnMatches(flipMatrix(rowMatches[0]), flipMatrix(rowMatches[1])));
}

function cascadeOrbs (board) {
    for (i=0; i < board.length; i++) {
      for (j=0; j < board[i].length; j++)
        if (board[i][j] === null) {
          for (a = i; a > 0; a--) {
            board[a][j] = board[a-1][j];
          }
          if (game.rows === 5) {
            board[0][j] = getRandomColor(game.colors);
          } else {
            board[0][j] = getRandomColor(game.colorsLarge);
          }
        }
    }
    return board;
}

function createBoard (board, rows, columns, colors) {
  var hasChanged = true;
  for (i = 0; i < rows; i++) {
      board.push([]);
    for (j = 0; j < columns; j++) {
      board[i].push(getRandomColor(colors));
    }
  }
  return flipMatrix(changeRowMatches(flipMatrix(changeRowMatches(board, colors)), colors));
}

function getRandomColor (colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function changeRowMatches (board, colors, hasChanged) {
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

function switchOrbsBack (selectedOrbs, board) {
  board[selectedOrbs[0][0]][selectedOrbs[0][1]] = selectedOrbs[0][2];
  board[selectedOrbs[1][0]][selectedOrbs[1][1]] = selectedOrbs[1][2];
  return board;
}

function checkForRowMatches (board) {
  var tempArray = [];
  var nulls = [];
  var originalBoard = $.extend(true, [], board);
  var updatedBoard = [];
  for (i = 0; i < board.length; i++) {
    for (j = 0; j < board[i].length; j++) {
      tempArray.push(board[i][j]);
        if (j > 0 && (tempArray[tempArray.length - 2] !== tempArray[tempArray.length - 1])) {
          if (tempArray.length < 4) {
            tempArray = [tempArray[tempArray.length - 1]];
          } else  {
              tempArray.pop();
              replaceWithNulls(tempArray, nulls, board);
              game.matchMade = true;
              tempArray = [];
            }
        } else {
           if ((j === board[i].length - 1) && tempArray.length > 2) {
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

function checkForColumnMatches (originalBoard, updatedBoard) {
  var tempArray = [];
  var nulls = [];
  for (i = 0; i < originalBoard.length; i++) {
    for (j = 0; j < originalBoard[i].length; j++) {
      tempArray.push(originalBoard[i][j]);
        if (j > 0 && (tempArray[tempArray.length - 2] !== tempArray[tempArray.length - 1])) {
          if (tempArray.length < 4) {
            tempArray = [tempArray[tempArray.length - 1]];
          } else  {
              tempArray.pop();
              replaceWithNulls(tempArray, nulls, updatedBoard);
              game.matchMade = true;
              tempArray = [];
            }
        } else {
           if ((j === originalBoard[i].length - 1) && tempArray.length > 2) {
             replaceWithNullsAtEnd(tempArray, nulls, updatedBoard);
             game.matchMade = true;
             tempArray = [];
           }
         }
    }
    tempArray = [];
  }
  game.doubleMatch = 0;
  return updatedBoard;
}

function replaceWithNulls (tempArray, nulls, board) {
  nulls = generateNulls(tempArray);
  board[i].splice((j - tempArray.length), tempArray.length, nulls);
  board[i] = [].concat.apply([], board[i]);
  return board;
}

function replaceWithNullsAtEnd (tempArray, nulls, board) {
  nulls = generateNulls(tempArray);
  board[i].splice((j - tempArray.length + 1), tempArray.length, nulls);
  board[i] = [].concat.apply([], board[i]);
  return board;
}

function generateNulls (tempArray) {
  if (!game.moveScore) {game.movesRemaining--;}
  game.doubleMatch++;
  if (game.doubleMatch > 1) {game.multiplier += 2;}
  if (tempArray.length === 4) {game.multiplier++;}
  if (tempArray.length === 5) {game.multiplier += 2;}
  game.moveScore += tempArray.length;
  return tempArray.map(function(x) {
    return null;
  });
}

function flipMatrix (matrix) {
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
