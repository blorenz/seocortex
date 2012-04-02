# Python imports
from urllib import urlencode
from xml.dom.minidom import parseString


class Suggestor(object):
	name = 'Google'

	def build_request(self, keyword):
		params = {
			'output' : 'toolbar',
			'hl' : 'en',
			'q' : 'pokemon'
		}
		url = """http://google.com/complete/search?%s""" % urlencode(params)


	def parse_response(self, response):
		dom = parseString(response)
		tags = dom.getElementsByTagName('CompleteSuggestion')
		# Will have to persist keyword request
		keywords = [t.childNodes[0].getAttribute('data')for t in tags]
		return {keywords[0] : keywords}


if __name__ == '__main__':
	s = Suggestor()
	data = """<?xml version="1.0"?><toplevel><CompleteSuggestion><suggestion data="pokemon"/><num_queries int="219000000"/></CompleteSuggestion><CompleteSuggestion><suggestion data="pokemon tower defense"/><num_queries int="4120000"/></CompleteSuggestion><CompleteSuggestion><suggestion data="pokemon online"/><num_queries int="152000000"/></CompleteSuggestion><CompleteSuggestion><suggestion data="pokemon episodes"/><num_queries int="3550000"/></CompleteSuggestion><CompleteSuggestion><suggestion data="pokemon black and white"/><num_queries int="20300000"/></CompleteSuggestion><CompleteSuggestion><suggestion data="pokemon games"/><num_queries int="160000000"/></CompleteSuggestion><CompleteSuggestion><suggestion data="pokemon wiki"/><num_queries int="15500000"/></CompleteSuggestion><CompleteSuggestion><suggestion data="pokemon global link"/><num_queries int="1090000"/></CompleteSuggestion><CompleteSuggestion><suggestion data="pokemon natures"/><num_queries int="25800000"/></CompleteSuggestion><CompleteSuggestion><suggestion data="pokemon emerald rom"/><num_queries int="1790000"/></CompleteSuggestion></toplevel>"""
	print s.parse_response(data)