# Python imports

# Utils imports
from seocortex.utils.google_crawler import GoogleSearch


class BaseHarvestor(object):
    footprints = []
    supported_engines = []

    def __init__(self, footprints = []):
        footprints.extend(self.footprints)
        self.current_footprints = footprints
        self.results = {}

    def harvest(self, keyword, DEBUG=False):
        for engine in self.supported_engines:
            builder_name = "%s_query" % engine
            runner_name = "%s_run" % engine
            parser_name = "%s_parse" % engine
            query_builder = getattr(self, builder_name, None)
            query_runner = getattr(self, runner_name, None)
            query_parser = getattr(self, parser_name, None)
            if not(query_builder and query_runner):
                continue

            query = query_builder(keyword)
            response = query_runner(query)
            result = query_parser(response)
            self.results[engine] = result
            if DEBUG:
                print "[DEBUG] keyword: " + keyword
                print "[DEBUG] query: " + query
                print "[DEBUG] engine: " + engine

        return self.results


class BaseHarvestorBackend(object):
    def _query(self, keyword):
        elements = getattr(self, 'current_footprints', [])
        elements.append(keyword)
        return ' '.join(elements)


class GoogleHarvestorBackend(BaseHarvestorBackend):    
    def google_query(self, *args, **kwargs):
        return super(GoogleHarvestorBackend, self)._query(*args, **kwargs)

    def google_run(self, query):
        gs = GoogleSearch()
        return gs.search(query)

    def google_parse(self, response):
        # We only want links not the other infp
        results = [r['raw_url'] for r in response]
        return results
