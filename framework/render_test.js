var page = new WebPage();

var url = 'https://c5.ah.yahoo.com/img/ws_5qc4ZPB0rq_H3uzt1LdOta0vH2.Ee4LXR5YFlhnhXyFCLuvdIlK9FXP0VgicsVfYATCf_1JI9E.ZBbbLXkhrRQ26FfKxcpPUHHycatCO4ddvh1GpNiWl9f1EPXAZZer_6rnjf9Zl0W8552g-.jpg';

page.open(url, function() {
    page.render('out.png');
    phantom.exit();
}) 
