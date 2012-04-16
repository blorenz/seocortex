# Python imports
import json

# Django imports
from django.core import serializers

# Yahoo imports
from seocortex.joker.common.models import JokerProfile


def to_dict(jkprofile):
    dct = jkprofile.to_mongo()
    dct['_id'] = unicode(dct['_id'])
    try:
        dct['accounts']['yahoo']['birthday'] = dct['accounts']['yahoo']['birthday'].isoformat()
    except:
        pass
    return dct


# An example handler
class JokerProfileHandler(object):
    HEADERS = {'Content-Type' : 'application/json'}


    def latest(self, **kwargs):
        kwargs.setdefault('amount', 10)
        return self.list(**kwargs)


    def list(self, **kwargs):
        return self.get_by_account(**kwargs)


    def twitter(self, yahoo = False, amount = None):
        return self.get_by_account(yahoo = yahoo, twitter = 'true', amount = amount)


    def yahoo(self, twitter = False, amount = None):
        return self.get_by_account(twitter = twitter, yahoo = 'true', amount = amount)


    def get_by_id(self, id):
        result= []
        try:
            jk = JokerProfile.objects.get(id = obj_id)
            result = to_dict(jk)
        except:
            pass
        return json.dumps(result)


    def get_by_account(self, twitter = False, yahoo = False, amount = None):
        try:
            amount = int(amount)
        except:
            pass
        twitter = True if twitter == 'true' else False
        yahoo = True if yahoo == 'true' else False

        jks = JokerProfile.objects
        if twitter:
            jks = jks.filter(accounts__twitter__exists = twitter)
        if yahoo:
            jks = jks.filter(accounts__yahoo__exists = yahoo)

        jks = list(jks[:amount])
        final_jks = [to_dict(jk) for jk in jks]
        return json.dumps(final_jks)

