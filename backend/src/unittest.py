import unittest
from unittest.mock import MagicMock
import simpleserver
from simpleserver import Book
import json
import ast

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

def test_response_code():
    return output.response_code

def test_headers():
    return output.headers

def test_data():
    return output.data

class TestGet_impl(unittest.TestCase):
    def test_response_code(self):
        self.assertEqual(test_response_code(), 200)

    def test_headers(self):
        self.assertEqual(test_headers(), [('Content-type', 'application/json')])

    def test_data(self):
       self.assertEqual(test_data(), bytes(books_json, "utf8"))

if __name__ == '__main__':
    unittest.main()