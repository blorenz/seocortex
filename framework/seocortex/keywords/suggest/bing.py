# Python imports
from urllib import urlencode
import json


class Suggestor(object):
	name = 'Bing'

	def build_request(self, keyword):
		params = {'query' : keyword}
		url = "http://api.bing.com/osjson.aspx?%s" % urlencode(params)


	def parse_response(self, response):
		data = json.loads(response.content)
		keyword = data[0]
		results = data[1]

		return {keyword : results}