/** Example:  slide-up-down **/

$(document).ready(
  function () {
    $("button#example-shower").click(function () {
      $("div#thing-to-toggle").slideDown("slow");
    });
    $("button#example-hider").click(function () {
      $("div#thing-to-toggle").slideUp("fast");
    });
  });

