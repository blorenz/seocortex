# Local imports
from base import BaseHarvestor, GoogleHarvestorBackend


class Harvestor(GoogleHarvestorBackend, BaseHarvestor):
    footprints = [
        "Powered by BlogEngine.NET",
        "Notify me when new comments are added",
    ]
    supported_engines = ['google']


if __name__ == '__main__':
    harv = Harvestor()
    res = harv.harvest('cooking')
    print res

