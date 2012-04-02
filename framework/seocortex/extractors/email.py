# Local imports
from base import RegexExtractor

##
# Simple regex based email extractor
##
class Extractor(RegexExtractor):
	regex = "[-a-zA-Z0-9._]+@[-a-zA-Z0-9_]+.[a-zA-Z0-9_.]+"