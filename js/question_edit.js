$(document).ready(function() {
    is_need_login();
    initialize_page();
    set_copyright_version();

    var id = get_id();
    var editor = init_editor();
    get_question_detail(id, editor);
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
        var $li = $(
                '<div id="' + file.id + '" name="' + file.name + '" class="file-item thumbnail" style="width:100px;height:100px; display: inline-block;">' +
                '<img src="' + get_img_url(response.data) + '"/>' +
                '<input id="fengmian" type="hidden" value="' + response.data + '"/>' +
                '</div>'
            ),
            $img = $li.find('img');
        // $("#fileList").append($li); // 多图片上传用这个
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
        var iurl = "/question/update";
        var user_article_id = $("#user_article_id").val();
        // var user_article_tag = $("#user_article_tag").val();
        var user_article_title = $("#user_article_title").val();
        var user_article_breif = $("#user_article_breif").val();
        var user_article_content = editor.txt.html();
        var user_article_fenmian = $("#fengmian").val();
        var user_article_tag = '';
        $("button[value=true]").each(function() {
            user_article_tag = user_article_tag + $(this).text() + ","
        });



        if (user_article_tag == "" || user_article_title == "" || user_article_breif == "" || user_article_content == "" || user_article_fenmian == "") {
            alert("输入的参数存在空值!");
            return;
        }
        var datas = get_json({ "title": user_article_title, "content": user_article_content, "brief": user_article_breif, "tags": user_article_tag, "ximg": user_article_fenmian, "qid": user_article_id });
        $.ajax({
            url: get_url(iurl),
            type: "POST",
            data: datas,
            headers: get_headers(),
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) {
                if (str.status == 200) {
                    go_question_details(user_article_id);
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
function get_question_detail(id, editor) {
    $.ajax({
        type: 'get',
        url: get_url("/get/question?qid=" + id),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                var datas = str.data[0];

                var author_id = datas.uid;
                var author_name = datas.nickname;
                var author_headpic = get_img_url(datas.headpic)
                var author_infomation = datas.userinfo

                var question_reading = 456; // 阅读量
                var question_comments = 456; // 评论量
                var question_likes = datas.goods; // 点赞数
                var question_collectons = datas.collections; // 收藏量

                var question_id = datas.id; // 文章id
                var question_title = datas.title; // 标题
                var question_brief = datas.brief; // 标题
                var question_tags = datas.tags; // 标题
                var question_creattime = datas.times; // 创建时间
                var question_content = datas.content; // 简介
                var question_imag_url = datas.ximg; // 文章图片

                // testDrive判断是不是本人
                if (get_user_login_status() == false || author_id != get_user_info("user_userid")) {
                    alert("你不是本人，传送回详情页面！");
                    go_question_details(question_id);
                }
                // 回写问题信息
                $("#user_article_id").attr("value", question_id); // id
                $("#user_article_title").attr("value", question_title); // 标题
                $("#user_article_breif").attr("value", question_brief); // 标题
                $("#user_article_tag").attr("value", question_tags); // 标题
                editor.txt.html(question_content); // 内容
                var li = '<div id="WU_FILE_0" name="' + question_imag_url + '" class="file-item thumbnail" style="width:100px;height:100px; display: inline-block;">' +
                    '<img src="' + get_img_url(question_imag_url) + '"/>' +
                    '<input id="fengmian" type="hidden" value="' + question_imag_url + '"/>' +
                    '</div>'
                $("#fileList").html(li);

                // 设置元素
                var tags = experience_tags.split(",");
                $("#my_tags_list :button").each(function() {
                    for (j = 0; j < tags.length; j++) {
                        if ($(this).text() == tags[j]) {
                            $(this).attr('style', 'margin-top: 2px;margin-left: 2px; display:inline;background-color:#f7726b;');
                            $(this).val(true);
                        }
                    }
                });


                return author_id;
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