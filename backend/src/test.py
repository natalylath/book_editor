import simpleserver
from simpleserver import Book
import json

def test_function():
    books_dict = {}
    books_dict[1] = Book('title1','author1','content1')
    books_dict[2] = Book('title2','author2','content2')
    books_dict[3] = Book('title3','author3','content3')

    books_json = {}
    for book_id, book in books_dict.items():
        books_json[book_id] = json.dumps(book.__dict__)

    books_json = json.dumps(books_json)

    my_handler = simpleserver.BookRequestHandler(books_dict)
    output = my_handler.do_GET_impl()
    assert output.response_code == 200
    assert output.headers == [('Content-type', 'application/json')]
    assert output.data == bytes(books_json, "utf8")