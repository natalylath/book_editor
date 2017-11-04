from http.server import BaseHTTPRequestHandler, HTTPServer
import ast
import pymysql.cursors
import json

class Book:

    def __init__(self, title='', author='', content=''):
        self.title = title
        self.author = author
        self.content = content

    def __str__(self):
        return "'{0}' by {1} with description: '{2}...'".format(self.title, self.author, self.content)

    def create_from_sql_item(sql_item):
        return Book(sql_item['Title'], sql_item['Author'], sql_item['Content'])

connection = pymysql.connect(host='192.168.100.2',
    user='user1',
    password='user1',
    db='nataly_test1',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor)

try:

    with connection.cursor() as cursor:
        sql = "SELECT `Id`, `Title`, `Author`, `Content` FROM `books`"
        cursor.execute(sql)
        result = cursor.fetchall()
        data = result
finally:
    connection.close()

books_dict = {}
for item in data:
    book_id = item['Id']
    books_dict[book_id] = Book.create_from_sql_item(item)
    books_dict[book_id] = json.dumps(books_dict[book_id].__dict__)
books_json = json.dumps(books_dict)   

class testHTTPServer_RequestHandler(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(bytes(books_json, "utf8"))
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

        for book_id, elem in books_dict.items():
            if book_id == myid:
                self.wfile.write(bytes(elem, "utf8"))


def run():
    print('Starting server...')
    server_address = ('127.0.0.1', 8081)
    httpd = HTTPServer(server_address, testHTTPServer_RequestHandler)
    httpd.serve_forever()


run()

