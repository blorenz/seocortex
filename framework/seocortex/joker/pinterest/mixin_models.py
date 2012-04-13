# MongoEngine imports
import mongoengine as models



class PinterestAccountMixin(object):
    # Essential
    username = models.StringField(max_length = 256)
    password = models.StringField(max_length = 256)
