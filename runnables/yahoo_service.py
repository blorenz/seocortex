# Resty imports
from resty import RestyServer

# Handler imports
from seocortex.joker.resty_handlers.yahoo import YahooHandler
from seocortex.joker.resty_handlers.twitter import TwitterHandler
from seocortex.joker.resty_handlers.jokerprofile import JokerProfileHandler
from seocortex.joker.resty_handlers.pinterest import PinterestHandler
from seocortex.joker.resty_handlers.amazon import AmazonHandler


# Server
class JokerServer(RestyServer):
    PORT = 8088
    LISTEN = '0.0.0.0'
    HANDLERS = {
        'yahoo' : YahooHandler,
        'twitter' : TwitterHandler,
        'joker' : JokerProfileHandler,
        'pinterest' : PinterestHandler,
        'amazon' : AmazonHandler,
    }


def main():
    JokerServer().start()


if __name__ == '__main__' :
    # Start MongoEngine
    import mongoengine
    MONGO_ARGS = ('seocortex',)
    mongoengine.connect(*MONGO_ARGS) 

    # Start main
    main()
