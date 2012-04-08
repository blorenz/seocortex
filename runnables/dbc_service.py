# Gevent imports
from gevent import Greenlet
from gevent import monkey; monkey.patch_all()

# Python imports
import json

# Resty imports
from resty import RestyServer

# Captcha imports
from seocortex.captcha.solver import CaptchaSolver



class OurCaptchaSolver(CaptchaSolver):
    DBC_USERNAME = 'coding.solo'
    DBC_PASSWORD = 'colonel1'



# An example handler
class DBCHandler(object):
    HEADERS = {'Content-Type' : 'text/javascript'}


    def _render(self, request, method, kwargs):
        def dec_to_request(request, method, *args, **kwargs):
            try:
                response = method(*args, **kwargs)
            except Exception as e:
                response = {"status" : "error", "data" : unicode(e)}
            else:
                response = {"status" : "ok", "data" : response}

            data = json.dumps(response)
            request.send_reply_chunk(data)
            print("Sent !")
            request.send_reply_end()

        request.send_reply_start(200, 'OK')
        g = Greenlet.spawn(dec_to_request, request, method, **kwargs)
        print("Spawned !")
        return True


    def solve_url(self, url = None):
        print("[DEBUG] Solving URL = %s" % url)
        if not url:
            raise Exception("No URL provided")
        cs = OurCaptchaSolver()
        result = cs.solve_url(url)
        return result


    def solve_file(self, filename = None):
        cs = OurCaptchaSolver()
        result = cs.solve_file(filename)
        return result



# Server
class DBCServer(RestyServer):
    PORT = 9999
    LISTEN = '0.0.0.0'
    HANDLERS = {'dbc' : DBCHandler}



if __name__ == '__main__' :
    DBCServer().start()
