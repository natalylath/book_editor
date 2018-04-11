import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Helpers from './helpers';
import Client from './client';

const BOOKS = [];

Client.getBooks(function(data) {
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

    let url = "/api/book/" + this.props.book.id;
    Client.deleteBook(url);
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
    let short_desc = Helpers.truncate(this.props.book.content, 100);
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
    "new_book_content": "Give short book description...",
  };

  handleChange = (e) => {
    const name = e.target.name;
    this.setState({[name]: e.target.value});
  }

  handleSubmit = (e) => {
    let book = {"author": this.state.new_book_author, "title": this.state.new_book_title, "content": this.state.new_book_content};
    Client.createBook(book);
  }

  handleUpdate = (e) => {
    let book = {"id": "1", "author":"Lourence", "title":"Kids and toys", "content":"About toys!!!"};
    Client.updateBook(book);
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
          <p/>
          <button type="submit" className="btn btn-primary">Add a new book</button>
          <p/>
          <button type="button" className="btn btn-primary" onClick={this.handleUpdate}>Update the first book</button>
          <p/>
          <p/>
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
