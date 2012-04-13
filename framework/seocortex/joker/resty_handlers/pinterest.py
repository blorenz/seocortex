# Python imports
import json

# Yahoo imports
from seocortex.joker.common.models import JokerProfile
from seocortex.joker.common.models import PinterestAccountEmbedded


# An example handler
class PinterestHandler(object):
    HEADERS = {'Content-Type' : 'application/json'}


    def add(self, jsondata = None, profile_id = None):

        if not jsondata:
            return json.dumps({"status" : "failed", "error" : "nodata"})

        # deserialize
        d = json.loads(jsondata)

        try:
            account = PinterestAccountEmbedded()
            account.username = d['username']
            account.password = d['password']

            # Add account to a profile that doesn't have one yet
            try:
                if profile_id:
                    jkprofile = JokerProfile.objects.get(id = profile_id)
                else:
                    jkprofile = JokerProfile.objects.filter(accounts__pinterest__exists = False)[0]
            except:
                jkprofile = JokerProfile()
            jkprofile.add_account(account)
            jkprofile.save()

        except Exception as e:
            return json.dumps({"status" : "failed", "error" : unicode(e)})

        return json.dumps({"status" : "success"}) 
 
