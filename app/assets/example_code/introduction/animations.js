/** Example:  animations **/

$(document).ready(
  function () {
    $("button#example-toggler").click(function () {
      $("div#thing-to-toggle").toggle("slow");
    });

    $("button#example-shower").click(function () {
      $("div#thing-to-toggle").show("fast");
    });

    $("button#example-hider").click(function () {
      $("div#thing-to-toggle").hide(1000);
    });
  });

