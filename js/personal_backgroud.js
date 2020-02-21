$(document).ready(function() {
    is_need_login();

    initialize_page();
    set_copyright_version();

    $('#uid').attr("value", get_id());
    get_user_infos(get_id());

    // 灵感
    $("#get_inspiration").click(function() {
        $("#answering_list").html('');
        get_inspirations_list(1);
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
        var iurl = "/updateusertitlepic";
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
                    // $("#personal-header").attr("src", get_img_url(response.data));
                    // $("#personal-header").attr("value", response.data);
                    // alert("修改成功");
                    go_pre_page();
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



});

function get_user_infos(uid) {
    $.ajax({
        type: 'get',
        url: get_url("/get/userinfo?uid=" + uid),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 获取成功
                var userinfo = str.data.userinfo[0].userinfo
                var nickname = str.data.userinfo[0].nickname
                var headpic = get_img_url(str.data.userinfo[0].headpic)
                var titlepic = get_img_url(str.data.userinfo[0].titlepic)
                var fensi = str.data.fens;
                var guanzhu = str.data.follows;

                // 头像
                // $('#headpic1').attr("src", headpic);
                $('#headpic').attr("style", " no-repeat center top;background-size:cover; cursor:pointer;");
                $('#headpic').attr("src", headpic);

                // 背景图
                $('#personal-header').attr("style", 'background: url("' + titlepic + '") no-repeat center top;background-size:cover; cursor:pointer; height:500px;');
                $('#personal-header').attr("onclick", '');
                $('#update_user_info').attr("href", 'personal_info.html?uid=' + $('#uid').val());
                // $('#headpic').attr("onclick", go_personal_info($('#uid').val()));

                // 用户信息
                $('#username').text(nickname);
                $('#userinfo').text(userinfo);
                $('#fans').text(fensi);
                $('#follows').text(guanzhu);

            } else {
                alert("数据获取失败！");
                remove_user_login_status(str.msg)
            }

        },
        fail: function(err, status) {
            alert("数据获取失败！");
            console.log(err);
        }
    });
}