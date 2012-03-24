import re

# Constant
regexstr = '<tr><td>(?P<rank>.*)</td><td><a href=".*">(?P<domain>.*)</a></td></tr>'

filenames = []
for n in range(200):
	filename = "./Alexa_%s.html" % n
	filenames.append(filename)

lines = []
for f in filenames:
	fd = open(f, "r")
	lines.extend(fd.readlines())
	fd.close()

results = []

for l in lines:
	m = re.match(regexstr, l)
	if not m:
		continue
	results.append(m.groups())


for rank, domain in results:
	print("%s %s" % (rank, domain))
