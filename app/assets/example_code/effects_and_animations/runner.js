$(document).ready(
  function () {

    function intDataWithDefault(jq, key, def_value) {
      var value = parseInt(jq.data(key));
      if (isNaN(value)) {
        value = def_value;
        jq.data(key,value)
      }
      return value;
    }


    $("button#example-toggler").click(function () {
      $(".playingfield").data['running'] = !$(".playingfield").data['running'];
      if ($(".playingfield").data['running']) {
        $('.playingfield').trigger("examples.next");
      }
    });

    $(".playingfield .ball").on("examples.baller", function () {

      var me = $(this);

      var delta_x = intDataWithDefault(me, 'delta_x', 1);
      var delta_y = intDataWithDefault(me, 'delta_y', 1);

      var newLeft = parseInt(me.css('left')) + delta_x;
      var newTop = parseInt(me.css('top')) + delta_y;

      if (isNaN(newTop)) {
        newTop = delta_y;
      }

      if (isNaN(newLeft)) {
        newLeft = delta_x;
      }

      var field = me.parent();

      if (newLeft > (field.innerWidth() - me.outerWidth()) || newLeft < 0) {
        delta_x = -delta_x;
        newLeft += (2 * delta_x)
      }

      if (newTop > (field.innerHeight() - me.outerHeight()) || newTop < 0) {
        delta_y = -delta_y;
        newTop += (2 * delta_y);
      }


      $(this).data('delta_y',delta_y);
      $(this).data('delta_x',delta_x);

      $(this).css({
        position: 'absolute',
        left: '' + newLeft + 'px',
        top: '' + newTop + 'px'
      });
    });

    $(".playingfield").on("examples.next", function () {
      if ($(this).data['running']) {
        $(this).find(".ball").trigger("examples.baller");

        var playingField = $(this);
        var frame_timeout = intDataWithDefault(playingField, 'frame_timeout', 100);
        setTimeout(function () {
          playingField.trigger("examples.next");
        }, frame_timeout);
      }
    });

    $('.playingfield').trigger("examples.next");
  });
