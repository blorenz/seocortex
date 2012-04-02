# BeautifulSoup imports
from BeautifulSoup import BeautifulSoup

# Local imports
from base import BaseExtractor

##
# Simple BeautifulSoup based outgoing link extractor
##
class Extractor(BaseExtractor):
	def extract(self):
        results = []
        try:
            bs = BeautifulSoup(htmlCode)
        except:
            return results

        # We only want <a>...</a> tags
        links = bs.findAll("a")

        for link in links:
            rel = link.get('rel', '')
            url = link.get('href', '')
            anchor = getattr(link, 'text', '')
            dofollow = bool(rel.find('nofollow') == -1)

            results.append({
                'url' : rel,
                'rel' : rel,
                'text' : text,
                'dofollow' : dofollow
            })

        return results