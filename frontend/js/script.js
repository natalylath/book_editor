String.prototype.trunc = String.prototype.trunc ||
    function(n){
        return (this.length > n) ? this.substr(0, n-1) + '&hellip;' : this;
};

const cur_url = 'http://127.0.0.1:8081';

function httpGetAsync(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback(JSON.parse(xhr.response))
        };
    };

    xhr.open('GET', url, true);
    xhr.send();
};

function httpDeleteAsync(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback()
        };
    };

    xhr.open('DELETE', url, true);
    xhr.send();
};

function make_new_book() {
    var book = {author:$('#new_book_author').val(), title:$('#new_book_title').val(), content:$('#new_book_content').val()};
    return book;
}

function httpPostAsync(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          callback(xhr.responseText);
        };
    };
    var book = make_new_book();
    xhr.send(JSON.stringify(book));
};

function my_requests() {
    httpGetAsync(cur_url, function(data) {
        mycontent ='';
        for (i in data) {
            elem = JSON.parse(data[i])
            mycontent = mycontent + '<tr><td>' + elem.author + '</td>' + '<td>' + elem.title + '</td>' + '<td>' + elem.content.trunc(100) + '</td><td><button class="book-del" data-id=' + i + '>Delete</button></td></tr>';
        };
        $("#books_table").html(mycontent);
    });
  

    $('#add_book').click(function() {
        httpPostAsync(cur_url, function() {
        });
    });

    $('#books_table').on('click', '.book-del', function(e) {
        var url = cur_url + "/book/" + $(this).data('id')
        var btn = $(this)
        httpDeleteAsync(url, function(data) {
            btn.closest('tr').remove()
        });
    });
    
}

$(document).ready(function() {
    my_requests();
});