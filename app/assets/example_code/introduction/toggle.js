/** Example:  toggle **/


$(document).ready(
  function () {
    $("button#example-toggler").click(function () {
      $("div#thing-to-toggle").toggle();
    });
  });
