/** Example:  fade-in-out **/

$(document).ready(
  function () {
    $("button#example-shower").click(function () {
      $("div#thing-to-toggle").fadeIn("slow");
    });
    $("button#example-hider").click(function () {
      $("div#thing-to-toggle").fadeOut("fast");
    });
  });
