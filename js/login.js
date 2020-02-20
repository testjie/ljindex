$(document).ready(function() {

    // 登录请求
    $("#userLogin").click(function() {
        var username = $('#username').val();
        var password = $('#password').val();
        var datas = get_json({ 'username': username, 'password': password })
        $.ajax({
            type: 'post',
            url: get_url("/login"),
            headers: get_headers(),
            data: datas,
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) { //返回json结果
                if (str.status == 200) {
                    // 登录成功
                    save_user_info("user_token", str.data.token);
                    save_user_info("user_userid", str.data.userinfo.uid);
                    save_user_info("user_headpic", str.data.userinfo.headpic);
                    save_user_info("user_nickname", str.data.userinfo.nickname);
                    go_pre_page();
                } else {
                    alert(str.msg);
                }

            },
            fail: function(err, status) {
                alert(err.data);
                console.log(err);
            }
        });
    });

});