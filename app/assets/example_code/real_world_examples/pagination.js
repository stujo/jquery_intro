/** Example:  pagination **/

$(document).ready(function () {

  var default_q = 'stu';

  // Default Search Data
  var github_user_search_url = 'https://api.github.com/search/users';
  var github_pagination_data = {'page': 1, 'per_page': 5 };

  $('#github_q').val(default_q);


  function clear_error() {
    $('#github_error').hide().text('');
  }

  function set_error(message) {
    $('#github_error').text(message).show();
  }

  // From http://stackoverflow.com/questions/7731778/jquery-get-query-string-parameters
  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)",
      regex = new RegExp(regexS),
      results = regex.exec(window.location.href);
    if (results == null) {
      return "";
    } else {
      return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
  }

  function search_params() {
    var data_params = $.extend({}, github_pagination_data);

    var page_number = parseInt(getParameterByName('page'));
    if (!isNaN(page_number)) {
      data_params['page'] = page_number;
    }
    var per_page = parseInt(getParameterByName('per_page'));
    if (!isNaN(per_page)) {
      data_params['per_page'] = per_page;
    }
    var q = getParameterByName('q');
    if (q) {
      data_params['q'] = q;
    }

    return data_params;
  }

  function setup_search(container, url, page_number, q) {
    container.addClass('github_loading');
    var previousSearchSeq = parseInt(container.data('github_search_seq'));
    if (isNaN(previousSearchSeq)) {
      previousSearchSeq = 0;
    }
    var searchSeq = previousSearchSeq + 1;
    container.data('github_search_seq', searchSeq);
    container.data('github_url', url);
    container.data('github_page', page_number);
    container.data('github_q', q);

    var data_params = search_params();
    data_params['q'] = container.data('github_q');
    data_params['page'] = container.data('github_page');

    // Change the URL in the Browser
    history.pushState({}, '', '?' + $.param(data_params));

    return data_params;
  }

  function display_search_results(container, data) {
    $.each(data.items, function () {
      var user_row = $('<div class="github_user"></div>');

      if (this['avatar_url']) {
        var thumbimage = $('<img/>');
        thumbimage.attr('src', this['avatar_url']);
        thumbimage.appendTo(user_row);
      }

      var user_title = $('<h1></h1>');
      user_title.appendTo(user_row);
      var user_link = $('<a></a>');
      user_link.text(this['login']);
      user_link.attr('href', this['html_url']);
      user_link.appendTo(user_title);
      user_title.appendTo(user_row);
      user_row.appendTo(container);
    });
    container.removeClass('github_loading');
  }

  function clear_pagination(pagination) {
    if (pagination.length > 0) {
      pagination.find('.github_pagination_prev').addClass('disabled').data('page', '');
      pagination.find('.github_pagination_current').addClass('disabled').find('a').html('&nbsp;');
      pagination.find('.github_pagination_next').addClass('disabled').data('page', '');
    }
  }

  function update_pagination(pagination, data, page_params) {
    if (pagination.length > 0) {

      var total_count = data.total_count;
      var page_size = page_params.per_page;

      var max_page = total_count / page_size;

      if (page_params.page > 1) {
        pagination.find('.github_pagination_prev').removeClass('disabled').data('page', page_params.page - 1);
      }
      else {
        pagination.find('.github_pagination_prev').addClass('disabled').data('page', '');
      }

      pagination.find('.github_pagination_current').removeClass('disabled').find('a').html(page_params.page);

      if (page_params.page >= max_page) {
        pagination.find('.github_pagination_next').addClass('disabled').data('page', '');
      }
      else {
        pagination.find('.github_pagination_next').removeClass('disabled').data('page', page_params.page + 1);
      }
    }
  }


  function refresh_user_results(container, url, page_number, q) {
    data_params = setup_search(container, url, page_number, q);


    // Break out jsonp setting for clarity and use in handler
    var requestDataType = "jsonp"; // 'json' is another option

    var pagination_div = $('.github_pagination');
    clear_error();
    clear_pagination(pagination_div);
    $.ajax({
      dataType: requestDataType,
      url: url,
      data: data_params,
      error: function (request, status, error) {
        set_error('Unable to retrieve data from ' + url + ' : ' + request.responseJSON.message);
      },
      success: function (data) {
        // Jsonp wraps the data in another level
        var responseData = data;
        if(requestDataType == 'jsonp')
        {
          responseData = data.data;
        }
        display_search_results(container, responseData);
        update_pagination(pagination_div, responseData, data_params);
      }
    });
  }

  //Reset the search
  function init_github_user_search(github_q, page_number) {
    var container = $('#github_pagination_container');
    container.html('');

    if (github_q) {
      refresh_user_results(container, github_user_search_url, page_number, github_q);
    }
  }

  function change_page(page_number) {
    var container = $('#github_pagination_container');
    container.html('');

    var github_q = container.data('github_q');
    var github_user_search_url = container.data('github_url');

    if (github_q) {
      refresh_user_results(container, github_user_search_url, page_number, github_q);
    }
  }

  $('.github_pagination').on('click', 'a', function (event) {
    event.preventDefault();
    var anchor = $(event.target);
    var li = anchor.parent();
    if (!li.hasClass('disabled')) {
      var target_page = parseInt(anchor.parent().data('page'));
      if (!isNaN(target_page) && target_page > 0) {
        change_page(target_page);
      }
    }
  });

  //Install a handler to run the search reset
  $('#github_search').submit(function (e) {
      e.preventDefault();
      clear_error();
      var github_q = $('#github_q').val();
      if (github_q) {
        init_github_user_search(github_q, 1);
      }
      else {
        set_error('Please enter a github username');
      }
    }
  );

  // Run Search if URL Params Are Provided
  var initial_params = search_params();
  if (initial_params['q']) {
    $('#github_q').val(initial_params['q']);
    init_github_user_search(initial_params['q'],initial_params['page']);
  }

});