$(document).ready(function() {
    is_need_login();
    initialize_page();
    set_copyright_version();

    var id = get_id();
    var editor = init_editor();
    get_inspiration_detail(id, editor);

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
        // 循环换找一下有几个
        var img_names = "";
        $("img.test").each(function() {
            img_names = img_names + $(this).attr("value") + ",";
        });
        var img_id = parseInt(img_names.split(",").length) + 1;

        var $li = $(
                '<div id="WU_FILE_' + img_id + '" name="' + file.name + '" class="file-item thumbnail" style="width:100px;height:100px; display: inline-block;">' +
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
        alert("上传失败，请检查服务器！");
    });

    // 提交灵感
    $("#allcommit").click(function() {
        var img_names = "";
        var message = editor.txt.html();
        var id = $("#user_article_id").val(); // id
        $("img.test").each(function() {
            img_names = img_names + $(this).attr("value") + ",";
        });

        if (message == '') {
            alert('信息不能为空！');
            return;
        }

        var datas = get_json({ 'content': message, 'ximg': img_names, 'iid': id })
        $.ajax({
            type: 'post',
            url: get_url("/inspirer/update"),
            headers: get_headers(),
            data: datas,
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(str) { //返回json结果
                if (str.status == 200) {
                    // 登录成功
                    go_inspiration_details(id);
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
function get_inspiration_detail(id, editor) {
    $.ajax({
        type: 'get',
        url: get_url("/get/inspirer?iid=" + id),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                var datas = str.data[0];

                var author_id = datas.uid;
                var inspiration_id = datas.id; // 文章id
                var inspiration_title = datas.title; // 标题
                var inspiration_brief = datas.brief; // 标题
                var inspiration_tags = datas.tags; // 标题
                var inspiration_content = datas.content; // 简介
                var inspiration_imag_url = datas.ximg; // 文章图片

                // testDrive判断是不是本人
                if (get_user_login_status() == false || author_id != get_user_info("user_userid")) {
                    alert("你不是本人，传送回详情页面！");
                    go_inspiration_details(inspiration_id);
                }
                // 回写问题信息
                $("#user_article_id").attr("value", inspiration_id); // id
                $("#user_article_title").attr("value", inspiration_title); // 标题
                $("#user_article_breif").attr("value", inspiration_brief); // 标题
                $("#user_article_tag").attr("value", inspiration_tags); // 标题
                editor.txt.html(inspiration_content); // 内容
                imgs = inspiration_imag_url.split(",");
                var li = "";
                for (i = 0; i < imgs.length; i++) {
                    li = li + '<div id="WU_FILE_' + i + '" name="' + imgs[i] + '" class="file-item thumbnail" style="width:100px;height:100px; display: inline-block;">' +
                        '<img class="test"  src="' + get_img_url(imgs[i]) + '" value="' + imgs[i] + '" style="width:90px; height:90px;"/>' +
                        '</div>';
                }
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

function get_id() {
    return window.location.href.split('=')[1].replace('#', '');
}