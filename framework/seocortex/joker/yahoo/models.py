# Django imports
from django.db import models


DEFAULT_FAIL_LIMIT = 3

class YahooAccount(models.Model):
    # Essential
    yahooid = models.CharField(max_length = 256)
    password = models.CharField(max_length = 256)

    # names
    first = models.CharField(max_length = 128)
    last = models.CharField(max_length = 128)

    # Birth info
    birthday = models.DateField()
    postalcode = models.CharField(max_length = 5)


    # Secret
    secret1 = models.CharField(max_length = 256) 
    secret2 = models.CharField(max_length = 256) 


    # Meta
    is_active = models.BooleanField(default = True)
    fail_counts = models.PositiveIntegerField(default = 0)


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