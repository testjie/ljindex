$(document).ready(function() {
    initialize_page()
    get_inspirations_list(1);

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

    // 图片预览方法
    uploader.on('fileQueued', function(file) {

    });

    //上传进度条
    uploader.on('uploadProgress', function(file, percentage) {});

    // 上传成功
    uploader.on('uploadSuccess', function(file, response) {

        var $li = $(
                '<div id="' + file.id + '" name="' + file.name + '" class="file-item thumbnail" style="width:100px;height:100px; display: inline-block;">' +
                '<img class="test" src="' + get_img_url(response.data) + '" value="' + response.data + '">' +
                '</div>'
            ),
            $img = $li.find('img');
        $("#fileList").append($li); // 多图片上传用这个
        uploader.makeThumb(file, function(error, src) {
            if (error) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }
            $img.attr('src', src);
        }, 100, 100);
    });

    // 上传失败
    uploader.on('uploadError', function(file) {
        alert("上传失败，请检查服务器！")
    });



    // 登录请求
    $("#commit").click(function() {
        var img_names = "";
        var message = $('#message').val();
        $("img.test").each(function() {
            img_names = img_names + $(this).attr("value") + ",";
        })

        var datas = get_json({ 'content': message, 'ximg': img_names })
        $.ajax({
            type: 'post',
            url: get_url("/inspirer/new"),
            headers: get_headers(),
            data: datas,
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) { //返回json结果
                if (str.status == 200) {
                    // 登录成功
                    get_inspirations_list(1)
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


// 获取问题列表
function get_inspirations_list(nums) {
    $("#loadgif").show();
    $.ajax({
        type: 'get',
        url: get_url("/getinspirer?pagenum=" + nums),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 获取成功
                var c = '';
                var content = '';
                var datas = str.data.contentlist
                var counts = str.data.counts
                for (var i = 0; i < datas.length; i++) {
                    var author_id = datas[i].id;
                    var author_name = datas[i].nickname
                    var author_infomation = datas[i].userinfo
                    var author_headpic = get_img_url(datas[i].headpic)


                    var inspiration_reading = 456; // 阅读量
                    var inspiration_comments = 456; // 评论量
                    var inspiration_likes = datas[i].goods; // 点赞数
                    var inspiration_collectons = datas[i].collections; // 收藏量

                    var inspiration_id = datas[i].id; // 文章id
                    var inspiration_title = datas[i].title; // 标题
                    var inspiration_content = datas[i].content; // 简介
                    var inspiration_creattime = datas[i].times; // 创建时间
                    var ximg_data = datas[i].ximg.split(",")


                    c = '<div class="list-item">' +
                        '<div class="user-box">' +
                        '<div class="img-box">' +
                        '<img src="' + author_headpic + '"onclick="go_personal_center(' + author_id + ')" style="cursor:pointer;" />' +
                        '</div>' +
                        '<div class="info">' +
                        '<p class="name" onclick="go_personal_center(' + author_id + ')" style="cursor:pointer;">' + author_name + '</p>' +
                        '<div class="info-other">' +
                        '<p class="job">' + author_infomation + '</p>' +
                        '<span class="date">&nbsp;&nbsp;  ' + inspiration_creattime + '</span>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<p class="desc" style="word-break:break-all;" onclick="go_inspiration_details(' + inspiration_id + ')" style="cursor:pointer;">' + inspiration_content + '</p>' +
                        '<div class="list-item-imgs" onclick="go_inspiration_details(' + inspiration_id + ')" style="cursor:pointer;">';

                    // 遍历图片
                    if (ximg_data != "") {
                        for (j = 0; j < ximg_data.length; j++) {
                            var d = '<div class="img-box">' +
                                '<img src="' + get_img_url(ximg_data[j]) + '" alt="" style="width:259px;height:164px;" />' +
                                '</div>';
                            c = c + d;
                        }
                    }

                    c = c + '</div>' +
                        '<div class="list-item-tool">' +
                        '<div class="item item-icon">' +
                        '<span class="glyphicon glyphicon-open"></span>' +
                        '<span>转发(' + inspiration_reading + ')</span>' +
                        '</div>' +

                        '<div class="item item-icon">' +
                        '<span class="glyphicon glyphicon-comment"></span>' +
                        '<span>评论(' + inspiration_comments + ')</span>' +
                        '</div>' +
                        '<div class="item item-icon">' +
                        '<span class="glyphicon glyphicon-thumbs-up"></span>' +
                        '<span>点赞(' + inspiration_likes + ')</span>' +
                        '</div>' +
                        '</div>' +
                        '</div>';


                    content = content + c;
                }
                $('#inspiration_list').html(content);
                $('#total').text("全部(" + counts + ")");
                $('#total').val(counts);
                compute_pagenum(nums, "get_inspirations_list", -10000) // 分页相关


            } else {
                alert("推荐教程获取失败！");
                remove_user_login_status(str.msg)

            }

        },
        fail: function(err, status) {
            alert("推荐教程获取失败！");
            console.log(err);
        }
    });
}

// 跳转到教程详情页面
function go_inspiration_details(aid) {
    window.location.href = "inspiration_detail.html?aid=" + aid;
}

// 是否显示回复框
function show_repeat_div(id) {
    var status = $("#q" + id).css('display');
    if (status == 'none') {
        $("#q" + id).show();
    } else {
        $("#q" + id).hide();
    }
}

// 回复问题
function repeat_inspiration(id) {
    var inspiration_id = id;
    var repeat_content = $("#q" + inspiration_id).val();
    var datas = get_json({ "ctype": 1, "comment": repeat_content, "fid": inspiration_id });
    $.ajax({
        type: 'post',
        url: get_url("/comment/new"),
        headers: get_headers(),
        data: datas,
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 回复成功
                alert("评论成功")
                go_inspiration_details(inspiration_id)
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
}