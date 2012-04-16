# Python imports
import json

# Seocortex imports
from seocortex.joker.amazon.feed_extractor import AmazonFeedExtractor


class AmazonHandler(object):
    HEADERS = {'Content-Type' : 'application/json'}
 

    def feed(self, keyword = None, feedtype = 'popular', limit = 20):
        if not keyword:
            return json.dumps({'status' : 'failed'})

        afe = AmazonFeedExtractor()
        items = afe.get_feed(keyword, feedtype, limit)

        return json.dumps(items)