# Python imports
from urllib import urlencode
from xml.dom.minidom import parseString


class Suggestor(object):
    name = 'Shopping'

    def build_request(self, keyword):
        params = {
            'sb' : 1,
            'q' : keyword,
        }
        url = "ttp://www.shopping.com/ajaxSearchAssistant?%s" % urlencode(params)


    def parse_response(self, response):
        dom = parseString(response)
        tags = dom.getElementsByTagName('S')
        # Will have to persist keyword request
        keywords = [t.firstChild.nodeValue for t in tags]
        return {keywords[0] : keywords}


if __name__ == '__main__':
    s = Suggestor()
    data = """<?xml version="1.0" encoding="UTF-8"?>

        <response>

        <S>pokemon games</S>

        <S>pokemon toys</S>

        <S>pokemon episodes</S>

        <S>pokemon dolls</S>

        <S>pokemon plush</S>

        <S>pokemon booster box</S>

        <S>pokemon red</S>

        <S>pokemon cards level x</S>

        <S>pokemon level x&#039;s</S>

        <S>pokemon level x</S>

        <S>pokemon cards</S>

        <S>pokemon movies</S>

        </response>
        """
    print s.parse_response(data)
