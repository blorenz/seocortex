# Python imports
import os
import sys
import datetime
import json

# Constant
dj_path = '/home/seocortex/dropbox/web/projects/joker_api'

# Setup settings
sys.path.append(dj_path)
os.putenv('DJANGO_SETTINGS_MODULE', 'django_project.settings')

# Resty imports
from resty import RestyServer

# Handler imports
from seocortex.joker.resty_handlers.yahoo import YahooHandler



# Server
class JokerServer(RestyServer):
    PORT = 8088
    LISTEN = '0.0.0.0'
    HANDLERS = {'yahoo' : YahooHandler}


def main():
    JokerServer().start()


if __name__ == '__main__' :
    main()
