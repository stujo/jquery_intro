/** Example:  password-strength **/

$(document).ready(
  function () {
    $(":password").keyup(function () {
      me = $(this);
      pass = me.val();
      message = [];

      if (!(pass.length > 6)) {
        message.push("Make it longer");
      }

      if (!/[A-Z]/.test(pass)) {
        // Has Capitals
        message.push("Add some CAPITALS");
      }

      if (!/\d/.test(pass)){
        message.push("Add some digits");
      }

      if (!/\W/.test(pass)) {
        // Has Non-AlphaNumeric
        message.push("Add a special character");
      }

      // score between 0 and 4 inclusive
      score = (4 - message.length);

      me.parent('div').removeClass(function (index, css) {
        return (css.match(/\bpass-score-\d+/g) || []).join(' ');
      });

      me.parent('div').addClass('pass-score-' + score);
      me.next('.hinter').text(message.length > 0 ? message[0] : 'Amazing!');
    });
  });
