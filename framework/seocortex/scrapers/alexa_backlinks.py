# Python imports
from BeautifulSoup import BeautifulSoup
import urllib

# Utils import
from seocortex.utils import soupselect

class AlexaBacklink(object):
    def __init__(self, url):
        self.url = url

    @property
    def raw_url(self):
        return "http://%s" % self.url

    @property
    def domain(self):
        return self.url.split('/')[0]

    @property
    def root_domain(self):
        return '.'.join(self.domain.split('.')[-2:])

    def __unicode__(self):
        return self.url

class AlexaBacklinksUrlGen(object):
    MAX_PAGES = 10000

    def __init__(self, domain, start_page = 0):
        self.domain = domain
        self.current_page = start_page
        self.start_page = start_page

    def url_for(self, page_index):
        return "http://www.alexa.com/site/linksin;%d/%s" % (page_index, self.domain)

    def url_generator(self, limit = None):
        limit = limit or self.MAX_PAGES
        while self.current_page < limit:
            yield self.url_for(self.current_page)
            self.current_page += 1

class AlexaBacklinksParser(object):
    def parse(self, content):
        results = []
        document = BeautifulSoup(content)
        if not document:
            return []
        for entry in document.findSelect('ol > li p'):
            url = entry.text
            abl = AlexaBacklink(url)
            results.append(abl)
        return results

class AlexaBacklinkScraper(AlexaBacklinksParser, AlexaBacklinksUrlGen):
    # TODO: Create ability to pull from arbitrary indexes and ranges.  i.e. Get backlinks from pages 10000..12000
    def scrape(self, limit = None):
        limit = limit or self.MAX_PAGES
        for url in self.url_generator(limit):
            # fetch data
            ufd = urllib.urlopen(url)
            content = ufd.read()
            res = self.parse(content)
            if not res:
                break
            yield res


if __name__ == '__main__':
    domain= 'facebook.com'
    scraper = AlexaBacklinkScraper(domain)
    backlinks = [b for s in scraper.scrape(1000) for b in s]
    print("Got %d backlinks for %s" % (len(backlinks), domain))
