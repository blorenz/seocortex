# MongoEngine imports
import mongoengine as models


# Constants
DEFAULT_FAIL_LIMIT = 3



class YahooAccountMixin(object):
    # Essential
    yahooid = models.StringField(max_length = 256)
    password = models.StringField(max_length = 256)

    # names
    firstname = models.StringField(max_length = 128)
    lastname = models.StringField(max_length = 128)

    # Birth info
    birthday = models.DateTimeField()
    postalcode = models.StringField(max_length = 5)


    # Secret
    secret1 = models.StringField(max_length = 256) 
    secret2 = models.StringField(max_length = 256) 


    # Meta
    is_active = models.BooleanField(default = True)
    fail_counts = models.IntField(default = 0, min_value = 0)


    # After 3 invalid logins, accounts is considered as blocked
    def is_failed(self):
        return self.fail_counts >= DEFAULT_FAIL_LIMIT

    @property
    def email(self):
        return "%s@yahoo.com" % self.yahooid

    def __unicode__(self):
        return self.email

    def save(self, *args, **kwargs):
        self.is_active = self.is_failed()
        return super(YahooAccount, self).save(*args, **kwargs)