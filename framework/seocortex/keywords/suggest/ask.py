# Python imports
from urllib import urlencode, urlopen
import json


class Suggestor(object):
    name = 'Ask'

    def build_request(self, keyword):
        params = {
            'fn' : '',
            'q' : keyword,
            'sstype' : 'prefix',
        }
        url = "http://ss.ask.com/query?%s" % urlencode(params)
        return url


    def parse_response(self, response):
        data = json.loads(response)
        keyword = data[0]
        cleaner = lambda x: x.replace('<span class=\\\"suggest\\\">', '').replace('</span>', '')
        results = [cleaner(r) for r in data[1]]
        return {keyword : results}

if __name__ == '__main__':
    s = Suggestor()
    data = urlopen(s.build_request('pokemon')).read()
    print s.parse_response(data)