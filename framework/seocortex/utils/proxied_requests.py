# Python imports
from requests.auth import HTTPProxyAuth
from requests.sessions import session
from random import randint

#DEFAULT_PROXIES = ['72.8.142.216:62048', '68.168.215.94:62048', '68.168.214.126:62048', '68.168.215.228:62048', '72.8.191.131:62048', '72.8.142.20:62048', '72.8.191.57:62048', '72.8.191.18:62048', '72.8.191.146:62048', '72.8.191.158:62048', '72.8.142.213:62048', '68.168.215.65:62048', '72.8.191.254:62048', '68.168.215.70:62048', '68.168.214.150:62048', '72.8.142.229:62048', '68.168.214.171:62048', '68.168.215.241:62048', '72.8.142.32:62048', '68.168.214.67:62048', '68.168.215.80:62048', '68.168.215.173:62048', '68.168.214.186:62048', '68.168.214.121:62048', '72.8.191.105:62048']
DEFAULT_PROXIES = [
    {'ip':'50.117.24.226', 'port':'3131', 'u' : '31a89a8cbaae43b6', 'p' : '56024ab39ee54dcf'},
    {'ip':'50.117.68.212', 'port':'3131', 'u' : 'cbf69c8854ba4d04', 'p' : 'b7bb6255996749dd'},
    {'ip':'50.117.69.0', 'port':'3131', 'u' : 'fb8c9c5ee75e4f57', 'p' : '4add5380d904463c'},
    {'ip':'50.117.69.212', 'port':'3131', 'u' : '4edb9bc1c2fa4cf2', 'p' : '192384efd5e24fa4'},
    {'ip':'50.117.70.1', 'port':'3131', 'u' : '9404854294b04337', 'p' : '784c84deb85c44f8'},
    {'ip':'50.117.70.212', 'port':'3131', 'u' : '4d4fff780c02423d', 'p' : 'd918ca12a0ed4a7b'},
    {'ip':'50.117.71.1', 'port':'3131', 'u' : '0baf28faba404420', 'p' : '189b850e3fe24d09'},
    {'ip':'50.117.71.213', 'port':'3131', 'u' : '791b457dd2414762', 'p' : '7ed5670febb34e0d'},
    {'ip':'173.208.130.10', 'port':'3131', 'u' : 'd947f173e03449aa', 'p' : '22853a3d90154a90'},
    {'ip':'173.208.130.249', 'port':'3131', 'u' : 'b5ad668b72a84b93', 'p' : '8601db9523f84456'},
    {'ip':'173.208.145.164', 'port':'3131', 'u' : 'abd0ed0ca4d24913', 'p' : 'a9431c8f37ba4509'},
    {'ip':'173.208.145.82', 'port':'3131', 'u' : '53b9e92da15247e5', 'p' : 'f7250e69cfa845ef'},
    {'ip':'173.208.153.235', 'port':'3131', 'u' : 'c0fbf735c6fe4ca9', 'p' : 'f2aa81122bda4f6a'},
    {'ip':'173.208.158.167', 'port':'3131', 'u' : '82513de71c1248f3', 'p' : 'b01bfe42a4ff492c'},
    {'ip':'50.117.64.10', 'port':'3131', 'u' : 'e1a213b3c10d47c8', 'p' : '67da9da435384bc0'},
    {'ip':'50.117.64.24', 'port':'3131', 'u' : '1124e174b2274f35', 'p' : '4a4e1bd0c87444eb'},
    {'ip':'50.117.65.15', 'port':'3131', 'u' : '2882da2640de4f0a', 'p' : '07e47cdbd8714484'},
    {'ip':'50.117.65.74', 'port':'3131', 'u' : '37b82961ace9499a', 'p' : 'af015f7d99ae4ded'},
    {'ip':'50.117.66.233', 'port':'3131', 'u' : 'd7b536dbb5844906', 'p' : 'c302b1cf423a49d8'},
    {'ip':'50.117.67.167', 'port':'3131', 'u' : 'f0fab0d16a274379', 'p' : '9f4f024b325f4201'},
]
# Auth information
DEFAULT_USERNAME = "davindergrover"
DEFAULT_PASSWORD = "uMP4FEvlWGGy"
DEFAULT_AUTH = "%s:%s" % (DEFAULT_USERNAME, DEFAULT_PASSWORD)
FETCH_HEADERS = {
    'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/535.21 (KHTML, like Gecko) Chrome/19.0.1042.0 Safari/535.21',
    'Accept-Encoding': ', '.join(('identity', 'deflate', 'compress', 'gzip')),
    'Accept': '*/*'
}

##
# Just simply wrap all the main requests module's methods
# this is brain dead code TBH
##



def get_proxy(offset = 0, username = DEFAULT_USERNAME, password = DEFAULT_PASSWORD, proxy_list = DEFAULT_PROXIES):
    p = proxy_list[offset]
    ip = p['ip']
    port = p['port']
    username = p['u']
    proxy = {"http" : "http://%s:%s" % (ip, port)}
    proxy['auth'] = HTTPProxyAuth(p['u'], p['p'])
    return proxy
    
    
def get_proxies(*args, **kwargs):
    i = 0
    # Breaks when proxy is None
    while True:
        proxy = get_proxy(offset = i, *args, **kwargs)
        if proxy is None:
            break
        yield proxy
        i += 1
        
##
# @return A random proxy url
##
def get_random_proxy(*args, **kwargs):
    p_list = kwargs.get('proxy_list', [None])
    offset = randint(0, len(p_list)-1)
    return get_proxy(offset = offset, *args, **kwargs)

##
# Throws in a proxy if none specified
##
def request(method, url, params=None, data=None, headers = FETCH_HEADERS, cookies=None, files=None, auth=None, timeout=None, allow_redirects=True, proxies=None, hooks=None, return_response=True, config=None, use_proxies = True):
    # This is the only thing we do
    if proxies is None and use_proxies:
        proxies = get_random_proxy(proxy_list = DEFAULT_PROXIES)
    if not proxies is None:
        auth = proxies['auth']
        del proxies['auth']
        
    
    s = session()
    kwargs = {
        'method' : method, 
        'url' : url,
        'params' : params,
        'data' : data,
        'headers' : headers,
        'cookies' : cookies,
        'files' : files,
        'auth' : auth,
        'timeout' : timeout,
        'allow_redirects' : allow_redirects,
        'proxies' : proxies,
        'hooks' : hooks,
        'return_response' : return_response,
        'config' : config,
    }
    
    return s.request(**kwargs)
        

def get(url, **kwargs):
    kwargs.setdefault('allow_redirects', True)
    return request('GET', url, **kwargs)


def head(url, **kwargs):
    kwargs.setdefault('allow_redirects', True)
    return request('HEAD', url, **kwargs)


def post(url, data='', **kwargs):
    return request('post', url, data=data, **kwargs)


def put(url, data='', **kwargs):
    return request('put', url, data=data, **kwargs)


def patch(url, data='', **kwargs):
    return request('patch', url,  data='', **kwargs)


def delete(url, **kwargs):
    return request('delete', url, **kwargs)
