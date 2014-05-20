/** Example:  in-view **/

$(document).ready(function () {

  var url = 'http://www.reddit.com/r/pics/hot.json';

  var page_count = 0;

  function lookup_reddit_hot(row, reddit_after) {
    var data_params = null;
    if (reddit_after) {
      data_params = {'after': reddit_after};
    }
    my_page = ++page_count;

    $.ajax({
      dataType: "json",
      url: url,
      data: data_params,
      success: function (data) {
        create_image_elements(data, row);
        var new_after = data['data']['after'];
        if (new_after) {
          console.log('Adding old:' + reddit_after + ' p:' + my_page + ' a:' + new_after);
          var new_row = $('<div id="reddit_page' + my_page + '" class="in_view_row in_view_loading"></div>');
          new_row.data('reddit_after', new_after);
          new_row.appendTo(row.parent());
        }
      }
    });
  }

  function create_image_elements(data, page) {
    var images = data['data']['children'];
    $.each(images, function () {
      var img_data = this.data;
      var ok = !img_data.over_18 && img_data.url && img_data.thumbnail;
      if (ok) {
        var thumb = img_data.thumbnail;
        if ('default' == thumb)
        {
          thumb = null
        }
        var url = 'http://reddit.com' + img_data.permalink;

        var item = $('<div class="in_view_image"></div>');

        if(thumb) {
          var thumblink = $('<a></a>');
          thumblink.attr('href', img_data.url );
          var thumbimage = $('<img/>');
          thumbimage.attr('src', thumb);
          thumbimage.appendTo(thumblink);
          thumblink.appendTo(item);
        }
        var link = $('<a></a>');
        link.attr('href', url);
        link.text(img_data.title);
        link.appendTo(item);
        item.appendTo(page);
      }
    });
    page.removeClass('in_view_loading');
  }

  var container = $('#in_view_image_container');
  var row = $('<div id="reddit_start" class="in_view_row"></div>');
  row.data('reddit_after', null);
  row.appendTo(container);
  lookup_reddit_hot(row, null);

  container.on('inview', 'div.in_view_row', function (event, isInView, visiblePartX, visiblePartY) {


    if (isInView) {
      var row = $(event.target);
      console.log('inview');
      console.log(row);
      var reddit_after = row.data('reddit_after');
      row.data("reddit_after",'_');
      console.log(reddit_after);
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

});