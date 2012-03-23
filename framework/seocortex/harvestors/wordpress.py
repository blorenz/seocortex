# Local imports
from base import BaseHarvestor, GoogleHarvestorBackend


class Harvestor(GoogleHarvestorBackend, BaseHarvestor):
    footprints = [
        '"Leave a Reply" "Name+(required)" "Mail+(will not be published)"',
        '-site:wordpress.com',
        'Website'
    ]
    supported_engines = ['google']


if __name__ == '__main__':
    custom_footprints = ['"Top Commenter" OR "Top Commenters"']
    harv = Harvestor(custom_footprints)

    res = harv.harvest('cooking')
    print res