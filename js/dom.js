$(document).ready(function() {

  var flattened = $.map(game.getBoard(), function(n) {
    return n;
  });

  $(".orb").each(function(i) {
    $(this).addClass(flattened[i]);
  });


  $(".orb-container").on("click", function () {
    $(this).toggleClass("selected");
    game.selectOrb($(this).parent().index(), $(this).index());
    if (game.selectedOrbs.length === 2) {
      changeBoardColors();
      $(".orb-container").removeClass("selected");
      if (game.possibleMove) {

      }
      setTimeout (function() {
        removeNullColors();
        setTimeout (function (){
          changeBoardColors();
          $(".scorenum").text(game.movesRemaining);
        }, 500);
      }, 1100);
    }
  });


  function removeNullColors() {
    $(".row").each(function(i) {   // Iterating over DOM board
      var $row = $(this);
      $row.children(".orb-container").each(function(j) {
        var $orbcontainer = $(this);
        var $orb = $orbcontainer.children(".orb");
        var boardIndexColor = game.getBoard()[$row.index()][$orbcontainer.index()];
        if (boardIndexColor === null) {
            $orb.removeClass($orb.attr('class').split(' ').pop());
        }
      });
    });
  }


  function changeBoardColors() {
    $(".row").each(function(i) {   // Iterating over DOM board
      var $row = $(this);
      $row.children(".orb-container").each(function(j) {
        var $orbcontainer = $(this);
        var $orb = $orbcontainer.children(".orb");
        var boardIndexColor = game.getBoard()[$row.index()][$orbcontainer.index()];
        if ((boardIndexColor != $orb.attr('class').split(' ').pop()) && ($orb.attr('class').split(' ').pop() !== "orb")) {   // If the color does not match board color
            $orb.removeClass($orb.attr('class').split(' ').pop());            //  remove DOM color class
            $orb.addClass(boardIndexColor);                    //  add correct DOM color class
        } else if ((boardIndexColor != $orb.attr('class').split(' ').pop()) && ($orb.attr('class').split(' ').pop() == "orb")) {
          $orb.addClass(boardIndexColor);
        }
      });
    });
  }


  });
