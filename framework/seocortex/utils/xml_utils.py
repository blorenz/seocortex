# Python imports
from __future__ import absolute_import
from xml.etree import ElementTree as etree



def xml_to_dict(el):
    d = {}
    text = el.text.strip()
    children = None
    if text:
        d[el.tag] = text
    else:
        d[el.tag] = {}
        children = el.getchildren()
        attrs = el.attrib
        if attrs:
            d[el.tag]['$'] = attrs
    if children:
        d[el.tag] = map(xml_to_dict, children)
    return d


class XMLSerializer(object):
    def from_string(self, string):
        oxml = etree.fromstring(string)
        dct = xml_to_dict(oxml)
        return dct

    def from_file(self, filelike):
        oxml = etree(filelike)
        dct = xml_to_dict(oxml)
        return dct