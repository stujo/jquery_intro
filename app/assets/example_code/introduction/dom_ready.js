/** Example:  dom-ready **/

$(document).ready(
  function () {
    $("button#example-shower").click(function () {
      $("div#thing-to-toggle").show();
    });
    $("button#example-hider").click(function () {
      $("div#thing-to-toggle").hide();
    });
  });
