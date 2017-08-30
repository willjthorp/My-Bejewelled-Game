$(document).ready(function() {


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
    if ($('.main-menu').hasClass('fadeInUp')) {
      $('.main-menu').addClass('fadeOutDown');
      $('.main-menu').removeClass('fadeInUp');
      $('.board-container').css('pointer-events', 'auto');
      $('.main-menu').css('pointer-events', 'none');
      setTimeout(function() {
        $('.main-menu').removeClass('fadeOutDown');
        $('.main-menu').css('pointer-events', 'auto');
      }, 1500);
    } else {
      $('.main-menu').addClass('fadeInUp');
      $('.board-container').css('pointer-events', 'none');
    }
  });

  //Main menu instructions button...
    $('.instructions-button').on('click' , function() {
      $(".main-menu").css("width", "800");
      $(".main-menu-container").fadeOut();
      $('.instructions').fadeTo('slow', 1, function() {
     });
   });
   $('.instructions-back-button').on('click', function () {
     $(".main-menu").css("width", "300");
     $(".main-menu-container").fadeIn();
     $(".instructions").fadeOut();
   });

   //Main menu game-options button...
   $('.game-options-button').on('click', function() {
     $(".main-menu").css("width", "800");
     $(".main-menu-container").fadeOut();
     $('.game-options').fadeTo('slow', 1, function() {
    });
   });
   $('.game-options-back-button').on('click', function () {
     $(".main-menu").css("width", "300");
     $(".main-menu-container").fadeIn();
     $(".game-options").fadeOut();
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


   // Game-options select colors...
   $(".orb-container-icon").on("click", function () {
     $(this).toggleClass("selected");
   });

   // Reset function
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
     enableClick();
     enableSelect();
     enableHoverSounds();
     game.totalScore = 0;
     game.movesRemaining = 10;
     $(".movenum").text(game.movesRemaining);
     $(".scorenum").text(game.totalScore);
   }

   //Check which colors selected...
   function checkColors (colors) {
     for (i=0; i < $(".orb-container-icon").length; i++) {
       if ($(".orb-container-icon").eq(i).hasClass("selected")) {
         console.log('pushing');
         colors.push($(".orb-container-icon").eq(i).children().attr('id'));
       }
     }
   }


   // Game-options start button...
   $(".reset-button").on("click", function () {
     console.log('resetting');
     game.colors.length = 0;
     game.colorsLarge.length = 0;
     checkColors (game.colors);
     game.colorsLarge = game.colors.map(function (x) {
       return x + "-large";
     });
     resetGame();
     $(".main-menu").addClass("fadeOutDown");
     $(".main-menu").removeClass("fadeInUp");
     setTimeout(function() {
       $(".main-menu").removeClass("fadeOutDown");
     }, 2000);
   });


  // End of game restart function...
  $(".restart").on("click", function () {
    resetGame();
    $(".game-over").addClass("fadeOutDown");
    $(".game-over").removeClass("fadeInUp");
    enableClick();
    setTimeout(function() {
      $(".game-over").removeClass("fadeOutDown");
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
    if ($('.large-board-button').hasClass('button-selected')) {
      game.board = createBoard([], game.rows, game.columns, game.colorsLarge);
      changeBoardColors();
    } else {
      game.board = createBoard([], game.rows, game.columns, game.colors);
      changeBoardColors();
    }
    game.movesRemaining--;
    $(".movenum").text(game.movesRemaining);
    if (!game.movesRemaining) {
      $(".final-score").text(game.totalScore);
      $(".board-container").css("pointer-events", "none");
      animatePopup ();
    }
  });


});  // End of window.load

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
      .mouseenter(function() {
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
        $(".movenum").text(game.movesRemaining);
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
        if (boardIndexColor === null) {
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


  function animateError () {
    $(".error").addClass("fadeInOut");
    setTimeout(function() {
      $(".error").removeClass("fadeInOut");
    }, 2000);
  }

  function animatePopup () {
    $(".game-over").addClass("fadeInUp");
  }


  function disableClick() {
    $('.board-container').css("pointer-events", "none");
  }

  function enableClick() {
    $('.board-container').css("pointer-events", "auto");
  }
