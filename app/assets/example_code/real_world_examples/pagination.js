/** Example:  pagination **/

$(document).ready(function () {

  var default_q = 'stu';

  // Default Search Data
  var github_user_search_url = 'https://api.github.com/search/users';
  var github_pagination_data = {'q': default_q, 'page': 1, 'per_page': 5 };

  $('#github_q').val(default_q);


  function clear_error() {
    $('#github_error').hide().text('');
  }

  function set_error(message) {
    $('#github_error').text(message).show();
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
    var data_params = $.extend({}, github_pagination_data);
    data_params['q'] = container.data('github_q');
    data_params['page'] = container.data('github_page');
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

    clear_error();
    $.ajax({
      dataType: "json",
      url: url,
      data: data_params,
      error: function (request, status, error) {
        set_error('Unable to retrieve data from ' + url + ' : ' + request.responseJSON.message);
      },
      success: function (data) {
        display_search_results(container, data);
        update_pagination($('.github_pagination'), data, data_params);
      }
    });
  }

  //Reset the search
  function init_github_user_search(github_q) {
    var container = $('#github_pagination_container');
    container.html('');

    if (github_q) {
      refresh_user_results(container, github_user_search_url, 1, github_q);
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
        init_github_user_search(github_q);
      }
      else {
        set_error('Please enter a github username');
      }
    }
  );
});