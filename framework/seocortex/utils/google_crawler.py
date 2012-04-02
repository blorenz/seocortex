# Local imports
import proxied_requests as PR

# Beautifulsoup imports
import BeautifulSoup as BeautifulSoup
import soupselect

KNOWN_MODES = frozenset(('search', 'images', 'shopping'))

class GoogleQueryer(object):
    language = 'en'
    base_url = 'http://www.google.com'
    url_format = "%s/%s"
    mode = 'search'
    timeout = 10
    start = 0
    
    def __init__(self, language = None, mode = None):
        self.language = language or self.language
        self.mode = mode or self.mode
    
    
    def build_url(self, query = None):
        return self.url_format % (self.base_url, self.mode)
    
    def build_params(self, query):
        params = {
            'hl' : self.language,
            'q' : query,
            'start' : self.start,
        }
        return params
        
    def get_timeout(self):
        return self.timeout
    
    # next() increments the start result number by 10, effectively paging the results
    def next(self):
        self.start += 10

    def is_response_valid(self):
        return self.response.ok
    
    def fetch(self, query):
        kwargs = {
            'url' : self.build_url(query),
            'params' : self.build_params(query),
            'timeout' : self.get_timeout(),
        }
        self.response = PR.get(**kwargs)
        return self.response.content if self.is_response_valid() else None
        
        
class GoogleSearchParser(object):
    
    def get_total(self, bsobj):
        try:
            text = bsobj.findSelect('#subform_ctrl')[0].children[1].text
            string = text.split()[1]
            string = string.replace(',', '')
            return int(string)
        except:
            return 0
    
    def is_valid_result(self, resultobj):
        # Check if valid
        if resultobj.has_attr('class'):
            return True
        return False
        
    def is_youtube(self, resultobj):
        try:
            if resultobj.children[0].tag == 'h3':
                return True
        except:
            pass
        return False
    
    def parse_response(self, content):
        bsobj = BeautifulSoup.BeautifulSoup(content)
        rs = bsobj.findSelect('li.g')
        
        total = self.get_total(bsobj)
        pages = []
        i = 1
        for result in rs:
            if not self.is_valid_result(result):
                continue
        
            page = {}

            # Skip if not an organic result
            if not result.findSelect('.vsc > h3 a'):
                continue

            t = result.findSelect('.vsc > h3 a')[0]
            d = result.find("div", { "class" : "s" })
            is_youtube = self.is_youtube(result)
            
            # Ignore "bad" results
            if not d:
                continue
            
            title = t.text
            raw_url = t['href']
            # trim tacking applied by google
            raw_url = raw_url.replace('/url?q=', '')
            track = raw_url.find('&sa=')
            if track != -1:
                raw_url = raw_url[:track]

            # Remove http://
            url = raw_url[7:]
            description = d.text
            if is_youtube:
                description = description.split('\n')[1]
            else:
                description = description.split(' - ')[0]
    
            page = {
                'title' : title,
                'description' : description,
                'raw_url' : raw_url,
                'url' : url,
                'total_search_results' : total,
                'rank_in_google' : i + self.start,
            }
            i += 1
            pages.append(page)
        # return :)
        return pages
    
class GoogleSearch(GoogleQueryer, GoogleSearchParser):
    
    def search(self, query):
        content = self.fetch(query)
        if not content:
            return []
        return self.parse_response(content)
