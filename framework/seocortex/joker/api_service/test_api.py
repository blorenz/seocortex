# Local imports
from base import BaseAPIClient


class TestClient(BaseAPIClient):
    SERVICE_NAME = 'test'
    host = 'localhost'
    port = 15001 
