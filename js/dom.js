$(document).ready(function() {

  var flattened = $.map(game.getBoard(), function(n) {
    return n;
  });

  $(".orb").each(function(i) {
    $(this).addClass(flattened[i]);
  });

  var clicks = 0;


  $(".orb-container").on("click", function () {
    clicks++;
    console.log(clicks);
    $(this).toggleClass("selected");
    game.selectOrb($(this).parent().index(), $(this).index());
    console.log(game.selectedOrbs);
    if (clicks === 2) {
      $(".orb-container").removeClass("selected");
      changeBoardColors();
      clicks = 0;
    }
  });

});



function changeBoardColors() {
  $(".row").each(function(i) {
    var $this = $(this);
    $this.children(".orb-container").each(function(j) {
      var $that = $(this);
      if (game.getBoard()[$this.index()][$(this).index()] != $(this).children(".orb").attr('class').split(' ').pop() && game.getBoard()[$this.index()][$(this).index()] != null) {   // If the color does not match grid color
          $that.children(".orb").removeClass($that.children(".orb").attr('class').split(' ').pop());            //  remove DOM color class
          $that.children(".orb").addClass(game.getBoard()[$this.index()][$that.index()]);
          console.log("foo");                       //  add correct DOM color class
      }
      if (game.getBoard()[$this.index()][$(this).index()] === null) {                                           // If the grid element is NULL (matched row removed)
        $(this).addClass("selected");                                                                // Select the matched row
        setTimeout(function() {
            $that.removeClass("selected");                                                                      // Remove selecter box after time
            $that.children(".orb").removeClass($that.children().attr('class').split(' ').pop());               // Remove Dom color class
            console.log("bar");
        }, 1000);
      }
    });
  });
}
