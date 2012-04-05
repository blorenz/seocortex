# Python imports
import json
from urllib import urlencode

# Requests imports
import requests


# Has to be subclassed
class BaseAPIClient(object):
    CALLBACK_URLS = {}
    AVAILABLE_METHODS = ()
    HOST = 'localhost'

    def __init__(self, host = None, port = None, service_name = None):
        self.host = host or getattr(self, 'HOST', None)
        self.port = port or getattr(self, 'PORT', None)
        self.service_name = service_name or getattr(self, 'SERVICE_NAME', '')


    def _build_call_url(self, method_name = None, kwargs = None, callback_url = None):
        callback_url = callback_url or self.CALLBACK_URLS.get('method_name', None)
        if callback_url:
            kwargs['_callback_url'] = callback_url
        format_args = (self.host, self.port, self.service_name, method_name, urlencode(kwargs))
        return "http://%s:%s/%s/%s?%s" % format_args

    def _is_valid_response(self, response):
        return response.ok

    def _parse_response(self, response):
        # Expect JSON as response, if any
        result = None
        try:
            result = json.loads(response.content)
        except Exception as e:
            result= None
        return result

    def __getattr__(self, method_name):
        def func(**kwargs):
            url = self._build_call_url(method_name, kwargs)
            print("URL = %s" % url)
            response = requests.get(url)
            if self._is_valid_response(response):
                return self._parse_response(response)
            return None
        return func