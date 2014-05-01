/** Example:  password-strength **/

$(document).ready(
  function () {

    $(".password_container :password")
      .on("examples.validatePassword", function () {
        me = $(this);
        pass = me.val();
        message = [];
        if (!/\d/.test(pass)) {
          message.push("Add some digits");
        }
        if (!/[A-Z]/.test(pass)) {
          // Has Capitals
          message.push("Add some CAPITALS");
        }
        if (!/\W/.test(pass)) {
          // Has Non-AlphaNumeric
          message.push("Add a special character");
        }
        if (!(pass.length > 8)) {
          message.push("Make it longer");
        }
        // score between 0 and 4 inclusive
        score = (4 - message.length);
        me.parent('.password_container').removeClass(function (index, css) {
          return (css.match(/\bpass-score-\d+/g) || []).join(' ');
        });
        me.parent('div').addClass('pass-score-' + score);
        me.next('.hinter').text(message.length > 0 ? message[0] : 'Amazing!');

        $("#controlled_button").prop('disabled', (message.length > 0));
      });

    $(".password_container :password").keyup(function () {
      $(this).trigger('examples.validatePassword');
    });

    $(".password_container :password").trigger('examples.validatePassword');

  });
