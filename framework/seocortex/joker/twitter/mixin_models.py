# MongoEngine imports
import mongoengine as models


class TwitterAccountMixin(object):
    name = models.StringField(required = True)
    username = models.StringField(required = True)
    password = models.StringField(required = True)
    activated = models.BooleanField(default = False)
