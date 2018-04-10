import React, { Component } from 'react';
import ReactDOM from 'react-dom';

function truncate(string, length) {
  if (string.length > length) {
    return string.slice(0, length) + '...';
  } else {
    return string;
  }
};


/* Fetch function instead of XMLHttpRequest */
function getBooks(success) {
  return fetch('/api/', {
    headers: {
      Accept: 'application/json',
    },
  }).then(checkStatus)
    .then(parseJSON)
    .then(success);
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error);
    throw error;
  }
};

function parseJSON(response) {
  return response.json();
};

function deleteBook(url) {
  return fetch(url, {
    method: 'delete',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(checkStatus);
};

function createBook(data) {
  return fetch('/api/', {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(checkStatus);
};

function updateBook(data) {
  return fetch('/api/', {
    method: 'put',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(checkStatus);
};


const BOOKS = [];

getBooks(function(data) {
  for (const prop in data) {
    let book = JSON.parse(data[prop])
    book.id = prop
    BOOKS.push(book)
  };

  ReactDOM.render(<App/>,
    document.getElementById('root')
  );

});


class BookTable extends React.Component {
  render() {

    const rowComponents = this.props.books.map((book) => (
      <BookRow book={book} key={book.id} />
    ));

    return (
      <table className="table">
        <tbody>{rowComponents}</tbody>
      </table>
    );
  }
};

class BookRow extends React.Component {
  state = {
    visible: true,
  };

  deleteBookHandle = () => {
    this.setState({visible: false});

    let url = "/api/book/" + this.props.book.id
    deleteBook(url);
  };

  render() {
      if (this.state.visible) {
        return (
          <BookRowContent
            book={this.props.book}
            deleteBook={this.deleteBookHandle}
          />
        );
      }
       else return null;
  }
}


class BookRowContent extends React.Component {
  render() {
    let short_desc = truncate(this.props.book.content, 100);
    return (
      <tr>
          <td>{this.props.book.title}</td>
          <td>{this.props.book.author}</td>
          <td>{short_desc}</td>
          <td><button className="book-del" onClick={this.props.deleteBook}>Delete</button></td>
      </tr>
    );
  }
}



class BookAddForm extends React.Component {

  state = {
    'new_book_content': 'Give short book description...',
  };

  handleChange = (e) => {
    const name = e.target.name;
    this.setState({[name]: e.target.value});
  }

  handleSubmit = (e) => {
    //e.preventDefault();
    let book = {'author': this.state.new_book_author, 'title': this.state.new_book_title, 'content': this.state.new_book_content};
    createBook(book);
  }

  updateBook = (e) => {
    let book_id = 6;
    let book = {'id': book_id, 'author':'Malina22', 'title':'Tarabam', 'content':'No no'};
    updateBook(book);
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
          <p/>
          <button className="btn btn-primary" onClick={this.updateBook}>Update the 7th book</button>
      </form>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <BookTable books={BOOKS} />
        <BookAddForm />
      </div>
    )
  }
}



export default App;
