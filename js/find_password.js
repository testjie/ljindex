$(document).ready(function() {
    set_copyright_version();

    if (get_user_login_status() == true) {
        alert("请到个人中心直接去回密码！")
        return;
    }

    get_mb_list();

    // 登录请求
    $("#find_password").click(function() {
        var username = $('#username').val();
        var password = $('#password').val();
        var qs1 = $('#a1').val();
        var qs2 = $('#a2').val();
        var qs3 = $('#a3').val();
        var id1 = $('#qs1').attr("name");
        var id2 = $('#qs2').attr("name");
        var id3 = $('#qs3').attr("name");

        if (username == "" || password == "" || qs1 == "" || qs2 == "" || qs3 == "") {
            alert("输入项不能有空值");
            return;
        }

        var datas = get_json({ "username": username, "password": password, "mb": { id1: qs1, id2: qs2, id3: qs3 } });
        $.ajax({
            type: 'post',
            url: get_url("/userfindps"),
            headers: get_headers(),
            data: datas,
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) { //返回json结果
                if (str.status == 200) {
                    alert("设置成功，请牢记你的密码！");
                    go_pre_page();
                } else {
                    alert(str.msg);
                    remove_user_login_status(str.msg);
                }
            },
            fail: function(err, status) {
                alert(err.data);
                console.log(err);
            }
        });
    });
});