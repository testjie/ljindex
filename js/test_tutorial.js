$(document).ready(function() {
    initialize_page()
    get_tutorials_list(1);
});


// 获取教程列表
function get_tutorials_list(nums) {
    $.ajax({
        type: 'get',
        url: get_url("/getcoures?pagenum=" + nums),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 获取成功
                var content = '';
                var datas = str.data.contentlist
                var counts = str.data.counts
                for (var i = 0; i < datas.length; i++) {
                    var author_name = datas[i].nickname
                    var author_headpic = get_img_url(datas[i].headpic)
                    var author_infomation = datas[i].userinfo

                    var tutorial_reading = 456; // 阅读量
                    var tutorial_comments = 456; // 评论量
                    var tutorial_likes = datas[i].goods; // 点赞数
                    var tutorial_collectons = datas[i].collections; // 收藏量

                    var tutorial_id = datas[i].id; // 文章id
                    var tutorial_title = datas[i].title; // 标题
                    var tutorial_content = datas[i].brief; // 简介
                    var tutorial_creattime = datas[i].times; // 创建时间
                    var tutorial_imag_url = get_img_url(datas[i].ximg); // 文章图片

                    var c = '<div class="list-item" onclick="go_tutorials_details(' + tutorial_id + ')" style="cursor:pointer;">' +
                        '<p class="list-item-title">' + tutorial_title + '</p>' +
                        '<div class="user-box">' +
                        '<div class="img-box">' +
                        '<img src="' + author_headpic + '" alt="" />' +
                        '</div>' +
                        '<div class="info">' +
                        '<p class="name">' + author_name + '</p>' +
                        '<p class="job">' +
                        '<span>' + author_infomation + '</span>' +
                        '</p>' +
                        '</div>' +
                        '</div>' +
                        '<div class="infos">' +
                        '<div class="img-box">' +
                        '<img src="' + tutorial_imag_url + '" alt="" />' +
                        '</div>' +
                        '<div class="desc">' +
                        '<p class="desc-word">' + tutorial_content + '</p class="desc-word">' +
                        '<a href="./test_tutorial_detail.html?aid=' + tutorial_id + '" class="more">' +
                        '<label class="cf7">[...阅读全文]</label>' +
                        '</a>' +
                        '</div>' +
                        '</div>' +
                        '<div class="other">' +
                        '<span class="other-item date">' + tutorial_creattime + '</span>' +
                        '<div class="other-item other-icon">' +
                        '<span class="glyphicon glyphicon-comment"></span>' +
                        '<span>' + tutorial_comments + '</span>' +
                        '</div>' +
                        '<div class="other-item other-icon">' +
                        '<span class="glyphicon glyphicon-open"></span>' +
                        '<span>' + tutorial_collectons + '</span>' +
                        '</div>' +
                        '<div class="other-item other-icon">' +
                        '<span class="glyphicon glyphicon-user"></span>' +
                        '<span>' + tutorial_reading + '</span>' +
                        '</div>' +
                        '<div class="other-item other-icon">' +
                        '<span class="glyphicon glyphicon-heart"></span>' +
                        '<span>' + tutorial_likes + '</span>' +
                        '</div>' +
                        '</div>' +
                        '</div>'

                    content = content + c;
                }
                $('#tutorial_list').html(content);

                // 分页相关
                $('#total').val(counts);
                compute_pagenum(nums, "get_tutorials_list", -10000)

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
function go_tutorials_details(aid) {
    window.location.href = "test_tutorial_detail.html?aid=" + aid;
}