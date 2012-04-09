# Gevent imports
from gevent import Greenlet

# Python imports
import json

# Captcha imports
from seocortex.captcha.solver import CaptchaSolver



class OurCaptchaSolver(CaptchaSolver):
    DBC_USERNAME = 'coding.solo'
    DBC_PASSWORD = 'colonel1'



# An example handler
class DBCHandler(object):
    HEADERS = {'Content-Type' : 'application/json'}


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
            print("RESPONSE = %s" % response)
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

 
