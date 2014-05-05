/** Example:  life **/

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


  config.restart = function () {
    if (config.initialize) {
      config.initialize(animation_container, config);
    }
    start_animation(animation_container, config)
  };

  if (config.auto_start) {
    config.restart();
  }

};

$(window).load(
  function () {


    function life_age(config, animation_container, frame_number, frame_duration, skipped_frames) {

      var nodes = animation_container.data('nodes');

      var wave_column = parseInt(animation_container.data('wave_column'));

      if (!isNaN(wave_column) && wave_column >= 0 && wave_column < config.life.columns) {
        for (var y = 0; y < config.life.rows; y += Math.floor((Math.random() * 3) + 1)) {
          var node = nodes[wave_column][y];
          node.alive = !node.alive;
        }
        animation_container.data('wave_column', wave_column + 1);
      }

      for (var y = 0; y
        < config.life.rows; y++) {
        for (var x = 0; x < config.life.columns; x++) {
          var aliveNeighbors = 0;
          var node = nodes[x][y];

          node.alive_next = false;

          for (var n = 0; n < 8; n++) {
            if (node.neighbors[n].alive) {
              aliveNeighbors++;
            }
          }

          if (node.alive) {
            if (aliveNeighbors == 3 || aliveNeighbors == 2) {
              node.alive_next = true;
            }
          }
          else {
            if (aliveNeighbors == 3) {
              node.alive_next = true;
            }
          }
        }
      }

      var changedOtherThanRecent = 0;

      for (var y = 0; y
        < config.life.rows; y++) {
        for (var x = 0; x < config.life.columns; x++) {
          var node = nodes[x][y];

          if (node.alive_next) {
            if (!node.alive && !node.alive_last) {
              changedOtherThanRecent++;
            }
          }
          else {
            if (node.alive && node.alive_last) {
              changedOtherThanRecent++;
            }
          }

          node.alive_last = node.alive;
          node.alive = node.alive_next;

          node.cell.removeClass('memorial_count_' + node.memorial_count);

          if (node.alive) {
            node.memorial_count = 0;
            node.cell.addClass('alive');
            node.cell.removeClass('dead');
            node.cell.css({ opacity: 1 });
          }
          else {
            if (node.alive_last) {
              node.died = frame_number;
              node.memorial_count = 1;
              node.cell.addClass('dead');
              node.cell.removeClass('alive');
            }

            var died_ago = (frame_number - node.died);

            var fade_age = 40;

            if (died_ago > fade_age) {
              node.cell.css({ opacity: '' });
            }
            else if (died_ago == 0) {
              node.cell.css({ opacity: 1 });
            }
            else { // 1 .. 20
              var opacity = 1 - (died_ago / parseFloat(fade_age));
              node.cell.css({ opacity: opacity });
            }
          }
        }
      }

      if (changedOtherThanRecent == 0) {
        var still_frames = parseInt(animation_container.data('still_frames'));
        if (isNaN(still_frames)) {
          still_frames = 0;
        }
        still_frames++;

        if (still_frames > 40) {
          animation_container.data('wave_column', 1);
          animation_container.data('still_frames', 0);
        }
        else {
          animation_container.data('still_frames', still_frames);

        }
      }

      return true;
    }

    function create_multi_dimensional_array(length) {
      var arr = new Array(length || 0),
        i = length;

      if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = create_multi_dimensional_array.apply(this, args);
      }

      return arr;
    }

    function life_setup(animation_container, config) {

      var fieldHeight = animation_container.innerHeight();
      var fieldWidth = animation_container.innerWidth();

      config.life.columns  =  parseInt(fieldWidth / config.life.cell_size);
      config.life.rows  =  parseInt(fieldHeight / config.life.cell_size);



      var nodes = create_multi_dimensional_array(config.life.columns, config.life.rows);

      var table = $('<table></table>');
      for (var y = 0; y < config.life.rows; y++) {
        var row = $('<tr></tr>');
        for (var x = 0; x < config.life.columns; x++) {
          var cell = $('<td>&nbsp;</td>');
          cell.addClass('cell');
          cell.data('x', x);
          cell.data('y', y);
          var node = {alive: (Math.random() <= config.life.density)};
          if (node.alive) {
            cell.addClass('alive');
          }
          else {
            cell.addClass('dead');
          }
          cell.appendTo(row);
          node['cell'] = cell;
          nodes[x][y] = node;
        }
        row.appendTo(table);
      }
      animation_container.html('');


      var divHeight = animation_container.height();
      table.css("height", divHeight + "px");

      table.appendTo(animation_container);

      for (var y = 0; y < config.life.rows; y++) {
        for (var x = 0; x < config.life.columns; x++) {
          var neighbors = new Array(8);
          var left = (x == 0) ? (config.life.columns - 1) : x - 1;
          var right = (x == (config.life.columns - 1)) ? 0 : x + 1;
          var up = (y == 0) ? (config.life.rows - 1) : y - 1;
          var down = (y == (config.life.rows - 1)) ? 0 : y + 1;

          neighbors[0] = nodes[left][up];
          neighbors[1] = nodes[x][up];
          neighbors[2] = nodes[right][up];
          neighbors[3] = nodes[left][y];
          neighbors[4] = nodes[right][y];
          neighbors[5] = nodes[left][down];
          neighbors[6] = nodes[x][down];
          neighbors[7] = nodes[right][down];
          nodes[x][y].neighbors = neighbors;
        }
      }

      animation_container.data('nodes', nodes);

      animation_container.on('mouseover', 'td.cell', function (event) {
        var nodes = animation_container.data('nodes');

        var cell = $(event.target);

        x = cell.data('x');
        y = cell.data('y');

        nodes[x][y].alive = true;

      });
    }

    function life_complete(config, animation_container) {
      animation_container.off('mouseover');
      console.log('life_complete');
      config.status_div.html("<b>Complete!</b>");
    }

    var config = {
      auto_start: true,
      life: {
        cell_size: 15,
        density: 0.2
      },
      frame_duration: 17,
      max_frame_count: -1,
      initialize: life_setup,
      frame_callback: life_age,
      on_complete_callback: life_complete,
      status_div: $('#field_status'),

      status_update_frame_count: 10,
      debug_log: false
    };

    $("button#example-restart").click(function () {
      config.restart();
    });

    $('.playingfield').skip_frame_animation(config);

  }

// document ready callback
)
;// document ready


