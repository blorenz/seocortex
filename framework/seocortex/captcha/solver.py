# Server
import gevent
from gevent import Greenlet
from gevent import monkey; monkey.patch_all()

# Python includes
import tempfile
import urllib

# PIL imports
from PIL import Image

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


    def get_tmp_png_filename(self):
        tmpfd = self.get_tmp_file()
        tmpname = tmpfd.name
        tmpfd.close()
        return "%s.png" % tmpname


    def file_image_convert(self, filename, format = 'PNG'):
        new_fn = self.get_tmp_png_filename()
        im = Image.open(filename)
        im.save(new_fn, format)
        return new_fn


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


    def solve_data(self, data, convert = False, convert_to = 'PNG', *args, **kwargs):
        print("DATA (%s) = %s" % (type(data), len(data)))
        fd = self.get_tmp_file()
        fname = fd.name
        fd.write(data)
        fd.flush()
        fd.seek(0)
        if convert:
            new_fname = self.file_image_convert(fname, convert_to)
            fd.close()
            fd = open(new_fname, 'rb')
        return self.solve_filelike(fd, *args, **kwargs)



def main(url = None):
    url = url if url else "https://c5.ah.yahoo.com/img/ws_7sRSn_B0rbNlMet99P_5aa4oHNqlCiU8TEYM8qJ.RZl.EYTxR3Jn9vLN65PBgDa2PXVdfZfC7XVWplGpZ9hc_CiIbQHECttWi9kA4A_vOVSmcjodJgKsh6c0Zty6AVKiwTe1koU9k.QcsA--.jpg"
    solver = CaptchaSolver('coding.solo', 'colonel1')
    print("Solving %s" % url)
    result = solver.solve_url(url, convert = False)
    print("RESULT = %s" % result)


if __name__ == '__main__':
    urls = [
        'https://c5.ah.yahoo.com/img/ws_yffx1PB0rbP_ZTFIPl4LxUVPv8qBMB_FdRi5iuX5kVbLtUFGU_uwANRK3lPX8fYIwp7TWwyFRpHjRIFao1ilvKhpBg3Zwy1eBCnaHU5VdPcPlNorFhEeTip3NhWKmNVU562u31ocLJ6QoQ--.jpg',
        'https://c5.ah.yahoo.com/img/ws_PMV7kfB0rbMQF477B7BrJgFVkdwTVsjjZvGEyqeBBadXZahl8QnqXh_FZbXSfVAgfs1TMdiLikbgKzwRPex6rdRq4CcIJ12fpNXROceyDTh6C0qAgfv9zh4RrjU.KEBK4gkkhMnF5cCpN.8-.jpg',
        'https://c5.ah.yahoo.com/img/ws_f7t2xPB0rbMxqjm51xlmcKZlCA1F_cQLyIOM717fWD9f1zAseJHIA7Gq8V32H8EpK65ZMPr3.qFwUCLExlIvzo18oMOkOhYJNXUH.NrKuq0KmLarVxEllhuOj2pYOcLhYaDr7Ji_D.w_Ug--.jpg',
        'https://c5.ah.yahoo.com/img/ws_9_fEuPB0rbN4HUSxeIPOSsbDdmWd0d70kzYP56e4YPI8Lw7FJwVTWAH8UQEx0l5GdAy8N5vjfxseBIlZvywcToiPpywf_JQFLqwMEw.H7xnj2DW.murrcmSYCDtb0OeqcgCPDQzu2l6vAg--.jpg',
    ]
    # Spawn threads
    threads = []
    for url in urls:
        g = Greenlet.spawn(main, url)
        threads.append(g)

    gevent.joinall(threads)