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


$(document).ready(function() {

  // Get data from server
    const BOOKS = []
    httpGetAsync(cur_url, function(data) {
      for (const prop in data) {
        BOOKS.push(JSON.parse(data[prop]))
      };

      ReactDOM.render(
        <BookTable books={BOOKS} />,
        document.getElementById('root')
      );

    });

    class BookRow extends React.Component {
      render() {
        const book = this.props.book;

        return (
          <tr>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{(book.content).trunc(100)}</td>
          </tr>
        );
      }
    }

    class BookTable extends React.Component {
      render() {
        const rows = [];

        this.props.books.forEach((book) => {

          rows.push(
            <BookRow book={book} key={book.title} />
          );
        });

        return (
          <table className="table">
            <tbody>{rows}</tbody>
          </table>
        );
      }
    }

});
