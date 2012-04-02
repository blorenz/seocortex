# Python imports
import re


class BaseExtractor(object):
	def __init__(self, raw_data):
		self.raw_data = raw_data
		self.elements = []

	def extract(self):
		return self.elements


class RegexExtractor(BaseExtractor):
	regex = None

	def __init__(self, *args, **kwargs):
		self.compiled_regex = re.compile(self.regex)
		super(RegexExtractor, self).__init__(*args, **kwargs)

	def extract(self):
		if not self.refex_pattern:
			return
		self.elements = re.findall(self.compiled_regex, self.raw_data)
		return self.elements