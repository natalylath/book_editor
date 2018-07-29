define(["jquery"], function($) {

  var createBookEntry = function(elem) {
    var truncedContent = bookManager.truncContent(elem.content, 100);
    return '<tr data-id=' + i + '><td>' + elem.author + '</td>' + '<td>' + elem.title + '</td>' + '<td>' + truncedContent + '</td><td><button class="book-del">Delete</button></td></tr>';
  };

  var bookManager = {

      truncContent: function(content, n=100) {
          if (content.length < n) {
            return content;
          } else {
            return content.split('').slice(0, n-3).concat('...').join('');
          }
      },

      makeNewBook: function() {
          var book = {author:$('#new_book_author').val(), title:$('#new_book_title').val(), content:$('#new_book_content').val()};
          return book;
      },

      updateBook: function() {
          var book_id = 0;
          var book = {id: book_id, author:'Malina29', title:'Tarabam', content:'No no'};
          return book;
      },

      getContent: function(data, target) {
        var mycontent ='<tbody>';
        data = JSON.parse(data);
        for (i in data) {
            var elem = JSON.parse(data[i]);
            mycontent = mycontent + createBookEntry(elem);
        };
        mycontent = mycontent + '></tbody>';
        $( target ).html(mycontent);
      },

      addBook: function(book, target) {
        var newBook = createBookEntry(book);
        console.log(newBook);
        $( target ).find('tr').last().after(newBook);
      }

    };

    return bookManager;



});
