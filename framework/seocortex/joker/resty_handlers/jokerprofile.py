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


    def list(self, amount = 5):
        jks = JokerProfile.objects.order_by("-pk")[:amount]
        final_jks = [to_dict(jk) for jk in jks]
        return json.dumps(final_jks)


    def get_by_id(self, id):
        result= []
        try:
            jk = JokerProfile.objects.get(id = obj_id)
            result = to_dict(jk)
        except:
            pass
        return json.dumps(result)

    def get_by_account(self, twitter = True, yahoo = True, amount = None):
        filters = {"accounts__twitter__exists" : twitter, "accounts__yahoo__exists" : yahoo}
        jks = JokerProfile.objects.filter(**filters)[:amount]
        final_jks = [to_dict(jk) for jk in jks]
        return json.dumps(final_jks)


    def get_with_twitter(self, has_twitter = True, amount = 1):
        return self.get_by_account(has_twitter, False, amount)


    def get_with_yahoo(self, has_yahoo = True, amount = 1):
        return self.get_by_account(False, has_yahoo, amount)
