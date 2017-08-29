$(document).ready(function() {


  $("#bgmusic").get(0).play();

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
      // processBoard();
      clicks = 0;
    }
  });

});

  function processBoard() {
    setTimeout (function() {
      removeNullColors();
      setTimeout (function (){
        changeBoardColors();
        $(".scorenum").text(game.movesRemaining);
      }, 310);
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
