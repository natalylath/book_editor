// CHECK URL and PORT!
var appConfig = {
  cur_url: 'http://127.0.0.1:3000'
};

var bookHelper = {
  truncContent: function(content, n=100) {
      if (content.length < n) {
        return content;
      } else {
        return content.split('').slice(0, n-3).concat('...').join('');
      }
  },

  make_new_book: function() {
      var book = {author:$('#new_book_author').val(), title:$('#new_book_title').val(), content:$('#new_book_content').val()};
      return book;
  },

  update_book: function() {
      var book_id = 0;
      var book = {id: book_id, author:'Malina29', title:'Tarabam', content:'No no'};
      return book;
  }
};

function my_requests() {
    $.ajax({
      type: "GET",
      url: appConfig.cur_url,
      success: function(data) {
        var mycontent ='';
        data = JSON.parse(data);
        for (i in data) {
            var elem = JSON.parse(data[i]);
            var truncedContent = bookHelper.truncContent(elem.content, 100);
            mycontent = mycontent + '<tr data-id=' + i + '><td>' + elem.author + '</td>' + '<td>' + elem.title + '</td>' + '<td>' + truncedContent + '</td><td><button class="book-del">Delete</button></td></tr>';
        };
        $("#books_table").html(mycontent);
      }
    });


    $('#add_book').click(function(e) {
        var newBook = bookHelper.make_new_book();
        e.preventDefault();
        $.ajax({
          type: "POST",
          url: appConfig.cur_url,
          data: newBook,
          success: function() {
            console.log('Book is added');
          }
        });
    });

    $('#update_book').click(function() {
      var updatedBook = bookHelper.update_book();
      $.ajax({
        type: "PUT",
        url: appConfig.cur_url,
        data: updatedBook
      });
    });

    $('#books_table').on('click', '.book-del', function(e) {
        var tr = $(this).closest('tr');

        $.ajax({
          type: "DELETE",
          url: appConfig.cur_url + "/book/" + tr.data('id'),
          success: function() {
            tr.remove();
          }
        });

    });

};

$(document).ready(function() {
    my_requests();
});
