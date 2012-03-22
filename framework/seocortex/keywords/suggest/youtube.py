# Python imports
from urllib import urlencode
import json

class Suggestor(object):
    name = 'Youtube'


    def build_request(self, keyword):
        params = {
            'client' : 'youtube',
            'hl' : 'en',
            'ds' : 'yt',
            'cp' : '4',
            'gs_id' : 'l',
            'callback' : 'google.sbox.p',
            'q' : keyword,
        }
        url = "http://clients1.google.com/complete/search?%s" % urlencode(params)


    def parse_response(self, response):
        string = response
        offset = string.find('(')
        if offset == -1:
            return {}

        json_raw = string[offset+1:-1]
        data = json.loads(json_raw)

        keyword = data[0]
        results = [result for result, page, number in data[1]]

        return {keyword : results}

if __name__ == '__main__':
    s = Suggestor()
    data = """google.sbox.p0 && google.sbox.p0(["pokemon",[["pokemon",0,"0"],["pokemon black and white",0,"1"],["pokemon theme song",0,"2"],["pokemon in real life",0,"3"],["pokemon black and white episode 1",0,"4"],["pokemon dubstep",0,"5"],["pokemon episode 1",0,"6"],["pokemon in real life 4",0,"7"],["pokemon parody",0,"8"],["pokemon rumble blast",0,"9"]],{"j":"l","k":1}])"""

    print s.parse_response(data)
