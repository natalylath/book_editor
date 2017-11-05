from http.server import BaseHTTPRequestHandler, HTTPServer
import ast
import json
import logging

class Book:

    def __init__(self, title='', author='', content=''):
        self.title = title
        self.author = author
        self.content = content

    def __str__(self):
        return "'{0}' by {1} with description: '{2}...'".format(self.title, self.author, self.content)

    def create_from_sql_item(sql_item):
        return Book(sql_item['Title'], sql_item['Author'], sql_item['Content'])


class HTTPGetOutput:
    def __init__(self, response_code, headers, data):
        self.response_code = response_code
        self.headers = headers
        self.data = data

class BookRequestHandler:
    def __init__(self, books_dict):
        self.books_dict = books_dict

    def do_GET_impl(self):
        books_json = {}
        for book_id, book in self.books_dict.items():
            books_json[book_id] = json.dumps(book.__dict__)

        books_json = json.dumps(books_json)
        output = HTTPGetOutput(200, [('Content-type', 'application/json')], bytes(books_json, "utf8"))
        return output


class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.handler_impl = BookRequestHandler(self.books_dict)
        super(testHTTPServer_RequestHandler, self).__init__(*args, **kwargs)

    def set_books(self, books_dict):
        self.books_dict = books_dict

    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        output = self.handler_impl.do_GET_impl()
        self.send_response(output.response_code)
        for header in output.headers:
            self.send_header(*header)
        self.end_headers()
        self.wfile.write(output.data)
        print('Sending GET')
        return


    def do_POST(self):
        self._set_headers()
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        post_data = post_data.decode("utf-8")
        myres = ast.literal_eval(post_data)
        myid = int(myres['id'])
        print('Sending POST')
        for book_id, elem in self.books_dict.items():
            if book_id == myid:
                self.wfile.write(bytes(elem, "utf8"))



