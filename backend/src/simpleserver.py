from http.server import BaseHTTPRequestHandler, HTTPServer
import ast
import json
import pymysql.cursors

class Book:
    def __init__(self, title='', author='', content=''):
        self.title = title
        self.author = author
        self.content = content

    def __str__(self):
        return "'{0}' by {1} with description: '{2}...'".format(self.title, self.author, self.content)

    def create_from_sql_item(sql_item):
        return Book(sql_item['Title'], sql_item['Author'], sql_item['Content'])

    def book_to_json(self):
        return json.dumps(self.__dict__)


class Book_Manager:
    def __init__(self, connection):
        self.connection = connection
        self.books_dict = {}
        try:
            with connection.cursor() as cursor:
                sql = "SELECT `Id`, `Title`, `Author`, `Content` FROM `books`"
                cursor.execute(sql)
                result = cursor.fetchall()
                data = result
        finally:
                pass
                #connection.close()
        for item in data:
            book_id = item['Id']
            self.books_dict[book_id] = Book.create_from_sql_item(item)

    def create_book(self, data):
        print('Ready to add new record to db with title', data['title'])
        con = self.connection
        try:
            with con.cursor() as cursor:
                # сделать независимым чтобы при изменении объекта книги не надо было менять менеджера. И надо обновлять books_dict
                sql = "INSERT INTO `books` (`Title`, `Author`, `Content`) VALUES (%s, %s, %s)"
                cursor.execute(sql, (data['title'], data['author'], data['content']))
                con.commit()
        finally:        
            con.close()

    def delete_book(self, id):
        pass

    def update_book(self, data):
        pass


class HTTPOutput:
    def __init__(self, response_code, headers, data):
        self.response_code = response_code
        self.headers = headers
        self.data = data


class HTTPInput:
    def __init__(self, headers, data):
        self.headers = headers
        self.data = data


class BookRequestHandler:
    def __init__(self, books_dict, book_manager):
        self.books_dict = books_dict
        self.book_manager = book_manager

    def do_GET_impl(self):
        books_json = {}
        for book_id, book in self.books_dict.items():
            books_json[book_id] = book.book_to_json()

        books_json = json.dumps(books_json)
        output = HTTPOutput(200, [('Content-type', 'application/json')], bytes(books_json, "utf8"))
        return output

    def do_POST_impl(self, client_data_str):
        client_data_dict = ast.literal_eval(client_data_str)
        self.book_manager.create_book(client_data_dict)
        message = 'New book is added!'
        output = HTTPOutput(200, [('Content-type', 'text/html')], bytes(message, "utf8"))
        return output


class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.handler_impl = BookRequestHandler(self.books_dict, self.book_manager)
        super(testHTTPServer_RequestHandler, self).__init__(*args, **kwargs)

    def set_books(self, books_dict):
        self.books_dict = books_dict

    def set_manager(self, book_manager):
        self.book_manager = book_manager

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
        content_length = int(self.headers['Content-Length'])
        client_data = self.rfile.read(content_length)
        client_data_str = client_data.decode("utf-8")

        output = self.handler_impl.do_POST_impl(client_data_str)
        self.send_response(output.response_code)
        for header in output.headers:
            self.send_header(*header)
        self.end_headers()
        self.wfile.write(output.data)
        print('Sending POST')


