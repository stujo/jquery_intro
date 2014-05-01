/** Example:  animations **/

$(document).ready(
  function () {
    $("button#example-shower").click(function () {
      $("img#thing-to-toggle").animate({
        opacity:'1',
        height:'400px',
        width:'400px'
      });
    });

    $("button#example-hider").click(function () {
      $("img#thing-to-toggle").animate({
        opacity:'0.1',
        height:'100px',
        width:'250px'
      });
    });
  });

