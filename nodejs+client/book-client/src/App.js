import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Helpers from './helpers';
import Client from './client';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch,
} from 'react-router-dom';

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
    'new_book_author':'',
    'new_book_title':'',
    'new_book_content':'',
  };

  handleChange = (e) => {
    const name = e.target.name;
    this.setState({[name]: e.target.value});
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let book = {"author": this.state.new_book_author, "title": this.state.new_book_title, "content": this.state.new_book_content};
    this.setState({'new_book_author':'', 'new_book_title':'','new_book_content':''});
    this.props.handleSubmitClick(book);
    Client.createBook(book);
  }

  handleUpdate = (e) => {
    let book = {"id": "1", "author":"Mary Jane", "title":"Kids and toys", "content":"***"};
    this.props.handleUpdateClick(book);
    Client.updateBook(book);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} method="post">
          <div className="form-group">
              <label>Author</label>
              <input type="text" className="form-control" name="new_book_author" onChange={this.handleChange} value={this.state.new_book_author}/>
          </div>
          <div className="form-group">
              <label>Title</label>
              <input type="text" className="form-control" name="new_book_title" onChange={this.handleChange} value={this.state.new_book_title}/>
          </div>
         <div className="form-group">
              <textarea className="form-control" rows="4" name="new_book_content" placeholder={this.state.new_book_content} onChange={this.handleChange} value={this.state.new_book_content}></textarea>
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

class BooksDashboard extends React.Component {

  state = {
    books: []
  }

  componentDidMount() {
    Client.getBooks((data) => {
      let BOOKS = [];
      for (const prop in data) {
        let book = JSON.parse(data[prop])
        book.id = prop
        BOOKS.push(book)
      };
      this.setState({ books: BOOKS });
    });
  }

  handleSubmitClick = ((data) => {
    let l = this.state.books.length;
    let last_book = this.state.books[l-1];
    let new_id = parseInt(last_book.id) + 1;
    const b = Helpers.newBook(new_id, data);
    this.setState({
      books: this.state.books.concat(b),
    });
  });

  handleUpdateClick = ((data) => {
    this.setState({
      books: this.state.books.map((book) => {
        if (book.id === data.id) {
          return Object.assign({}, book, {
            title: data.title,
            author: data.author,
            content: data.content
          });
        } else {
          return book;
        }
      }),
    });
  });

  render() {
    return (
        <div>
          <h1>Book List</h1>
          <BookTable books={this.state.books}/>
          <BookAddForm handleSubmitClick={this.handleSubmitClick} handleUpdateClick={this.handleUpdateClick} />
        </div>
    )
  }
}


class App extends React.Component {

  render() {
    return (
      <Router>
        <div>
          <p></p>
          <ul style={{overflow: "hidden"}}>
            <li style={{float: "left", marginRight: "40px"}}><Link to="/account">My Account</Link></li>
            <li style={{float: "left", marginRight: "40px"}}><Link to="/library">My Library</Link></li>
          </ul>

          <Switch>
            <Route path='/account' component={Account} />
            <Route path='/library' component={MyLibrary} />
            <Route exact path='/' component={BooksDashboard} />
            <Route render={({ location }) => (
              <div>
                <h4>Error! No matches for {location.pathname}</h4>
                <p><Link exact="true" to="/">Back</Link></p>
              </div>
            )} />
          </Switch>

        </div>
      </Router>
    )
  }
}

const Account = () => (
  <div>
    <h3>Account</h3>
    <p>
      TBD
    </p>
    <p><Link exact="true" to="/">Back</Link></p>
  </div>
);

const MyLibrary = () => (
  <div>
    <h3>My library</h3>
    <p>
      TBD
    </p>
    <p><Link exact="true" to="/">Back</Link></p>
  </div>
);


export default App;
