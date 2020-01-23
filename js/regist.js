$(document).ready(function() {

    // 登录请求
    $("#userRegist").click(function() {
        var username = $('#username').val();
        var password = $('#password').val();
        var confirpw = $('#confirpw').val();
        var phonenum = $('#phonenum').val();
        var emailnum = $('#emailnum').val();

        if (password != confirpw) {
            alert("密码不一致！")
            return
        }

        var datas = get_json({ 'username': username, 'password': password, 'phone': phonenum, 'email': emailnum })
        $.ajax({
            type: 'post',
            url: get_url("/regist"),
            headers: get_headers(),
            data: datas,
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) { //返回json结果
                if (str.status == 200) {
                    alert("注册成功！")
                    window.location.href = "login.html";
                } else {
                    alert(str.msg);
                    remove_user_login_status(str.msg)

                }
            },
            fail: function(err, status) {
                alert(err.data);
                console.log(err);
            }
        });
    });

});