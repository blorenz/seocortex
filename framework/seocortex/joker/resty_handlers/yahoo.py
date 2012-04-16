# Python imports
import json
import datetime

# Yahoo imports
from seocortex.joker.common.models import JokerProfile
from seocortex.joker.common.models import YahooAccountEmbedded


# An example handler
class YahooHandler(object):
    HEADERS = {'Content-Type' : 'application/json'}

    def add(self, jsondata = None, profile_id= None):
        if not jsondata:
            return json.dumps({"status" : "failed", "error" : "nodata"})

        # deserialize
        d = json.loads(jsondata)

        try:
            account = YahooAccountEmbedded()
            account.firstname = d['firstname']
            account.lastname = d['lastname']
            account.yahooid = d['yahooid']
            account.password = d['password']
            account.secret1 = d['secret1']
            account.secret2 = d['secret2']
            account.postalcode = d['postalcode']
            account.birthday = datetime.date(d['birthyear'], d['birthmonth'], d['birthday'])

            # Add account to a profile that doesn't have one yet
            try:
                if profile_id:
                    jkprofile = JokerProfile.objects.get(id = profile_id)
                else:
                    jkprofile = JokerProfile.objects.filter(accounts__yahoo__exists = False)[0]
            except:
                jkprofile = JokerProfile()
            jkprofile.add_account(account)
            jkprofile.save()

        except Exception as e:
            return json.dumps({"status" : "failed", "error" : unicode(e)})

        return json.dumps({"status" : "success"}) 
