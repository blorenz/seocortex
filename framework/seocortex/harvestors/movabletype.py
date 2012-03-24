# Local imports
from base import BaseHarvestor, GoogleHarvestorBackend


class Harvestor(GoogleHarvestorBackend, BaseHarvestor):
    footprints = [
        "URL:",
        "Comments (you may use HTML tags for style):",
    ]
    supported_engines = ['google']


if __name__ == '__main__':
    harv = Harvestor()
    res = harv.harvest('cooking')
    print res