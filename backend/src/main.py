from http.server import HTTPServer
import pymysql.cursors
import simpleserver

def MakeHandlerWithBooks(book_manager):
    class HandlerWrapper(simpleserver.testHTTPServer_RequestHandler):
        def __init__(self, *args, **kwargs):    
            self.set_manager(book_manager)
            super(HandlerWrapper, self).__init__(*args, **kwargs)         
    return HandlerWrapper


def run():
    connection = pymysql.connect(host='192.168.100.2',
    user='user1',
    password='user1',
    db='nataly_test1',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor)

    book_manager = simpleserver.Book_Manager(connection)
    print('Starting server...')
    server_address = ('127.0.0.1', 8081)
    HandlerClass = MakeHandlerWithBooks(book_manager)
    httpd = HTTPServer(server_address, HandlerClass)
    httpd.serve_forever()

run()


