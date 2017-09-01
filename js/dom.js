$(document).ready(function() {

  var $mainMenu = $('.main-menu');

  updateMenuLevelInfo ();

  // Render the board...
  for (i = 0; i < game.rows; i++) {
    $(".board-container").prepend("<div class='row'></div>");
    for (j = 0; j < game.columns; j++) {
      $(".row").eq(0).append('<div class="orb-container-small-board"><div class="orb-small orb"></div></div>');
    }
  }


  // Autoplay background music...
  $("#bgmusic").get(0).play();


  // Add colors based on game board..
  var flattened = $.map(game.board, function(n) {
    return n;
  });
  $(".orb").each(function(i) {
    $(this).addClass(flattened[i]);
  });


  // Selecting orbs / running main game logic ...
  enableSelect();


  // Access/close main menu...
  $('.main-menu-button, .close-button').on('click', function() {
    if ($(".game-over").hasClass("fadeInUp")) {
      hideGameOver();
    }
    if ($mainMenu.hasClass('fadeInUp')) {
      if ($(".timed-game").hasClass("button-selected") && game.timeRemaining > 0) {
        timer();
      }
      $(".shuffle-button").css("pointer-events", "auto");
      $mainMenu.addClass('fadeOutDown');
      $mainMenu.removeClass('fadeInUp');
      $('.board-container').css('pointer-events', 'auto');
      $mainMenu.css('pointer-events', 'none');
      setTimeout(function() {
        $mainMenu.removeClass('fadeOutDown');
        $mainMenu.css('pointer-events', 'auto');
      }, 1500);
      if (($(".normal-game").hasClass("button-selected") && !game.movesRemaining) || ($(".timed-game").hasClass("button-selected") && !game.timeRemaining)) {
        $(".board-container").css("pointer-events", "none");
        animateGameOver ();
      }
    } else {
      $mainMenu.addClass('fadeInUp');
      $('.board-container').css('pointer-events', 'none');
      $(".shuffle-button").css("pointer-events", "none");
    }
  });


  //Main menu instructions button...
    $('.instructions-button').on('click' , function() {
      $mainMenu.css("width", "800");
      $(".main-menu-container").fadeOut();
      $('.instructions').fadeTo('slow', 1, function() {
     });
   });
   $('.instructions-back-button').on('click', function () {
     $mainMenu.css("width", "300");
     $(".main-menu-container").fadeIn();
     $(".instructions").css('display', 'none');
   });


   //Main menu Level selecter button...
     $('.level-button').on('click' , function() {
       $mainMenu.css("width", "800");
       $(".main-menu-container").fadeOut();
       $('.level-selecter').fadeTo('slow', 1, function() {
      });
    });
    $('.level-one-button').on('click' , function() {
      $('.level-one-button').addClass("button-selected");
      $('.level-two-button').removeClass("button-selected");
      $('.level-three-button').removeClass("button-selected");
    });
    $('.level-two-button').on('click' , function() {
      $('.level-one-button').removeClass("button-selected");
      $('.level-three-button').removeClass("button-selected");
      if (!($('.level-two-button').hasClass("off"))) {
        $('.level-two-button').addClass("button-selected");
      }
    });
    $('.level-three-button').on('click' , function() {
      $('.level-one-button').removeClass("button-selected");
      $('.level-two-button').removeClass("button-selected");
      if (!($('.level-three-button').hasClass("off"))) {
        $('.level-three-button').addClass("button-selected");
      }
    });
    $('.level-selecter-back-button').on('click', function () {
      $mainMenu.css("width", "300");
      $(".main-menu-container").fadeIn();
      $(".level-selecter").css('display', 'none');
    });

    //Level selector start button...
    $(".level-selecter-start-button").on("click", function() {
      if ($('.level-one-button').hasClass("button-selected")) {
        levelOneSettings();
        resetLevel ();
      } else if ($('.level-two-button').hasClass("button-selected")) {
        levelTwoSettings();
        resetLevel ();
      } else if ($('.level-three-button').hasClass("button-selected")) {
        levelThreeSettings();
        resetLevel ();
      }
    });

    function resetLevel () {
      updateMenuLevelInfo ();
      displayLevelInfo();
      resetGame();
      $mainMenu.addClass("fadeOutDown");
      $mainMenu.removeClass("fadeInUp");
      setTimeout(function() {
        $mainMenu.removeClass("fadeOutDown");
      }, 2000);
    }

   //Main menu game-options button...
   $('.game-options-button').on('click', function() {
     $mainMenu.css("width", "800");
     $(".main-menu-container").fadeOut();
     $('.game-options').fadeTo('slow', 1, function() {
    });
   });
   $('.game-options-back-button').on('click', function () {
     $mainMenu.css("width", "300");
     $(".main-menu-container").fadeIn();
     $(".game-options").css('display', 'none');
   });


   // Game-options board size...
   $('.large-board-button').on('click', function() {
     $('.large-board-button').addClass('button-selected');
     $('.small-board-button').removeClass('button-selected');
   });
   $('.small-board-button').on('click', function() {
     $('.small-board-button').addClass('button-selected');
     $('.large-board-button').removeClass('button-selected');
   });


   // Game-options game-type...
   $('.normal-game').on('click', function() {
     $('.normal-game').addClass('button-selected');
     $('.timed-game').removeClass('button-selected');
   });
   $('.timed-game').on('click', function() {
     $('.timed-game').addClass('button-selected');
     $('.normal-game').removeClass('button-selected');
   });


   // Game-options select colors...
   $(".orb-container-icon").on("click", function () {
     $(this).toggleClass("selected");
   });


   // Reset function...
   function resetGame() {
     if ($('.large-board-button').hasClass('button-selected')) {
       game.rows = 7;
       game.columns = 11;
       renderLargeBoard();
       game.board = createBoard([], game.rows, game.columns, game.colorsLarge);
       changeBoardColors();
     } else {
       game.rows = 5;
       game.columns = 8;
       renderSmallBoard();
       game.board = createBoard([], game.rows, game.columns, game.colors);
       changeBoardColors();
     }
    if ($(".timed-game").hasClass("button-selected")) {
      game.timeRemaining = 60;
      $(".remaining").text("Time");
      timer();
    } else {
      game.movesRemaining = 10;
      game.timeRemaining = NaN;
      $(".remaining").text("Moves");
      $(".movenum").text(game.movesRemaining);
    }
     enableClick();
     enableSelect();
     enableHoverSounds();
     $(".shuffle-button").css("pointer-events", "auto");
     game.selectedOrbs.length = 0;
     game.totalScore = 0;
     $(".scorenum").text(game.totalScore);
   }

   //Check which colors selected...
   function checkColors (colors) {
     for (i=0; i < $(".orb-container-icon").length; i++) {
       if ($(".orb-container-icon").eq(i).hasClass("selected")) {
         colors.push($(".orb-container-icon").eq(i).children().attr('id'));
       }
     }
   }


   // Game-options start button...
   $(".reset-button").on("click", function () {
     game.colors.length = 0;
     game.colorsLarge.length = 0;
     checkColors (game.colors);
     if (game.colors.length < 3) {
       $('.colors-error').fadeTo('slow', 1, function() {
      });
      setTimeout(function() {
        $('.colors-error').fadeOut();
      }, 1500);
      return;
     }
     game.colorsLarge = game.colors.map(function (x) {
       return x + "-large";
     });
     game.currentLevel = "Custom";
     resetGame();
     $mainMenu.addClass("fadeOutDown");
     $mainMenu.removeClass("fadeInUp");
     setTimeout(function() {
       $mainMenu.removeClass("fadeOutDown");
     }, 2000);
   });


    // Highscores-button...
    $(".high-scores-button").on("click", function (){
      $mainMenu.css("width", "800");
      $(".main-menu-container").fadeOut();
      $('.high-scores').fadeTo('slow', 1, function() {
     });
   });
   $('.high-scores-back-button').on('click', function () {
     $mainMenu.css("width", "300");
     $(".main-menu-container").fadeIn();
     $(".high-scores").css('display', 'none');
   });


    //End of game next level button...
    $(".next-level-button").on("click", function() {
      if (game.currentLevel === "One") {
        levelTwoSettings();
        $(".level-one-button").removeClass("button-selected");
        $(".level-two-button").addClass("button-selected");
        $(".current-level").text(game.currentLevel);
        updateMenuLevelInfo ();
        resetGame();
        hideGameOver();
        displayLevelInfo();
      } else if (game.currentLevel === "Two") {
        levelThreeSettings();
        $(".level-two-button").removeClass("button-selected");
        $(".level-three-button").addClass("button-selected");
        updateMenuLevelInfo ();
        resetGame();
        hideGameOver();
        displayLevelInfo();
      }
    });

   function hideGameOver() {
     $(".game-over").addClass("fadeOutDown");
     $(".game-over").removeClass("fadeInUp");
     $(".shuffle-button").css("pointer-events", "auto");
     setTimeout(function() {
       $(".game-over").removeClass("fadeOutDown");
     }, 2000);
   }


  // End of game restart function...
  $(".restart").on("click", function () {
    disableClick();
    resetGame();
    hideGameOver();
    }
  );

  // menu-restart button...
  $(".menu-reset-button").on("click", function () {
    disableClick();
    resetGame();
    $mainMenu.addClass("fadeOutDown");
    $mainMenu.removeClass("fadeInUp");
    setTimeout(function() {
      $mainMenu.removeClass("fadeOutDown");
    }, 2000);
    }
  );

  // Add and play sound effect for hovering over orbs...
    enableHoverSounds();


  // Toggle background music button...
  $('.audio-control').on("click", function() {
    if ($("#bgmusic")[0].paused == false) {
        $("#bgmusic")[0].pause();
        $(".audio-control").addClass("off");
    } else {
        $("#bgmusic")[0].play();
        $(".audio-control").removeClass("off");
    }
  });


  //Shuffle board button...
  $('.shuffle-button').on('click', function() {
    if (game.rows === 7) {
      game.board = createBoard([], game.rows, game.columns, game.colorsLarge);
      changeBoardColors();
    } else {
      game.board = createBoard([], game.rows, game.columns, game.colors);
      changeBoardColors();
    }
    if (game.timeRemaining > 6) {
      game.timeRemaining -= 5;
    }
    game.movesRemaining--;
    if ($(".normal-game").hasClass("button-selected")) {
      $(".movenum").text(game.movesRemaining);
    } else {
      $(".movenum").text(game.timeRemaining);
    }
    if (($(".normal-game").hasClass("button-selected") && !game.movesRemaining) || ($(".timed-game").hasClass("button-selected") && !game.timeRemaining)) {
      endOfMove();
      $(".final-score").text(game.totalScore);
      $(".board-container").css("pointer-events", "none");
      animateGameOver ();
    }
  });

  displayLevelInfo();

});  // End of window.load


  function displayLevelInfo() {
    setTimeout(function() {
    switch (game.currentLevel) {
      case "One":
        $(".message-text").html("Level One<br>Score to beat: " + game.levelOneScore);
        animateMessage();
        break;
      case "Two":
        $(".message-text").html("Level Two<br>Score to beat: " + game.levelTwoScore);
        animateMessage();
        break;
      case "Three":
        $(".message-text").html("Level Three<br>Score to beat: " + game.levelThreeScore);
        animateMessage();
        break;
    }
  }, 1500);
  }

  function enableSelect() {
    var clicks = 0;
    $(".orb-container-small-board, .orb-container-large-board").on("click", function () {
      $('#onselect')[0].play();
      clicks++;
      $(this).toggleClass("selected");
      selectOrb($(this).parent().index(), $(this).index());
      if (clicks > 1) {
        $('.onswitch').eq(Math.floor(Math.random() * 3))[0].play();
        changeBoardColors();
        $(".orb-container-small-board, .orb-container-large-board").removeClass("selected");
        clicks = 0;
      }
    });
  }

  function enableHoverSounds() {
    $(".orb-container-small-board, .orb-container-large-board")
      .each(function(i) {
        if (i != 0) {
          $("#beep-two")
            .clone()
            .attr("id", "beep-two" + i)
            .appendTo($(this).parent());
        }
        $(this).data("beeper", i);
      })
      .hover(function() {
        $("#beep-two" + $(this).data("beeper"))[0].play();
      });
    $("#beep-two").attr("id", "beep-two0");
  }


  function renderSmallBoard() {
    $('.row').remove();
    var x = 0;
    for (i = 0; i < game.rows; i++) {
      $(".board-container").prepend("<div class='row'></div>");
      for (j = 0; j < game.columns; j++) {
        $(".row").eq(0).prepend('<div class="orb-container-small-board"><div class="orb-small orb"></div></div>');
        $(".row").eq(0).append('<audio id="beep-two' + x + '" preload="auto"><source src="sound/a.wav" controls=""></audio>');
        x++;
      }
    }
  }

  function renderLargeBoard() {
    $('.row').remove();
    var x = 0;
    for (i = 0; i < game.rows; i++) {
      $(".board-container").prepend("<div class='row'></div>");
      for (j = 0; j < game.columns; j++) {
        $(".row").eq(0).prepend('<div class="orb-container-large-board"><div class="orb-large orb"></div></div>');
        $(".row").eq(0).append('<audio id="beep-two' + x + '" preload="auto"><source src="sound/a.wav" controls=""></audio>');
        x++;
      }
    }
  }


  function processBoard() {
    setTimeout (function() {
      removeNullColors();
      setTimeout (function (){
        changeBoardColors();
        if ($(".timed-game").hasClass("button-selected")) {
          $(".movenum").text(game.timeRemaining);
        } else {
          $(".movenum").text(game.movesRemaining);
        }
        $(".scorenum").text(game.totalScore);
      }, 410);
    }, 600);
  }

  function removeNullColors() {
    $(".row").each(function() {   // Iterating over DOM board
      var $row = $(this);
      $row.children(".orb-container-small-board, .orb-container-large-board").each(function() {
        var $orbcontainer = $(this);
        var $orb = $orbcontainer.children(".orb");
        var boardIndexColor = game.board[$row.index()][$orbcontainer.index()];
        if (boardIndexColor == null) {
            $orb.removeClass($orb.attr('class').split(' ').pop());
        }
      });
    });
  }


  function changeBoardColors() {
    $(".row").each(function() {   // Iterating over DOM board
      var $row = $(this);
      $row.children(".orb-container-small-board, .orb-container-large-board").each(function() {
        var $orbcontainer = $(this);
        var $orb = $orbcontainer.children(".orb");
        var boardIndexColor = game.board[$row.index()][$orbcontainer.index()];
        if ((boardIndexColor != $orb.attr('class').split(' ').pop()) && ($orb.attr('class').split(' ').pop() !== "orb")) {   // If the color does not match board color
            $orb.removeClass($orb.attr('class').split(' ').pop());            //  remove DOM color class
            $orb.addClass(boardIndexColor);                    //  add correct DOM color class
        } else if ((boardIndexColor != $orb.attr('class').split(' ').pop()) && ($orb.attr('class').split(' ').pop() == "orb")) {
          $orb.addClass(boardIndexColor);
        }
      });
    });
  }

  function animateMessage () {
    $(".message").addClass("fadeInOut");
    setTimeout(function() {
      $(".message").removeClass("fadeInOut");
    }, 2000);
  }

  function animateGameOver () {
    $(".final-score").text(game.totalScore);
    $(".board-container").css("pointer-events", "none");
    $(".game-over").addClass("fadeInUp");
    $(".shuffle-button").css("pointer-events", "none");
  }

  function resetGameOverMessage() {
    $(".win-lose").text("Game over!");
    $(".next-level-button").addClass("hidden");
    $(".high-score-update").addClass("hidden");
  }

  function updateMenuLevelInfo () {
    $(".current-level").text(game.currentLevel);
    switch (game.currentLevel) {
      case "One":
        $(".score-to-beat").text(game.levelOneScore);
        break;
      case "Two":
        $(".score-to-beat").text(game.levelTwoScore);
        break;
      case "Three":
        $(".score-to-beat").text(game.levelThreeScore);
        break;
      case "Custom":
        $(".score-to-beat").hide();
        break;
    }
  }

  function disableClick() {
    $('.board-container').css("pointer-events", "none");
  }

  function enableClick() {
    $('.board-container').css("pointer-events", "auto");
  }

  function levelOneSettings() {
    game.currentLevel = "One";
    $('.large-board-button').removeClass("button-selected");
    $('.small-board-button').addClass("button-selected");
    $('.timed-game').removeClass("button-selected");
    $('.normal-game').addClass("button-selected");
    game.colors = ["red", "yellow", "green", "blue", "magenta"];
  }

  function levelTwoSettings() {
    game.currentLevel = "Two";
    $('.large-board-button').addClass("button-selected");
    $('.small-board-button').removeClass("button-selected");
    $('.timed-game').addClass("button-selected");
    $('.normal-game').removeClass("button-selected");
    game.colorsLarge = ["aqua-large", "magenta-large", "yellow-large", "blue-large"];
  }

  function levelThreeSettings() {
    game.currentLevel = "Three";
    $('.large-board-button').removeClass("button-selected");
    $('.small-board-button').addClass("button-selected");
    $('.timed-game').addClass("button-selected");
    $('.normal-game').removeClass("button-selected");
    game.colors = ["green", "magenta", "red"];
  }
