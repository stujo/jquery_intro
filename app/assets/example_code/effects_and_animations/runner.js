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
      var delta_x = floatDataWithDefault(ball, 'delta_x', 1);
      var delta_y = floatDataWithDefault(ball, 'delta_yx', 0);
      var myWidth = floatDataWithDefault(ball, 'width_cache',  ball.outerWidth());
      var myHeight = floatDataWithDefault(ball, 'height_cache',  ball.outerHeight());
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
        var friction = isAtVerticalRest(current_y, max_y, delta_y) ? 0.02 : 0.005;

        var delta_delta_x = delta_x > 0 ? -friction : friction;
        delta_x = delta_x + delta_delta_x;

        new_x = current_x + delta_x;

        if (new_x > max_x) {
          new_x = max_x - (new_x - max_x);
          delta_x = -(Math.abs(delta_x) * bounce_factor);
          ball.data('delta_x', delta_x);
        }
        else {
          if (new_x < min_x) {
            new_x = (min_x - new_x);
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
      var delta_y = floatDataWithDefault(ball, 'delta_y', 1);
      var current_y = parseFloat(ball.css('top'));
      //var myWidth = floatDataWithDefault(ball, 'width_cache',  ball.outerWidth());
      var myHeight = floatDataWithDefault(ball, 'height_cache',  ball.outerHeight());

      var new_y = current_y;
      var max_y = (inHeight - myHeight);

      if (!isAtVerticalRest(current_y, max_y, delta_y)) {
        var bounce_factor = floatDataWithDefault(ball, 'bounce_factor', 0.9);
        var min_y = 0;
        if (isNaN(current_y)) {
          current_y = 0;
        }


        var gravity = 0.1;

        delta_y += gravity;

        new_y = current_y + delta_y;

        if (new_y > max_y) {
          new_y = max_y - (new_y - max_y);
          delta_y = -(Math.abs(delta_y) * bounce_factor);
        }
        else {
          if (new_y < min_y) {
            new_y = min_y - new_y;
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
      $(this).find('.ball').each(function () {
        var me = $(this);
        me.data('delta_x', Math.floor((Math.random() * 20) + 1) - 10);
        me.data('delta_y', Math.floor((Math.random() * 20) + 1) - 15);
        me.data('bounce_factor', 0.5 + (Math.random() * 0.5));
        me.addClass("active").removeClass('inactive');
      });
    });


    $(".playingfield").on("examples.baller", function (event, inWidth, inHeight) {

      $(this).find('.ball.active').each(function () {

        var me = $(this);

        var newLeft = calcNextLeftPos(me, inWidth, inHeight);
        var newTop = calcNextTopPos(me, inWidth, inHeight);

        if (me.data('delta_x') == "0" && me.data('delta_y') == "0") {
          me.removeClass('active');
          me.addClass('inactive');
        }

        $(this).css({
          position: 'absolute',
          left: '' + newLeft + 'px',
          top: '' + newTop + 'px'
        });
      });
    });

    $(".playingfield").on("examples.next", function (event) {
      var playingField = $(this);
      if (playingField.data['running']) {

        inWidth = playingField.innerWidth();
        inHeight = playingField.innerHeight();

        balls = playingField.find(".ball.active");

        balls.trigger("examples.baller", [inWidth, inHeight]);

        //console.log(message + ":(" + inWidth + "," + inHeight + ")");
        var frame_timeout = floatDataWithDefault(playingField, 'frame_timeout', 100);
        setTimeout(function () {
          playingField.trigger("examples.next");
        }, frame_timeout);
      }
    });

    $("button#example-toggler").click(function () {
      $(".playingfield").data['running'] = !$(".playingfield").data['running'];
      if ($(".playingfield").data['running']) {
        $('.playingfield').trigger("examples.next", ['toggled']);
      }
    });

    $("button#example-explode").click(function () {

      if (!$(".playingfield").data['running']) {
        $(".playingfield").data['running'] = true;
        $('.playingfield').trigger("examples.next", ['exploded']);
      }

      $('.playingfield').find(".ball").trigger("examples.explode");

    });

    $('.playingfield').trigger("examples.next", ['started']);
  });
