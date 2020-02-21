$(document).ready(function() {
    is_need_login();
    initialize_page();
    set_copyright_version();

    var editor = init_editor();

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
        alert("上传失败，请检查服务器！")
    });

    // 提交文章
    $("#allcommit").click(function() {
        is_need_login();

        var iurl = "/question/new";
        var user_article_tag = $("#user_article_tag").val()
        var user_article_title = $("#user_article_title").val()
        var user_article_breif = $("#user_article_breif").val()
        var user_article_content = editor.txt.html();
        var user_article_fenmian = $("#fengmian").val();

        if (user_article_tag == "" || user_article_title == "" || user_article_breif == "" || user_article_content == "" || user_article_fenmian == "") {
            alert("输入的参数存在空值!");
            return;
        }
        var datas = get_json({ "title": user_article_title, "content": user_article_content, "brief": user_article_breif, "tags": user_article_tag, "ximg": user_article_fenmian })
        $.ajax({
            url: get_url(iurl),
            type: "POST",
            data: datas,
            headers: get_headers(),
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) {
                if (str.status == 200) {
                    // 返回文章id给我
                    var id = str.data.questionid;
                    go_question_details(id);
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