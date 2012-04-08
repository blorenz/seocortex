# Python includes
import tempfile
import urllib

# DeathByCaptcha imports
import deathbycaptcha as dbc


class CaptchaSolver(object):
    DBC_USERNAME = ''
    DBC_PASSWORD = ''

    
    def __init__(self, username = None, password = None):
        self.file = None
        self.username = username if username else self.DBC_USERNAME
        self.password = password if password else self.DBC_PASSWORD
        self.client = dbc.SocketClient(self.username, self.password)


    def get_tmp_file(self):
        return tempfile.NamedTemporaryFile()


    def solve_filelike(self, fd, timeout = 60):
        self.file = fd
        result = self.client.decode(self.file, timeout)
        #self.file.close()
        return result


    def solve_file(self, filename, *args, **kwargs):
        fd = open(filename, 'rb')
        return self.solve_filelike(fd, *args, **kwargs)


    def solve_url(self, url, *args, **kwargs): 
        data = urllib.urlopen(url).read()
        return self.solve_data(data, *args, **kwargs)


    def solve_data(self, data, *args, **kwargs):
        print("DATA (%s) = %s" % (type(data), len(data)))
        fd = self.get_tmp_file()
        fd.write(data)
        fd.flush()
        fd.seek(0)
        return self.solve_filelike(fd, *args, **kwargs)