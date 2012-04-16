# Python imports
import urllib2
from urllib import quote

# Seocortex imports
from seocortex.utils.xml_utils import XMLSerializer

class AmazonFeedExtractor(object): 
    BASE_URL = 'http://www.amazon.com/rss/tag'

    def __init__(self):
        self.items = []


    def get_feed(self, keyword, qtype = None, limit = 20):
        url = self.get_feed_uri(*args, **kwargs)
        data = urllib2.urlopen(url).read()
        return self.parse(data)[:limit]


    def get_feed_uri(self, keyword, qtype = None, limit = 20):
        qtype = 'new' if qtype == 'new' else 'popular'
        return "%s/%s/%s?length=%s" % (self.BASE_URL, quote(keyword), qtype, limit)


    def parse(self, data):
        xs = XMLSerializer()
        dct = xs.from_string(data)
        items = []
        itemnodes = [x['item'] for x in dct['rss'][0]['channel'] if 'item' in x]
        for itemnode in itemnodes:
            parseditem = self.parse_itemnode(itemnode)
            items.append(parseditem)
        return items


    def parse_itemnode(self, node):
        item = {}
        for ndict in node:
            for k,v in ndict.items():
                item[k] = v
        # Clean title and extract category
        paroffset = item['title'].rfind('(')
        eparoffset = item['title'].rfind(')')
        if paroffset and eparoffset:
            item['category'] = item['title'][paroffset+1:eparoffset]
            item['title'] = item['title'][:paroffset-1]
        return item


"""
An item has the following attributes :

title
guid
pubdate
description
category

"""

if __name__ == '__main__':
    afe = AmazonFeedExtractor()
    print(afe.get_feed('fast', limit = 1)[0]['title'])
