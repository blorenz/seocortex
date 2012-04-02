# Python imports
from urllib import urlencode
import json


class Suggestor(object):
	name = 'GoogleProducts'

	def build_request(self, keyword):
		params = {
			'hl' : 'en',
			'gl' : 'us',
			'ds' : 'pr',
			'client' : 'products',
			'hjson' : 't',
			'q' : keyword,
			'cp' : 10,
		}
		url = "	http://clients1.google.com/complete/search?%s" % urlencode(params)


	def parse_response(self, response):
		data = json.loads(response)
		keyword = data[0]
		results = [result for result, x, nul in data[1]]

		return {keyword : results}

if __name__ == '__main__':
	s = Suggestor()
	data = """["pokemon",[["pokemon cards","","0"],["pokemon","","1"],["pokemon black","","2"],["pokemon white","","3"],["pokemon emerald","","4"],["pokemon black and white","","5"],["pokemon heart gold","","6"],["pokemon backpack","","7"],["pokemon battle revolution","","8"],["pokemon plush","","9"]],{"k":1}]"""
	print s.parse_response(data)