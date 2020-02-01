$(document).ready(function() {
    initialize_page();

    var id = get_id();
    var editor = init_editor();
    get_experience_detail(id, editor);

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
        var $li = $(
                '<div id="' + file.id + '" name="' + file.name + '" class="file-item thumbnail" style="width:100px;height:100px; display: inline-block;">' +
                '<img src="' + get_img_url(response.data) + '"/>' +
                '<input id="fengmian" type="hidden" value="' + response.data + '"/>' +
                '</div>'
            ),
            $img = $li.find('img');
        // $("#fileList").append($li); // 多图片上传用这个
        alert(response.data);

        $("#fileList").html($li);
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
        alert("上传失败，请检查服务器！");
    });

    // 修改问题
    $("#allcommit").click(function() {
        var iurl = "/article/update";
        var user_article_id = $("#user_article_id").val();
        var user_article_tag = $("#user_article_tag").val();
        var user_article_title = $("#user_article_title").val();
        var user_article_breif = $("#user_article_breif").val();
        var user_article_content = editor.txt.html();
        var user_article_fenmian = $("#fengmian").val();
        alert(user_article_fenmian);
        var datas = get_json({ "title": user_article_title, "content": user_article_content, "brief": user_article_breif, "tags": user_article_tag, "ximg": user_article_fenmian, "aid": user_article_id });
        $.ajax({
            url: get_url(iurl),
            type: "POST",
            data: datas,
            headers: get_headers(),
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) {
                if (str.status == 200) {
                    go_experience_details(user_article_id);
                } else {
                    alert(str.msg)
                    remove_user_login_status(str.msg)
                }
            },
            error: function(str) {
                alert("上传失败！")
            }
        });
    });


});

// 初始化editor
function init_editor() {
    var E = window.wangEditor
    var editor = new E('#editor')
    editor.customConfig.uploadImgServer = upload_url;
    editor.customConfig.uploadImgMaxSize = 20 * 1024 * 1024
    editor.customConfig.uploadFileName = 'file'
    editor.customConfig.withCredentials = true
    editor.customConfig.uploadImgHooks = {
        // fail: function(xhr, editor, result) {
        //     alert("插入图片上失败")
        // },
        // error: function(xhr, editor) {
        //     alert("插入图片报错了，请检查后端服")
        // },
        timeout: function(xhr, editor) {
            alert("插入图片超时")
        },
        customInsert: function(insertImg, result, editor) {
            var url = result.data // 图片地址
            insertImg(get_img_url(url)) // 插入图片
        }
    }
    editor.create()

    return editor
}

// 获取问题详情，并回写数据
function get_experience_detail(id, editor) {
    $.ajax({
        type: 'get',
        url: get_url("/get/article?aid=" + id),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                var datas = str.data[0];

                var author_id = datas.uid;
                var author_name = datas.nickname;
                var author_headpic = get_img_url(datas.headpic)
                var author_infomation = datas.userinfo

                var experience_reading = 456; // 阅读量
                var experience_comments = 456; // 评论量
                var experience_likes = datas.goods; // 点赞数
                var experience_collectons = datas.collections; // 收藏量

                var experience_id = datas.id; // 文章id
                var experience_title = datas.title; // 标题
                var experience_brief = datas.brief; // 标题
                var experience_tags = datas.tags; // 标题
                var experience_creattime = datas.times; // 创建时间
                var experience_content = datas.content; // 简介
                var experience_imag_url = datas.ximg; // 文章图片

                // testDrive判断是不是本人
                if (get_user_login_status() == false || author_id != get_user_info("user_userid")) {
                    alert("你不是本人，传送回详情页面！");
                    go_experience_details(experience_id);
                }
                // 回写问题信息
                $("#user_article_id").attr("value", experience_id); // id
                $("#user_article_title").attr("value", experience_title); // 标题
                $("#user_article_breif").attr("value", experience_brief); // 标题
                $("#user_article_tag").attr("value", experience_tags); // 标题
                editor.txt.html(experience_content); // 内容
                var li = '<div id="WU_FILE_0" name="' + experience_imag_url + '" class="file-item thumbnail" style="width:100px;height:100px; display: inline-block;">' +
                    '<img src="' + get_img_url(experience_imag_url) + '" style="width:90px; height:90px;"/>' +
                    '<input id="fengmian" type="hidden" value="' + experience_imag_url + '"/>' +
                    '</div>'
                $("#fileList").html(li);

            } else {
                alert("获取数据失败！");
                remove_user_login_status(str.msg)

            }
        },
        fail: function(err, status) {
            alert("获取数据失败！");
            console.log(err);
        }
    });
}