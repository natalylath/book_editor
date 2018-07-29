define(["jquery", "bookManager"], function($, bookManager) {

    $(function() {

      // CHECK URL and PORT!
      var appConfig = {
        curUrl: 'http://127.0.0.1:3000',
        tableId: "#books_table"
      };

      var currentBookManager = {
        truncContent: bookManager.truncContent,
        makeNewBook: bookManager.makeNewBook,
        updateBook: bookManager.updateBook,
        getContent: bookManager.getContent,
        addBook: bookManager.addBook
      };

      function my_requests() {
          $.ajax({
            type: "GET",
            url: appConfig.curUrl,
            success: function(data) {
              currentBookManager.getContent(data, appConfig.tableId);
            }
          });


          $('#add_book').click(function(e) {
              var newBook = currentBookManager.makeNewBook();
              e.preventDefault();
              $.ajax({
                type: "POST",
                url: appConfig.curUrl,
                data: newBook,
                success: function() {
                  currentBookManager.addBook(newBook, appConfig.tableId);
                }
              });
          });


          $('#updateBook').click(function() {
            var updatedBook = currentBookManager.updateBook();
            $.ajax({
              type: "PUT",
              url: appConfig.curUrl,
              data: updatedBook
            });
          });


          $('#books_table').on('click', '.book-del', function(e) {
              var tr = $(this).closest('tr');
              $.ajax({
                type: "DELETE",
                url: appConfig.curUrl + "/book/" + tr.data('id'),
                success: function() {
                  tr.remove();
                }
              });
          });

      };

      my_requests();


    });

});
