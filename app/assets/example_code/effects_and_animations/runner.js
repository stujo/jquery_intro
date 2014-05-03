$(document).ready(
  function () {

    function floatDataWithDefault(jq, key, def_value) {
      var value = parseFloat(jq.data(key));
      if (isNaN(value)) {
        value = def_value;
        jq.data(key, value)
      }
      return value;
    }

    function isAtVerticalRest(current_y, max_y, delta_y) {
      if (Math.abs(delta_y) < 0.51) {
        var proximity = Math.abs(Math.round(current_y) - Math.round(max_y));
        return (proximity < 0.51);
      }
      return false;
    }


    function calcNextLeftPos(ball, inWidth, inHeight) {
      var delta_x = floatDataWithDefault(ball, 'delta_x', 0);
      var delta_y = floatDataWithDefault(ball, 'delta_y', 0);
      var myWidth = floatDataWithDefault(ball, 'width_cache', ball.outerWidth());
      var myHeight = floatDataWithDefault(ball, 'height_cache', ball.outerHeight());
      var current_x = parseFloat(ball.css('left'));
      var new_x = current_x;

      if (Math.abs(delta_x) > 0.3) {
        var bounce_factor = floatDataWithDefault(ball, 'bounce_factor', 0.9);

        var max_x = (inWidth - myWidth);
        var min_x = 0;
        if (isNaN(current_x)) {
          current_x = 0;
        }


        var current_y = parseFloat(ball.css('top'));
        var max_y = (inHeight - myHeight);
        var friction = isAtVerticalRest(current_y, max_y, delta_y) ? 0.001 : 0.0001;

        var delta_delta_x = delta_x > 0 ? -friction : friction;
        delta_x = delta_x + delta_delta_x;

        new_x = current_x + delta_x;

        if (new_x > max_x) {
          new_x = max_x - (new_x - max_x);
          if (new_x > max_x) {
            new_x = max_x;
          }

          delta_x = -(Math.abs(delta_x) * bounce_factor);
          ball.data('delta_x', delta_x);
        }
        else {
          if (new_x < min_x) {
            new_x = (min_x - new_x);
            if (new_x < min_x) {
              new_x = min_x;
            }

            delta_x = (Math.abs(delta_x) * bounce_factor);
            ball.data('delta_x', delta_x);
          }
        }
        ball.data('delta_x', delta_x);
      }
      else {
        ball.data('delta_x', "0");
      }


      return new_x;
    }

    function calcNextTopPos(ball, inWidth, inHeight) {
      var delta_y = floatDataWithDefault(ball, 'delta_y', 0);
      var current_y = parseFloat(ball.css('top'));
      //var myWidth = floatDataWithDefault(ball, 'width_cache',  ball.outerWidth());
      var myHeight = floatDataWithDefault(ball, 'height_cache', ball.outerHeight());

      var new_y = current_y;
      var max_y = (inHeight - myHeight);

      if (!isAtVerticalRest(current_y, max_y, delta_y)) {
        var bounce_factor = floatDataWithDefault(ball, 'bounce_factor', 0.9);
        var min_y = 0;
        if (isNaN(current_y)) {
          current_y = 0;
        }


        var gravity = 0.05;

        delta_y += gravity;

        new_y = current_y + delta_y;

        if (new_y > max_y) {
          new_y = max_y - (new_y - max_y);

          if (new_y > max_y) {
            new_y = max_y;
          }

          delta_y = -(Math.abs(delta_y) * bounce_factor);
        }
        else {
          if (new_y < min_y) {
            new_y = min_y - new_y;

            if (new_y < min_y) {
              new_y = min_y;
            }

            delta_y = (Math.abs(delta_y));
          }
        }
        ball.data('delta_y', delta_y);
        // ball.html(delta_y);
      }
      else {
        ball.data('delta_y', "0");
      }

      return new_y;
    }

    $(".playingfield").on("examples.explode", function () {
      var playingField = $(this);

      playingField.find('.ball').each(function () {
        var me = $(this);
        me.css({
          position: 'absolute'
        });
        me.data('delta_x', (Math.random() > 0.5 ? -1 : 1) * ((Math.random() * 5) + 10));
        me.data('delta_y', (Math.random() > 0.5 ? -1 : 1) * ((Math.random() * 5) + 10));
        me.addClass("active").removeClass('inactive');
      });

    });


    $(".playingfield").on("examples.next", function (event) {
      var playingField = $(this);
      if (playingField.data['running']) {

        inWidth = playingField.innerWidth();
        inHeight = playingField.innerHeight();

        balls = playingField.find('.ball.active');

        balls.each(function () {
          var ball = $(this);

          var newLeft = calcNextLeftPos(ball, inWidth, inHeight);
          var newTop = calcNextTopPos(ball, inWidth, inHeight);

          if (ball.data('delta_x') == "0" && ball.data('delta_y') == "0") {
            ball.removeClass('active');
            ball.addClass('inactive');
          }
          else {
            ball.css({
              left: '' + newLeft + 'px',
              top: '' + newTop + 'px'
            });
          }
        });

        var frame_timeout = floatDataWithDefault(playingField, 'frame_timeout', 10);
        if (balls.length == 0) {
          playingField.trigger("examples.explode");
        }
        setTimeout(function () {
          playingField.trigger("examples.next");
        }, frame_timeout);
      }
    });

    $("button#example-toggler").click(function () {
      $(".playingfield").data['running'] = !$(".playingfield").data['running'];
      if ($(".playingfield").data['running']) {
        $('.playingfield').trigger("examples.next");
      }
    });

    $("button#example-explode").click(function () {

      if (!$(".playingfield").data['running']) {
        $(".playingfield").data['running'] = true;
        $('.playingfield').trigger("examples.next");
      }

      $('.playingfield').find(".ball").trigger("examples.explode");

    });

    $('.playingfield').trigger("examples.next");
  }
)
;
