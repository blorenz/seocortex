var dbc_form = '<form action="http://api.dbcapi.me/api/captcha"\
      method="post"\
      enctype="multipart/form-data">\
    <input type="text"     id="dbc_username" name="username" value="">\
    <input type="password" id="dbc_password" name="password" value="">\
    <input type="file"     id="dbc_file" name="captchafile">\
    <input type="submit" value="Submit">\
</form>';


$('body').html(dbc_form);
