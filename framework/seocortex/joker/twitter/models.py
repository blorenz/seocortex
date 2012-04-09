# Django imports
from django.db import models

# Seocortex joker imports
from seocortex.joker.yahoo.models import YahooAccount



class TwitterAccount(models.Model):
    # Real Twitter info
    name = models.CharField(max_length = 128)
    username = models.CharField(max_length = 128)
    password = models.CharField(max_length = 128)

    # Relation to our Yahoo Account
    yahoo_account = models.ForeignKey(YahooAccount, related_name = "twitter_account") 


    def __unicode__(self):
        return self.name