$(document).ready(function() {
    is_need_login();
    set_copyright_version();

    // initialize_page();
    $('#uid').attr("value", get_id());
    get_user_infos(get_id());

    $("#all_search").keyup(function(e) {
        if (e.which == 13) {
            all_search()
        }
    });

    // webloader初始化
    var uploader = WebUploader.create({
        // 选完文件后，是否自动上传。
        auto: true,
        // swf文件路径
        swf: '../lib/webuploader/Uploader.swf',
        // 文件接收服务端。
        server: get_url("/upload"),
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#filePicker',
        // 只允许选择图片文件。
        withCredentials: true,
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        }
    });

    // 上传成功
    uploader.on('uploadSuccess', function(file, response) {
        var iurl = "/updateuserheadpic";
        datas = get_json({ "ximg": response.data })
        $.ajax({
            url: get_url(iurl),
            type: "POST",
            data: datas,
            async: true,
            headers: get_headers(),
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) {
                if (str.status == 200) {
                    $("#headpic").attr("src", get_img_url(response.data));
                    $("#headpic").attr("value", response.data);
                    remove_user_info("user_headpic");
                    save_user_info("user_headpic", response.data);
                    alert("修改成功！");
                } else {
                    alert(str.msg)
                    remove_user_login_status(str.msg)
                }
            },
            error: function(str) {
                alert("修改失败！")
            }
        });
    });

    // 上传失败
    uploader.on('uploadError', function(file) {
        alert("上传失败，请检查服务器！")
    });

    // 修改用户信息
    $("#acommit1").click(function() {
        var nickname = $("#username").val();
        var job = $("#job").val();
        var qq = $("#qq").val();
        var addr = $("#addr").val();
        var weixin = $("#weixin").val();
        var email = $("#modify-mailbox").val();
        var userinfo = $("#qianming").val();
        var phone = $("#phone").val();
        var sex = $("#sex").val();

        // 判断为空
        if (nickname == '' || job == '' || qq == '' || addr == '' || weixin == '' ||
            email == '' || userinfo == '' || phone == '' || sex == '') {
            alert("输入的信息不能为空!");
            return;
        }

        if (is_email(email) == false) {
            alert("邮箱不合法")
            return;
        }
        if (is_mobile(phone) == false) {
            alert("手机号不合法")
            return;
        }

        var iurl = "/updateuserinfo";
        var datas = get_json({ "nickname": nickname, "job": job, "email": email, "qq": qq, "weixin": weixin, "address": addr, "phone": phone, "sex": sex, "userinfo": userinfo });
        $.ajax({
            url: get_url(iurl),
            type: "POST",
            data: datas,
            headers: get_headers(),
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) {
                if (str.status == 200) {
                    go_personal_center($('#uid').val());
                } else {
                    alert(str.msg);
                    remove_user_login_status(str.msg);
                }
            },
            error: function(str) {
                alert("上传失败！")
            }
        });
    });

});

function get_user_infos(uid) {
    $.ajax({
        type: 'get',
        url: get_url("/get/userinfo?uid=" + uid),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 获取成功
                var userinfo = str.data.userinfo[0].userinfo;
                var nickname = str.data.userinfo[0].nickname;
                var headpic = get_img_url(str.data.userinfo[0].headpic);
                var userinfo = str.data.userinfo[0].userinfo;
                var email = str.data.userinfo[0].email;
                var job = str.data.userinfo[0].job;
                var qq = str.data.userinfo[0].QQ;
                var addr = str.data.userinfo[0].address;
                var weixin = str.data.userinfo[0].weixin;
                var phone = str.data.userinfo[0].phone;
                var sex = str.data.userinfo[0].sex;

                var iurl = "/updateuserinfo";

                $('#headpic').attr("src", headpic);
                $('#username').attr("value", nickname);
                $('#qianming').text(userinfo);
                $('#job').attr("value", job);
                $('#qq').attr("value", qq);
                $('#weixin').attr("value", weixin);
                $('#phone').attr("value", phone);
                $('#sex').attr("value", sex);
                $('#addr').attr("value", addr);
                $('#modify-mailbox').attr("value", email);
            } else {
                alert("操作失败！");
                remove_user_login_status(str.msg)
            }

        },
        fail: function(err, status) {
            alert("操作失败！");
            console.log(err);
        }
    });
}