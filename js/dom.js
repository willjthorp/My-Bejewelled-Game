$(document).ready(function() {

  $("#bgmusic").get(0).play();

  var flattened = $.map(game.board, function(n) {
    return n;
  });

  $(".orb").each(function(i) {
    $(this).addClass(flattened[i]);
  });

  var clicks = 0;

  $(".orb-container").on("click", function () {
    $('#onselect')[0].play();
    clicks++;
    $(this).toggleClass("selected");
    selectOrb($(this).parent().index(), $(this).index());
    if (clicks > 1) {
      $('.onswitch').eq(Math.floor(Math.random() * 3))[0].play();
      changeBoardColors();
      $(".orb-container").removeClass("selected");
      clicks = 0;
    }
  });

  $(".restart").on("click", function () {
    game.board = createBoard([], game.rows, game.columns, game.colors);
    changeBoardColors();
    game.totalScore = 0;
    game.movesRemaining = 10;
    $(".movenum").text(game.movesRemaining);
    $(".scorenum").text(game.totalScore);
    $(".game-over").addClass("fadeOutDown");
    $(".game-over").removeClass("fadeInUp");
    enableClick();
    setTimeout(function() {
      $(".game-over").removeClass("fadeOutDown");
    }, 2000);
    }
  );

  $(".orb-container")
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


  $('.audio-control').on("click", function() {
    if ($("#bgmusic")[0].paused == false) {
        $("#bgmusic")[0].pause();
        $(".audio-control").addClass("off");
    } else {
        $("#bgmusic")[0].play();
        $(".audio-control").removeClass("off");
    }
  });

});

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
      $row.children(".orb-container").each(function() {
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
      $row.children(".orb-container").each(function() {
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
