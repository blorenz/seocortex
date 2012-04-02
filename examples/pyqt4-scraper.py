# assumes you have installed: Xvfb PyQt4 PyQt4-devel
# also run #  Xvfb :0 -screen 0 1024x768x24 2>/dev/null &
import os
import sys
from PyQt4.QtGui import *  
from PyQt4.QtCore import *  
from PyQt4.QtWebKit import *  
  
class Render(QWebPage):  
  def __init__(self, url):  
    self.app = QApplication(sys.argv)  
    QWebPage.__init__(self)  
    self.loadFinished.connect(self._loadFinished)  
    self.mainFrame().load(QUrl(url))  
    self.app.exec_()  
  
  def _loadFinished(self, result):  
    self.frame = self.mainFrame()  
    self.app.quit()  
  

if __name__ == '__main__':
    os.putenv('DISPLAY', ':0.0')
    url = u'http://fewdalism.com/hello-world/'  
    r = Render(url)  
    html = r.frame.toHtml()  
    print html
