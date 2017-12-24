var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var config_db = require('./config_db');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var books = {1: '{"title": "The Gentle Parenting Book", "author": "Sarah Ockwell-Smith", "content": "Parenting trends come and go. Gentle parenting is "}', 2: '{"title": "No-Drama Discipline", "author": "Daniel J. Siegel, Tina Payne Bryson", "content": "The pioneering experts behind the bestselling The "}', 3: '{"title": "The Danish Way of Parenting: What the Happiest Peo", "author": "Jessica Joelle Alexander", "content": "What makes Denmark the happiest country in the wor"}', 4: '{"title": "Nighttime Parenting: How to Get Your Baby and Chil", "author": "William Sears", "content": "Parenting is a job that goes on twenty-four hours "}', 5: '{"title": "Brain Rules for Baby (Updated and Expanded): How t", "author": "John Medina", "content": "What\\u2019s the single most important thing you can do "}', 6: '{"title": "Montessori from the Start: The Child at Home, from", "author": "Paula Polk Lillard", "content": "What can parents do to help their youngest childre"}'};

function Book(title, author, content) {
    this.title = title;
    this.author = author;
    this.content = content;
}
Book.prototype.create_from_sql_item = function(sql_item) {
    return new Book(sql_item['title'], sql_item['author'], sql_item['content']);
}
Book.prototype.create_from_json_item = function(json_item) {
    return new Book(json_item['title'], json_item['author'], json_item['content']);
}
Book.prototype.get_sql_values = function() {
    return [this.title, this.author, this.content];
}
Book.prototype.get_sql_values_from_json = function(json_item) {
    return [json_item['title'], json_item['author'], json_item['content']]
}
Book.prototype.get_sql_names = function() {
    return '(title, author, content)'
}
Book.prototype.get_sql_names_as_list = function() {
    return ['title', 'author', 'content']
}


function Book_Manager(connection) {
    this.books = {};
    this.connection = connection;
    
    var book_man = this;
    this.connection.query('SELECT id, author, title, content from books', function(err, rows) {
        if(err) {
            book_man.connection.end();
            throw err;
        } else {
            for (var i in rows) {
                var book_id = rows[i].id;
                book_man.books[book_id] = Book.prototype.create_from_sql_item(rows[i]) 
            }
        }
    });

}

Book_Manager.prototype.delete_book = function(id) {
    var book_man = this;

    this.connection.query('DELETE from books WHERE id=?', id, function(err, rows) {
        if(err) {
            book_man.connection.end();
            throw err;
        } else {
            delete book_man.books[book_id];
            console.log('Book is deleted.')
        }
    });
    
}

Book_Manager.prototype.create_book = function(data) {
    var book_man = this;
    var new_book = Book.prototype.create_from_json_item(data)
    this.connection.query('INSERT INTO books '+ Book.prototype.get_sql_names() +' VALUES (?, ?, ?)', new_book.get_sql_values(), function(err, rows) {
        if(err) {
            book_man.connection.end();
            throw err;
        } else {
            book_man.connection.query('SELECT LAST_INSERT_ID()', function(err, rows) {
                next_id_raw = rows[0];
                next_id = next_id_raw['LAST_INSERT_ID()'];
                book_man.books[next_id] = new_book;
                console.log('Book is added.')
            })
        }
    });
    
}

Book_Manager.prototype.update_book = function(data) {
    var book_man = this;
    var sql = create_update_sql(data)
    this.connection.query(sql, function(err, rows) {
        if(err) {
            book_man.connection.end();
            throw err;
        } else {
            var book_id = data['id']
            book_man.books[book_id] = Book.prototype.create_from_json_item(data)
        }
    });

    function create_update_sql(data) {
        var book_id = data['id']
        var updated_values = Book.prototype.get_sql_values_from_json(data)
        var names = Book.prototype.get_sql_names_as_list()
        var sql = 'UPDATE books SET '
        for (var i in names) {
            sql = sql + names[i] + "='" + updated_values[i] + "', "
        }     
        sql = sql.slice(0, -2) + " WHERE id=" + book_id
        return sql
    }
    
}

var conn = mysql.createConnection(config_db);
conn.connect(function(err) {
    if (err) throw err
    console.log('You are now connected...');
});
var book_manager = new Book_Manager(conn);

app.get('/', function(req, res) {
    var books_json = {}
    for (book_id in book_manager.books) {
        books_json[book_id] = JSON.stringify(book_manager.books[book_id])
    }
    res.send(JSON.stringify(books_json));
});

function delete_func(req, res) {
    book_id = req.params.book_id;
    book_manager.delete_book(book_id);
    res.end();
}

app.delete('/book/:book_id', delete_func)

function post_func(req, res) {
    book_manager.create_book(req.body);
    res.end();
}

app.post('/', post_func);

function put_func(req, res) {
    book_manager.update_book(req.body);
    res.end();
}

app.put('/', put_func)

//connection.end();

// Start the server
var server = app.listen(3000, function() {
 console.log('Listening on port %d', server.address().port);
});