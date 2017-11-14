from unittest.mock import MagicMock
import simpleserver
from simpleserver import Book
import json
import ast

def test_GET_impl():
    books_dict = {}
    books_dict[1] = Book('title1', 'author1', 'content1')
    books_dict[2] = Book('title2', 'author2', 'content2')
    books_dict[3] = Book('title3', 'author3', 'content3')

    books_json = {}
    for book_id, book in books_dict.items():
        books_json[book_id] = json.dumps(book.__dict__)

    books_json = json.dumps(books_json)

    fake_bm = MagicMock()
    fake_bm.books_dict = books_dict
    my_handler = simpleserver.BookRequestHandler(fake_bm)
    output = my_handler.do_GET_impl()
    assert output.response_code == 200
    assert output.headers == [('Content-type', 'application/json')]
    assert output.data == bytes(books_json, "utf8")


def test_POST_impl():
    client_data_str = '{"title":"titleNew", "author": "NewNew", "content":"no_content"}'
    fake_bm = MagicMock()
    message = 'New book is added!'

    my_handler = simpleserver.BookRequestHandler(fake_bm)
    output = my_handler.do_POST_impl(client_data_str)
    assert output.response_code == 200
    assert output.headers == [('Content-type', 'text/html')]
    assert output.data == bytes(message, "utf8")
