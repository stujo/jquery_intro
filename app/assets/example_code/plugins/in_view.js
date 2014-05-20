/** Example:  in-view **/

$(document).ready(function () {

  var page_count = 0;

  //Reset the infinite search
  function init_reddit_hot() {
    var reddit = $('#reddit').val();
    var container = $('#in_view_image_container');
    container.html('');

    if (reddit) {
      var url = 'http://www.reddit.com/r/' + reddit + '/hot.json';
      container.data('reddit_url', url);
      var row = $('<div id="reddit_start" class="in_view_row"></div>');
      row.data('reddit_after', null);
      row.appendTo(container);
      lookup_reddit_hot(row, null);
    }
  }

  //Install a handler to run the search reset
  $('#reddit_search').submit(function (e) {
      e.preventDefault();
      init_reddit_hot();
    }
  );

  //Handle inview events to support loading the reddits when they come in to view
  $('#in_view_image_container').on('inview', 'div.in_view_row', function (event, isInView, visiblePartX, visiblePartY) {
    if (isInView) {
      var row = $(event.target);
      var reddit_after = row.data('reddit_after');
      row.data("reddit_after", '_');
      if (reddit_after && '_' != reddit_after) {
        lookup_reddit_hot(row, reddit_after);
      }
      if (visiblePartY == 'top') {
        // top part of element is visible
      } else if (visiblePartY == 'bottom') {
        // bottom part of element is visible
      } else {
        // whole part of element is visible
      }
    } else {
      // element has gone out of viewport
    }
  });

  // Ajax Request the next page
  function lookup_reddit_hot(page_div, reddit_after) {
    var data_params = null;
    if (reddit_after) {
      data_params = {'after': reddit_after};
    }
    my_page = ++page_count;

    var my_url = page_div.parent().data('reddit_url');

    if (my_url) {
      console.log('Searching for ' + my_url);
      $.ajax({
        dataType: "json",
        url: my_url,
        data: data_params,
        success: function (data) {
          var completed_page_div = create_image_elements(data, page_div);
          if (completed_page_div.length == 1) {
            var new_after = data['data']['after'];
            if (new_after) {
              var next_page_div = $('<div id="reddit_page' + my_page + '" class="in_view_row in_view_loading"></div>');
              next_page_div.data('reddit_after', new_after);
              next_page_div.appendTo(completed_page_div.parent());
            }
          }
        }
      });
    }
  }

  // Process the results into HTML
  function create_image_elements(data, page) {
    var images = data['data']['children'];

    var out_of_dom_page = page.clone(false);
    var images_added = 0;

    $.each(images, function () {
      var img_data = this.data;
      var ok = !!img_data.url;
      if (ok) {

        var censored = img_data.over_18;

        var thumb = img_data.thumbnail;
        if ('default' == thumb) {
          thumb = null
        }
        if ('nsfw' == thumb) {
          thumb = null
        }
        if ('self' == thumb) {
          thumb = null;
        }
        var url = 'http://reddit.com' + img_data.permalink;

        var item = $('<div class="in_view_image' + (censored ? ' in_view_censored' : '') + '"></div>');

        if (thumb) {
          var thumblink = $('<a></a>');
          thumblink.attr('href', img_data.url);
          var thumbimage = $('<img/>');
          thumbimage.attr('src', thumb);
          thumbimage.appendTo(thumblink);
          thumblink.appendTo(item);
        }
        var link = $('<a></a>');
        link.attr('href', url);
        link.text(img_data.title);
        link.appendTo(item);
        item.appendTo(out_of_dom_page);
        images_added++;
      }
    });

    if (images_added > 0) {
      out_of_dom_page.removeClass('in_view_loading');
      $(page).before(out_of_dom_page);
      page.remove();
      return out_of_dom_page;
    }
    else {
      page.remove();
      return out_of_dom_page;
    }
  }

});