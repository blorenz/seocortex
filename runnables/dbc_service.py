# Gevent imports
from gevent import Greenlet
from gevent import monkey; monkey.patch_all()

# Resty imports
from resty import RestyServer

# Handler imports
from seocortex.joker.resty_handlers.dbc import DBCHandler


# Server
class DBCServer(RestyServer):
    PORT = 9999
    LISTEN = '0.0.0.0'
    HANDLERS = {'dbc' : DBCHandler}



if __name__ == '__main__' :
    DBCServer().start()
