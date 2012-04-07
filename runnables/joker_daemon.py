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

# Django imports
from django.core import serializers

# Resty imports
from resty import RestyServer

# Yahoo imports
from seocortex.joker.yahoo.models import YahooAccount


# Utility function
def to_json(data):
    return serializers.serialize("json", data)

def from_json(json_string):
    return serializers.deserialize("json", json_string)


# An example handler
class YahooHandler(object):
    HEADERS = {'Content-Type' : 'text/javascript'}


    def list(self):
        data = serializers.serialize("json", YahooAccount.objects.all())
        return data

    def add(self, jsondata = None):

        if not jsondata:
            return json.dumps({"status" : "failed", "error" : "nodata"})

        # deserialize
        d = json.loads(jsondata)

        try:
            account = YahooAccount()
            account.first = d['firstname']
            account.last = d['lastname']
            account.yahooid = d['yahooid']
            account.password = d['password']
            account.secret1 = d['secret1']
            account.secret2 = d['secret2']
            account.postalcode = d['postalcode']
            account.birthday = datetime.date(d['birthyear'], d['birthmonth'], d['birthday'])
            account.save()
        except Exception as e:
            return json.dumps({"status" : "failed", "error" : unicode(e)})

        return json.dumps({"status" : "success"})

# Server
class JokerServer(RestyServer):
    PORT = 8088
    LISTEN = '0.0.0.0'
    HANDLERS = {'yahoo' : YahooHandler}



def main():
    JokerServer().start()


if __name__ == '__main__' :
    main()
