# Python imports
from urllib import urlencode
import json


class Suggestor(object):
	name = 'Amazon'

	def build_request(self, keyword):
		params = {
			'method' : 'completion',
			'q' : keyword,
			'search-alias' : 'aps',
			'mkt' : '1',
		}
		url = "http://completion.amazon.com/search/complete?%s" % urlencode(params)


	def parse_response(self, response):
		data = json.loads(response)
		keyword = data[0]
		results = data[1]

		return {keyword : results}


if __name__ == '__main__':
	s = Suggestor()
	data = """["pokemon",["pokemon","pokemon cards","pokemon black","pokemon emerald","pokemon yellow","pokemon plush","pokemon white","pokemon red","pokemon fire red","pokemon black and white"],[{"nodes":[{"name": "Video Games", "alias": "videogames"},{"name": "Toys & Games", "alias": "toys-and-games"},{"name": "Movies & TV", "alias": "movies-tv"},{"name": "Books", "alias": "stripbooks"}]},{},{},{},{},{},{},{},{},{}],[]]"""
	print s.parse_response(data)
