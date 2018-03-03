var express = require('express');
var path = require('path');
var exphbs  = require('express-handlebars');
var mysql = require('mysql');
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Body parser use JSON data

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

/*
var books = {
	book: [
		{"title":"title1", "author":"author1","content":"no content"},
		{"title":"title2", "author":"author2","content":"bla-bla"}
	]
};



app.get('/', function(req, res) {
    res.render('home', books);
})
*/



var books = [];
var book_list = {book: books}

var connection = mysql.createConnection({
  host     : 'mysql',
  port     : '3306',
  user     : 'books_user',
  password : 'books_user',
  database : 'books'
});
connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...');
});
connection.query('SELECT id, author, title, content from books', function(err, rows) {
    if(err) {
      throw err;
    } else {
		for (var i in rows) {
			var book = {'title':rows[i].title, 'author': rows[i].author, 'content': rows[i].content};
			books.push(book);
		};
		
		console.log(book_list)
		console.log(books0)
		app.get('/', function(req, res) {
			res.render('home', book_list);
		})
    }
  });

connection.end();


// this need to mount static files - css, js, images. don't write "static" folder in css path
app.use(express.static('static'))





// Start the server
var server = app.listen(3001, function() {
 console.log('Listening on port %d', server.address().port);
});