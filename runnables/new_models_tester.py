# Python imports
import datetime
import json

# Start MongoEngine
import mongoengine
MONGO_ARGS = ('seocortex',)
mongoengine.connect(*MONGO_ARGS) 


# Import our models
from seocortex.joker.common.models import JokerProfile
from seocortex.joker.common.models import TwitterAccountEmbedded
from seocortex.joker.common.models import YahooAccountEmbedded


# Build Twitter account
twitter = TwitterAccountEmbedded()
twitter.name = "Tester"
twitter.username = "SuperTester"
twitter.password = "PasswordTester"

# Build Yahoo account
yahoo = YahooAccountEmbedded()
yahoo.yahooid = "SomeYahooId"
yahoo.password = "SomePassword"
yahoo.firstname = "john"
yahoo.lastname = "smith"
yahoo.secret1 = "secret1"
yahoo.secret2 = "secret2"
yahoo.postalcode = "90210"
yahoo.birthday = datetime.datetime.now()

# Build JokerProfile
joker = JokerProfile()

# Add accounts
joker.add_account(twitter)
joker.add_account(yahoo)

# Save and exit
joker.save()

val = joker.to_mongo()
val2 = joker._data
print("[%s] :\n%s\n\n" % (type(val), val))
print("[%s] :\n%s\n\n" % (type(val2), val2))


print("In JSON : \n%s" % json.dumps(val))
print("In JSON : \n%s" % json.dumps(val2))