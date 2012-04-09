# Django imports
from django.core import serializers

# Yahoo imports
from seocortex.joker.yahoo.models import YahooAccount


# An example handler
class YahooHandler(object):
    HEADERS = {'Content-Type' : 'text/javascript'}


    def list(self):
        data = serializers.serialize("json", YahooAccount.objects.order_by("-pk")[:5])
        return data

    def add(self, jsondata = None):

        if not jsondata:
            return json.dumps({"status" : "failed", "error" : "nodata"})

        # deserialize
        d = json.loads(jsondata)

        try:
            account = YahooAccount()
            account.first = d['firstname']
            account.last = d['lastname']
            account.yahooid = d['yahooid']
            account.password = d['password']
            account.secret1 = d['secret1']
            account.secret2 = d['secret2']
            account.postalcode = d['postalcode']
            account.birthday = datetime.date(d['birthyear'], d['birthmonth'], d['birthday'])
            account.save()
        except Exception as e:
            return json.dumps({"status" : "failed", "error" : unicode(e)})

        return json.dumps({"status" : "success"}) 
