import xml.etree.ElementTree as etree

""" Must test this found at http://stackoverflow.com/questions/127606/editing-xml-as-a-dictionary-in-python

USAGE :

tree = etree.parse('test.xml')
root = tree.getroot()

pydict = xml_to_dict(root)

"""


def xml_to_dict(el):
  d={}
  if el.text:
    d[el.tag] = el.text
  else:
    d[el.tag] = {}
  children = el.getchildren()
  if children:
    d[el.tag] = map(xml_to_dict, children)
  return d 
