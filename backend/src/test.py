import simpleserver
from simpleserver import Book
import json
import ast

def test_function():
    books_dict = {}
    books_dict[1] = Book('title1', 'author1', 'content1')
    books_dict[2] = Book('title2', 'author2', 'content2')
    books_dict[3] = Book('title3', 'author3', 'content3')

    books_json = {}
    for book_id, book in books_dict.items():
        books_json[book_id] = json.dumps(book.__dict__)

    books_json = json.dumps(books_json)

    my_handler = simpleserver.BookRequestHandler(books_dict)
    output = my_handler.do_GET_impl()
    assert output.response_code == 200
    assert output.headers == [('Content-type', 'application/json')]
    assert output.data == bytes(books_json, "utf8")


def test_function1():
    books_dict = {}
    books_dict[1] = Book('title1', 'author1', 'content1')
    books_dict[2] = Book('title2', 'author2', 'content2')
    books_dict[3] = Book('title3', 'author3', 'content3')

    headers = """
        Host: 127.0.0.1:8081
        Connection: keep-alive
        Content-Length: 10
        Origin: file://
        User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36
        Content-type: application/json
        Accept: */*
        Accept-Encoding: gzip, deflate, br
        Accept-Language: en-GB,en-US;q=0.8,en;q=0.6"""

    client_data_str = '{"id":"1"}'
    client_data_dict = ast.literal_eval(client_data_str)
    received_id = int(client_data_dict['id'])

    book_json = {}
    for book_id, book in books_dict.items():
        if book_id == received_id:
            book_json = json.dumps(book.__dict__)

    my_handler = simpleserver.BookRequestHandler(books_dict)
    output = my_handler.do_POST_impl(client_data_str)
    assert output.response_code == 200
    assert output.headers == [('Content-type', 'application/json')]
    assert output.data == bytes(book_json, "utf8")