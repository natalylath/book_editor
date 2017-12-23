var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var config_db = require('./config_db');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//var dummy_books = {1: '{"title": "The Gentle Parenting Book", "author": "Sarah Ockwell-Smith", "content": "Parenting trends come and go. Gentle parenting is "}', 2: '{"title": "No-Drama Discipline", "author": "Daniel J. Siegel, Tina Payne Bryson", "content": "The pioneering experts behind the bestselling The "}', 3: '{"title": "The Danish Way of Parenting: What the Happiest Peo", "author": "Jessica Joelle Alexander", "content": "What makes Denmark the happiest country in the wor"}', 4: '{"title": "Nighttime Parenting: How to Get Your Baby and Chil", "author": "William Sears", "content": "Parenting is a job that goes on twenty-four hours "}', 5: '{"title": "Brain Rules for Baby (Updated and Expanded): How t", "author": "John Medina", "content": "What\\u2019s the single most important thing you can do "}', 6: '{"title": "Montessori from the Start: The Child at Home, from", "author": "Paula Polk Lillard", "content": "What can parents do to help their youngest childre"}'};

function Book(title, author, content) {
    this.title = title;
    this.author = author;
    this.content = content;
}
Book.prototype.create_from_sql_item = function(sql_item) {
    return new Book(sql_item['title'], sql_item['author'], sql_item['content']);
}

function Book_Manager() {
    this.books = {};
    
    var bm = this;
    var connection = mysql.createConnection(config_db);
    connection.connect(function(err) {
      if (err) throw err
      console.log('You are now connected...');
    });
    connection.query('SELECT id, author, title, content from books', function(err, rows) {
        if(err) {
          throw err;
        } else {
            for (var i in rows) {
                var book_id = rows[i].id;
                bm.books[book_id] = Book.prototype.create_from_sql_item(rows[i])
                bm.books[book_id] = JSON.stringify(bm.books[book_id]) 
            }
        }
    });
    connection.end();
}

var book_manager = new Book_Manager();

app.get('/', function(req, res) {
    res.send(JSON.stringify(book_manager.books));
})

app.delete('/book/:book_id', function (req, res) {
   book_id = req.params.book_id
   delete books[book_id];
   res.end();
})

app.post('/', function (req, res) {
    books[7] = JSON.stringify(req.body)
    res.end();
})









// Start the server
var server = app.listen(3000, function() {
 console.log('Listening on port %d', server.address().port);
});