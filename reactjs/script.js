String.prototype.trunc = String.prototype.trunc ||
    function(n){
        return (this.length > n) ? this.substr(0, n-1) + '...' : this;
};

// CHECK URL and PORT!
const cur_url = 'http://127.0.0.1:3000';

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

function httpPostAsync(book, url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);

  xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");

  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        callback(xhr.responseText);
      };
  };
  xhr.send(JSON.stringify(book));
}

$(document).ready(function() {

  // Get data from server
    const BOOKS = []
    httpGetAsync(cur_url, function(data) {
      for (const prop in data) {
        let book = JSON.parse(data[prop])
        book.id = prop
        BOOKS.push(book)
      };

      ReactDOM.render(<BookApp />,
        document.getElementById('root')
      );

    });

    class BookRow extends React.Component {
      constructor(props) {
        super(props);
        this.deleteBook = this.deleteBook.bind(this);
        this.state = {visible: true}
      }
      deleteBook() {
        this.setState({visible: false});

        let url = cur_url + "/book/" + this.props.book.id
        httpDeleteAsync(url, function() {});
      }
      render() {
        const book = this.props.book;

        let row = null;

        if (this.state.visible) {
            row = <tr>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{(book.content).trunc(100)}</td>
                    <td><button className="book-del" onClick={this.deleteBook}>Delete</button></td>
                  </tr>
        }
        return row;
      }
    }

    class BookTable extends React.Component {
      render() {
        const rows = [];

        this.props.books.forEach((book) => {

          rows.push(
            <BookRow book={book} key={book.id} />
          );
        });

        return (
          <table className="table">
            <tbody>{rows}</tbody>
          </table>
        );
      }
    }

    class BookAddForm extends React.Component {
      constructor(props) {
        super(props);
        this.state = {'new_book_content': 'Give short book description...'};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      handleChange(e) {
        const name = e.target.name;
        this.setState({[name]: e.target.value});
      }

      handleSubmit(e) {
        //e.preventDefault();
        let book = {'author': this.state.new_book_author, 'title': this.state.new_book_title, 'content': this.state.new_book_content};
        httpPostAsync(book, cur_url, function() {});
      }

      render() {
        return (
          <form onSubmit={this.handleSubmit} method="post">
              <div className="form-group">
                  <label>Author</label>
                  <input type="text" className="form-control" name="new_book_author" onChange={this.handleChange}/>
              </div>
              <div className="form-group">
                  <label>Title</label>
                  <input type="text" className="form-control" name="new_book_title" onChange={this.handleChange}/>
              </div>
             <div className="form-group">
                  <textarea className="form-control" rows="4" name="new_book_content" placeholder={this.state.new_book_content} onChange={this.handleChange}></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Add a new book</button>
          </form>
        )
      }
    }

    class BookApp extends React.Component {
      render() {
        return (
          <div>
            <BookTable books={BOOKS} />
            <BookAddForm />
          </div>
        )
      }
    }

});
