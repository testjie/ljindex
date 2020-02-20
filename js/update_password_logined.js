$(document).ready(function() {

    // 登录请求
    $("#find_password").click(function() {
        var oldpassword = $('#oldpassword').val();
        var newpassword = $('#newpassword').val();

        if (get_user_login_status() == false) {
            alert("请先登录");
            return;
        }

        if (oldpassword == "" || newpassword == "") {
            alert("密码不能为空")
            return;
        }

        var datas = get_json({ "oldps": oldpassword, "newps": newpassword });
        $.ajax({
            type: 'post',
            url: get_url("/userupdateps"),
            headers: get_headers(),
            data: datas,
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) { //返回json结果
                if (str.status == 200) {
                    alert("修改成功，请重新登录！");
                    remove_user_login_status("token无效，请重新登录");
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