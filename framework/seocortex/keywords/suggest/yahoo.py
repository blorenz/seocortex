# Python imports
from urllib import urlencode
import json


class Suggestor(object):
	name = 'Yahoo'

	def build_request(self, keyword):
		params = {
			'output' : 'json',
			'nresults' : 10,
			'command' : keyword,
		}
		url = "http://sugg.search.yahoo.com/sg/?%s" % urlencode(params)


	def parse_response(self, response):
		data = json.loads(response)
		keyword = data['gossip']['qry']
		results = [r['key'] for r in data['gossip']['results']]
		return {keyword : results}

if __name__ == '__main__':
	s = Suggestor()
	data = """{"gossip":{"qry":"pokemon", "norm":"pokemon", "results":[{"key":"pokemon crater","mrk":0},{"key":"pokemon games","mrk":0},{"key":"pokemon diamond","mrk":0},{"key":"pokemon black and white","mrk":0},{"key":"pokemon emerald","mrk":0},{"key":"pokemon.com","mrk":0},{"key":"pokemon cards","mrk":0},{"key":"pokemon platinum","mrk":0},{"key":"pokemon cheats","mrk":0},{"key":"pokemon episodes","mrk":0}]}}"""
	print s.parse_response(data)