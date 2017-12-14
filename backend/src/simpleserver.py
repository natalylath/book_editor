from http.server import BaseHTTPRequestHandler, HTTPServer
import ast
import json
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class Book:
    def __init__(self, title='', author='', content=''):
        self.title = title
        self.author = author
        self.content = content

    def __str__(self):
        return "'{0}' by {1} - '{2}...'{3}".format(self.title, self.author, self.content)

    def create_from_sql_item(sql_item):
        return Book(sql_item['title'], sql_item['author'], sql_item['content'])

    def create_from_json_item(json_item):
        return Book(json_item['title'], json_item['author'], json_item['content'])

    def book_to_json(self):
        return json.dumps(self.__dict__)

    def get_sql_names(self=None):
        return '`title`, `author`, `content`'

    def get_sql_names_as_list(self=None):
        return ['`title`', '`author`', '`content`']

    def get_sql_values(self):
        return [self.title, self.author, self.content]

    def get_sql_values_from_json(json_item):
        return [json_item['title'], json_item['author'], json_item['content']]

class Book_Manager:
    def __init__(self, connection):
        self.connection = connection
        self.books_dict = {}
        try:
            with self.connection.cursor() as cursor:
                sql = "SELECT `id`, " + Book.get_sql_names() + "FROM `books`"
                cursor.execute(sql)
                result = cursor.fetchall()
                data = result
        finally:
                pass
                #connection.close()
        for item in data:
            book_id = item['id']
            self.books_dict[book_id] = Book.create_from_sql_item(item)


    def create_book(self, data):
        logger.info('Ready to add a new book to db')
        con = self.connection
        new_book = Book.create_from_json_item(data)
        try:
            with con.cursor() as cursor:
                sql = "INSERT INTO `books`" + " (" + Book.get_sql_names() + ") " + " VALUES (%s, %s, %s); SELECT LAST_INSERT_ID()"
                cursor.execute(sql, (new_book.get_sql_values()))
                con.commit()
                cursor.execute("SELECT LAST_INSERT_ID()")
                next_id_dict = cursor.fetchone()
                next_id = next_id_dict['LAST_INSERT_ID()']
        finally:
            logger.info('Book is added')
            self.books_dict[next_id] = new_book

    def delete_book(self, id):
        logger.info('Ready to delete a book from db')
        con = self.connection
        try:
            with con.cursor() as cursor:
                sql = "DELETE FROM `books`" + " WHERE `id`=%s"
                cursor.execute(sql, (id))
                con.commit()
        finally:
            logger.info('Book is deleted')
            del self.books_dict[id]

    def update_book(self, data):
        con = self.connection
        sql = self.create_update_sql(data)
        try:
            with con.cursor() as cursor:
                cursor.execute(sql)
                con.commit()
            pass
        finally:
            logger.info('Book is updated')
            book_id = int(data['id'])
            self.books_dict[book_id] = Book.create_from_json_item(data)

    def create_update_sql(self, data):
        sql = "UPDATE `books` SET "
        book_id = int(data['id'])
        updated_values = Book.get_sql_values_from_json(data)
        names = Book.get_sql_names_as_list()
        for i in range(len(names)):
            sql = sql + names[i] + "='" + updated_values[i] + "', "
        sql = sql[:-2] + "WHERE `id`=" + str(book_id)
        return sql

class HTTPOutput:
    def __init__(self, response_code, headers, data):
        self.response_code = response_code
        self.headers = headers
        self.data = data

class HTTPOutput1:
    def __init__(self, response_code, headers):
        self.response_code = response_code
        self.headers = headers   


class HTTPInput:
    def __init__(self, headers, data):
        self.headers = headers
        self.data = data


class BookRequestHandler:
    def __init__(self, book_manager):
        self.book_manager = book_manager

    def do_GET_impl(self):
        books_json = {}
        for book_id, book in self.book_manager.books_dict.items():
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

    def do_PUT_impl(self, client_data_str):
        client_data_dict = ast.literal_eval(client_data_str)
        self.book_manager.update_book(client_data_dict)
        message = 'Book is updated!'
        output = HTTPOutput(200, [('Content-type', 'text/html')], bytes(message, "utf8"))
        return output

    def do_DELETE_impl(self, book_id):
        self.book_manager.delete_book(book_id)
        output = HTTPOutput1(200, [('Content-type', 'application/json')])
        return output    


class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.handler_impl = BookRequestHandler(self.book_manager)
        super(testHTTPServer_RequestHandler, self).__init__(*args, **kwargs)

    def set_manager(self, book_manager):
        self.book_manager = book_manager

    def do_GET(self):
        logger.debug(self.path)
        output = self.handler_impl.do_GET_impl()
        self.send_response(output.response_code)
        for header in output.headers:
            self.send_header(*header)
        self.end_headers()
        self.wfile.write(output.data)
        logger.info('Sending GET')
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
        logger.info('Sending POST')

    def do_PUT(self):
        content_length = int(self.headers['Content-Length'])
        client_data = self.rfile.read(content_length)
        client_data_str = client_data.decode("utf-8")

        output = self.handler_impl.do_PUT_impl(client_data_str)
        self.send_response(output.response_code)
        for header in output.headers:
            self.send_header(*header)
        self.end_headers()
        logger.info('Sending PUT')    


    def do_DELETE(self):
        book_id = int(self.path.replace("/book/", ""))
        output = self.handler_impl.do_DELETE_impl(book_id)
        self.send_response(output.response_code)
        for header in output.headers:
            self.send_header(*header)
        self.end_headers()
        logger.info('Performing DELETE')
