from http.server import HTTPServer
import pymysql.cursors
import simpleserver

def MakeHandlerWithBooks(books_dict):
    class HandlerWrapper(simpleserver.testHTTPServer_RequestHandler):
        def __init__(self, *args, **kwargs):    
            self.set_books(books_dict)
            super(HandlerWrapper, self).__init__(*args, **kwargs)         
    return HandlerWrapper


def run():
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
        books_dict[book_id] = simpleserver.Book.create_from_sql_item(item)

    print('Starting server...')
    server_address = ('127.0.0.1', 8081)
    HandlerClass = MakeHandlerWithBooks(books_dict)
    httpd = HTTPServer(server_address, HandlerClass)
    httpd.serve_forever()

run()


