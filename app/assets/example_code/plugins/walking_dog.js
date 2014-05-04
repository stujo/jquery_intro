/** Example:  walking-dog **/


"use strict";

$.fn.skip_frame_animation = function (config) {

  function animate_frame(animation_container, frame_number, frame_duration, skipped_frames) {
    if (config.debug_log) {
      console.log("Doing Animation :" + frame_number + " dT:" + frame_duration + " skipped:" + skipped_frames);
    }
    return config.frame_callback(config, animation_container, frame_number, frame_duration, skipped_frames);
  }

  function stop_animation(animation_container, config) {
    if (config.debug_log) {
      console.log("Ending animation :" + animation_container.data('running'));
    }
    animation_container.data('running', false);

    if (config.on_complete_callback) {
      if (config.debug_log) {
        console.log("Calling on_complete_callback");
      }
      config.on_complete_callback(config, animation_container);
    }
  }

  function update_status_div(animation_container, config, frame_number, total_skipped) {
    if (config.status_div && config.status_update_frame_count) {
      if (frame_number == 1 || (frame_number % config.status_update_frame_count) == 0) {
        config.status_div.html("<span>Frame #" + frame_number + " <sup>(" + total_skipped + " skipped)</sup></span>");
      }
    }
  }

  function animation_frame_wrapper(me, seq, frame_number, last_frame_time, frame_duration, skipped) {
    if (config.max_frame_count > 0 && frame_number > config.max_frame_count) {
      stop_animation(animation_container, config);
    }

    if (me.data('running') == seq) {
      var current_ms = (new Date()).getTime();

      me.data('frame_number', frame_number);
      var total_skipped = parseInt(me.data('skipped_frames')) + skipped;
      me.data('skipped_frames', total_skipped);

      if (animate_frame(animation_container, frame_number, current_ms - last_frame_time, skipped)) {

        var used_ms = (new Date()).getTime() - current_ms;

        var next_scheduled = frame_duration - used_ms;

        var skip_frames = 0;

        if (next_scheduled < 0) {
          var blank_time = -next_scheduled;
          skip_frames = Math.floor((blank_time) / frame_duration);
          var remainder_used_ms = blank_time % frame_duration;


          frame_number += skip_frames;
          next_scheduled = frame_duration + (frame_duration - remainder_used_ms);
        }

        update_status_div(animation_container, config, frame_number, total_skipped);

        // Always takes a few ms to schedule the event
        next_scheduled -= 2;

        var next_frame_number = frame_number + 1;

        if (config.debug_log) {
          console.log("Rescheduling frame " + next_frame_number + " for " + seq + " in:" + next_scheduled);
        }
        setTimeout(function (event) {
          animation_frame_wrapper(animation_container, seq, next_frame_number, current_ms, frame_duration, skip_frames);
        }, next_scheduled);
      }
      else {
        stop_animation(animation_container, config);
      }
    } else {
      if (config.debug_log) {
        console.log("Exiting animation :" + seq + " (" + me.data('running') + ") frame: " + frame_number);
      }
    }
  }

  function start_animation(animation_container, config) {
    if (animation_container.data('running')) {
      stop_animation(animation_container, config);
    }
    var sequence = Math.floor(Math.random() * 10000);
    animation_container.data('running', sequence);
    animation_container.data('skipped_frames', 0);
    animation_container.data('frame_number', 0);

    var current_ms = (new Date()).getTime();

    if (config.debug_log) {
      console.log("Starting animation " + sequence + " at " + current_ms);
    }
    animation_frame_wrapper(animation_container, sequence, 1, current_ms, config.frame_duration, 0);
  }

  var animation_container = this;

  if (config.initialize) {
    config.initialize(animation_container, config);
  }

  config.restart = function () {
    start_animation(animation_container, config)
  };

  if (config.auto_start) {
    config.restart();
  }

};

$(window).load(
  function () {

    function floatDataWithDefault(jq, key, def_value) {
      var value = parseFloat(jq.data(key));
      if (isNaN(value)) {
        if (typeof(def_value) == 'function') {
          value = def_value(jq, key, def_value);
        }
        else {
          value = def_value;
        }

        jq.data(key, value)
      }
      return value;
    }

    function move_dog(config, playingField, frame_number, frame_duration, skipped_frames) {
      var dogs = playingField.find('img');

      dogs.each(function () {
        var dog = $(this);

        var speed = floatDataWithDefault(dog, 'speed', 5);
        var width_cache = floatDataWithDefault(dog, 'width_cache', function (dog) {
          return dog.outerWidth()
        });

        var inWidth = playingField.innerWidth();

        var current_x = parseFloat(dog.css('left'));

        if (isNaN(current_x)) {
          current_x = 0;
        }

        current_x += speed;


        if (speed > 0) {
          if ((current_x) > (inWidth - width_cache)) {
            current_x = (inWidth - width_cache) - (current_x - (inWidth - width_cache));
            speed = -speed;
            dog.addClass('reflected');
            dog.data('speed', speed);
          }
        }
        else {
          if ((current_x) < 0) {
            current_x = - current_x;
                        speed = -speed;
            dog.removeClass('reflected');
            dog.data('speed', speed);
          }
        }


        dog.css({'position': 'relative', 'left': '' + current_x + 'px'});
      });

      return true;
    }

    var config = {
      auto_start: true,
      frame_duration: 20,
      max_frame_count: -1,
      frame_callback: move_dog,
      status_div: $('#field_status'),
      status_update_frame_count: 10,
      debug_log: false
    };

    $('.playingfield').skip_frame_animation(config);

  }

  // document ready callback
)
;// document ready


