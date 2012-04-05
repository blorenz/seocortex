# Local imports
from base import BaseAPIClient


class DBCClient(BaseAPIClient):
    SERVICE_NAME = 'dbc'
    HOST = 'localhost'
    PORT = 15001


# Testing
if __name__ == '__main__':
    client = DBCClient()
    url = "https://c5.ah.yahoo.com/img/ws_5qc4ZPB0rq_H3uzt1LdOta0vH2.Ee4LXR5YFlhnhXyFCLuvdIlK9FXP0VgicsVfYATCf_1JI9E.ZBbbLXkhrRQ26FfKxcpPUHHycatCO4ddvh1GpNiWl9f1EPXAZZer_6rnjf9Zl0W8552g-.jpg"
    result = client.solveURL(url = url) 
    print("Result = %s" % result)