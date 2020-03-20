// const baseurl = "http://192.168.0.103:2333";
// const baseurl = "http://132.232.44.158:2333";
const baseurl = "http://192.144.148.91:2333";
// const baseurl = "http://127.0.0.1:5000";
// const baseurl = "http://192.168.1.100:5000";
// const baseurl = "http://132.232.44.158:2333";

const upload_url = baseurl + "/uploadedit"

const __version__ = "1.0.9"


// 类型
const question_type = 1
const experience_type = 3
const inspiration_type = 2
const test_tutorial_type = 0




// 获取全局的地址
function get_url(url) {
    return baseurl + url;
}

// 获取传递的json数据
function get_json(data) {
    return JSON.stringify(data);
}

// 获取headers
function get_headers() {
    return { "token": get_user_info("user_token"), "Content-Type": "application/json" };
}

// 保存信息
function save_user_info(key, value) {
    window.localStorage.setItem(key, value);
}


// 获取信息
function get_user_info(key) {
    return window.localStorage.getItem(key);
}

// 删除信息
function remove_user_info(key) {
    localStorage.removeItem(key);
}

// 跳转到下个页面
function go_next_page(url) {
    window.location.href = url;
}

// 重新加载当前页面
function reload_current_page() {
    window.location.reload();
}

// 返回上一个页面
function go_pre_page() {
    window.history.back(-1);
}

// 替换字符串
function replace_null(data) {
    if (data == null) {
        return "";
    } else {
        return data;
    }
}

// 退出
function user_logout() {
    $.ajax({
        type: 'get',
        url: get_url("/logout"),
        headers: get_headers(),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                remove_user_login_status(str.msg)
            } else {
                remove_user_login_status(str.msg)
            }
        },
        fail: function(err, status) {
            alert("接口数据获取失败！");
            console.log(err);
        }
    });
}

// 删除用户信息
function remove_user_login_status(data) {
    if (data == "token无效，请重新登录" || data == "请先登录后再操作！") {
        if (get_user_login_status() == true) {
            remove_user_info("user_token")
            remove_user_info("user_userid")
            remove_user_info("user_headpic")
            remove_user_info("user_nickname")
            reload_current_page()
        }
    }
}

// 获取用户是否登录
function get_user_login_status() {
    var user_token = get_user_info("user_token")
        // 已登录
    if (user_token != null) {
        return true
    }
    // 未登录
    return false
}

// 获取图片地址
function get_img_url(imgname) {
    return get_url("/imgs?imgname=" + imgname)
}

// 获取编辑器的图片url
function get_img_content_url(imgname) {
    return get_url("/" + imgname)
}

// 设置用户导航栏信息
function set_user_navigation(dispaly, is_index = false) {
    var personal_url = "personal.html"
    if (is_index == true) {
        personal_url = "html/personal.html"
    }
    if (dispaly == true) {
        var pid = get_user_info("user_userid")
        var headpic = get_img_url(get_user_info("user_headpic"))
        $('#headpic_nav').attr("src", headpic) // 用户头像
        $('#personal').attr("href", personal_url + "?pid=" + pid) // 用户跳转链接
        $('#unlogin').attr("class", "utils-box logged log_hide")
        $('#logined').attr("class", "utils-box logged log_show")
    }
}

// 评论
$("#first_comment").click(
    function() {
        console.log("xxx///////////////");
        $(this).parents(".comment-item-info").find(".comment-input").toggle();
    }
);
$("#other_comment").click(
    function() {
        console.log("xxx///////////////");
        $(this).parents(".comment-item-info").find(".comment-input").toggle();
    }
);
$("#first_comment_other").click(
    function() {
        console.log("xxx///////////////");
        $(this).parents(".comment-item-info").find(".comment-input").toggle();
    }
);
// 点赞
$("#comment .comment-item .star").click(function() {
    alert("点赞+1");
});

//导航点击
$('#meaus .meaus-item').on('click', function() {
    $('#meaus .meaus-item').removeClass('meaus-item-active')
    $(this).addClass('meaus-item-active')
})

// 导航切换
$(".select-menu1").click(function() {
    $(".select-menu2").removeClass("showmenu");

    if ($(".select-menu1").hasClass("showmenu")) {
        $(".select-menu1").removeClass("showmenu");
    } else {
        $(".select-menu1").addClass("showmenu");
        console.log("xx");
        $(".select-menu2").removeClass("showmenu");
    }
});

$(".select-menu2").click(function() {
    $(".select-menu1").removeClass("showmenu");

    if ($(".select-menu2").hasClass("showmenu")) {
        $(".select-menu2").removeClass("showmenu");
    } else {
        $(".select-menu2").addClass("showmenu");
        $(".select-menu1").removeClass("showmenu");
    }
});


// 首页初始化方法
function initialize_page(is_index = false) {
    is_index = is_index;
    var is_logined = false;
    var token = get_user_info("user_token");
    if (token != null) {
        // 显示用户信息
        is_logined = true;
    }
    set_user_navigation(is_logined, is_index);
};

// 设置版本号和版权
function set_copyright_version() {
    $(".copyright").html("Copyright @ 2019-2020 All rights reserved 浪晋科技. Powered by 流云. 当前版本: " + __version__);
}



// ================== 左侧窗口页面

// 跳转到个人中心详情
function go_personal_details(id, is_index = false) {
    var personal_url = "personal.html?pid=" + id
    if (is_index == true) {
        personal_url = "html/personal.html?pid=" + id
    }
    window.location.href = personal_url
}

// 跳转到写文章页面
function go_write_article(is_index = false) {
    var login_url = "login.html"
    var write_article_url = "experience_new.html"
    if (is_index == true) {
        login_url = "html/login.html"
        write_article_url = "html/experience_new.html"
    }
    if (get_user_login_status() == false) {
        alert("请先登录")
        window.location.href = login_url
        return
    }
    window.location.href = write_article_url
}

// 跳转到写灵感页面
function go_write_inspiration(is_index = false) {
    var login_url = "login.html"
    var write_inspiration_url = "inspiration.html"
    if (is_index == true) {
        login_url = "html/login.html"
        write_inspiration_url = "html/inspiration.html"
    }

    if (get_user_login_status() == false) {
        alert("请先登录")
        window.location.href = login_url
        return
    }
    window.location.href = write_inspiration_url
}

// 跳转到写疑惑页面
function go_write_question(is_index = false) {
    var login_url = "login.html"
    var put_question_url = "question_new.html"
    if (is_index == true) {
        login_url = "html/login.html"
        put_question_url = "html/question_new.html"
    }
    if (get_user_login_status() == false) {
        alert("请先登录")
        window.location.href = login_url
        return
    }
    window.location.href = put_question_url
}

// 跳转到学习页面
function go_student_learn(is_index = false) {
    alert("暂未开放!");
}

// 跳转到练习页面
function go_student_answering(is_index = false) {
    alert("暂未开放!");
    return;
    var login_url = "login.html"
    var answer_url = "answer.html"
    if (is_index == true) {
        login_url = "html/login.html"
        answer_url = "html/answer.html"
    }
    if (get_user_login_status() == false) {
        alert("请先登录")
        window.location.href = login_url
        return
    }
    window.location.href = answer_url
}

// 跳转到实战页面
function go_actual_combat_project(is_index = false) {
    alert("暂未开放!");
    return;
    var login_url = "login.html"
    var actual_combat_project = "actual_combat_project.html"
    if (is_index == true) {
        login_url = "html/login.html"
        actual_combat_project = "html/actual_combat_project.html"
    }
    if (get_user_login_status() == false) {
        alert("请先登录")
        window.location.href = login_url
        return
    }
    window.location.href = actual_combat_project
}

// 跳转到个人中心
function go_personal_center(id, is_index = false) {
    var personal_url = "personal.html?uid=" + id;
    if (is_index == true) {
        personal_url = "html/personal.html?uid=" + id;
    }
    window.location.href = personal_url;
}

// 教程/文章/提问/灵感/评论的分页
function compute_pagenum(id, method, cid = -10000, ctype = -10000) {
    // id：当前第几页
    // method:方法名字
    // cid : 
    var total = $('#total').val();
    var last = Math.ceil(total / 10);
    var next = id + 1;
    var pres = id - 1;
    if (next > last) {
        next = last;
    }
    if (pres < 1) {
        pres = 1
    }

    if (cid == -10000) {
        $("#pre").attr("href", "javascript:" + method + "(" + pres + "," + ctype + "," + cid + ")")
        $("#next").attr("href", "javascript:" + method + "(" + next + "," + ctype + ", " + cid + ")")
        $("#current").text("第" + id + "页/共" + last + "页")
    } else {
        $("#pre").attr("href", "javascript:" + method + "(" + cid + "," + ctype + " ," + pres + ")")
        $("#next").attr("href", "javascript:" + method + "(" + cid + "," + ctype + "," + next + ")")
        $("#current").text("第" + id + "页/共" + last + "页")
    }

}


// 搜索的查询
function compute_pagenum_by_search(id, method, tagname = '', ctype = -10000) {
    // id：当前第几页
    // method:方法名字
    // cid : 
    var total = $('#total').val();
    var last = Math.ceil(total / 10);
    var next = id + 1;
    var pres = id - 1;
    if (next > last) {
        next = last;
    }
    if (pres < 1) {
        pres = 1
    }

    $("#pre").attr("href", "javascript:" + method + "('" + tagname + "'," + ctype + " ," + pres + ")")
    $("#next").attr("href", "javascript:" + method + "('" + tagname + "'," + ctype + "," + next + ")")
    $("#current").text("第" + id + "页/共" + last + "页")
}


// 用户分页计算
function user_compute_pagenum(id, method, uid, cid = -10000) {
    var total = $('#total').val();
    var last = Math.ceil(total / 10);
    var next = id + 1;
    var pres = id - 1;
    if (next > last) {
        next = last;
    }
    if (pres < 1) {
        pres = 1
    }

    if (cid == -10000) {
        $("#pre").attr("href", "javascript:" + method + "(" + pres + "," + uid + "," + cid + ")");
        $("#next").attr("href", "javascript:" + method + "(" + next + "," + uid + "," + cid + ")");
        $("#current").text("第" + id + "页/共" + last + "页");
    } else {
        $("#pre").attr("href", "javascript:" + method + "(" + cid + "," + uid + "," + pres + ")");
        $("#next").attr("href", "javascript:" + method + "(" + cid + "," + uid + "," + next + ")");
        $("#current").text("第" + id + "页/共" + last + "页");
    }
}

// 为空不能提交
function is_content_not_null(c) {
    if (c == "") {
        alert("输入内容不能为空！");
        throw SyntaxError("输入内容不能为空");
    }
}

function get_user4_status(ctype, fid) {
    // ctype: 0教程1提问2灵感3心得体会
    // fid: 对应的id；评论就是评论id

    // 查询用户是否登录
    if (get_user_login_status() == false) {
        return "1,1,1";
    }

    var user_like = "";
    datas = get_json({ "ctype": ctype, "fid": fid });
    $.ajax({
        type: 'post',
        url: get_url("/getuser4status"),
        headers: get_headers(),
        data: datas,
        async: false, // 等待响应
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            var gstatus = 0; // 点赞 0 已点赞 ；1 未点赞。
            var fstatus = 0; // 关注
            var cstatus = 0; // 收藏
            if (str.status == 200) {
                // 评论成功, 局部刷新评论内容，待做
                if (str.data.length == 0) {
                    user_like = "1,1,1,"
                } else {
                    user_like = str.data[0].gstatus + "," + str.data[0].fstatus + "," + str.data[0].cstatus;
                }
            } else {
                // alert(str.msg);
                // remove_user_login_status(str.msg)
            }
        },
        fail: function(err, status) {
            alert(err.data);
            console.log(err);
        }
    });
    return user_like;
}


// 关注
function follow_user(fid) {

    // 游客滚粗
    is_need_login();

    // 开始关注/取消关注
    $.ajax({
        type: 'get',
        url: get_url("/userfuser?fid=" + fid),
        async: false,
        headers: get_headers(),
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 获取成功
                // 1.未关注; 0.已关注
                // 0已关注，现在就要去取消关注
                if ($('#update_user_info').attr("name") == "关注") {
                    $('#update_user_info').text("取消关注");
                    $('#update_user_info').attr("name", "取消关注"); //0已关注
                    $('#update_user_info').removeAttr("target");
                    $('#update_user_info').attr("href", 'javascript:follow_user(' + $('#uid').val() + ');');
                    var fans = Number($('#fans').text())
                    fans = fans + 1
                    $('#fans').text(fans);
                } else { // 现在去关注
                    $('#update_user_info').text("关注");
                    $('#update_user_info').attr("name", "关注"); //0已关注
                    $('#update_user_info').removeAttr("target");
                    $('#update_user_info').attr("href", 'javascript:follow_user(' + $('#uid').val() + ');');
                    var fans = Number($('#fans').text())
                    fans = fans - 1
                    $('#fans').text(fans);
                }
                alert(str.msg);
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

//获取是不是当前用的粉丝
function get_user_is_fans(fid) {
    var fans_status = "未关注";
    if (get_user_login_status() == false) {
        return fans_status;
    }

    $.ajax({
        type: 'get',
        url: get_url("/getuserfstatus?fid=" + fid),
        async: false,
        headers: get_headers(),
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 获取成功
                // 1.未关注; 0.已关注
                if (str.data == "0") {
                    fans_status = "已关注"
                }
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

    return fans_status;
}



// 获取密保问题
function get_mb_list() {
    $.ajax({
        type: 'get',
        url: get_url("/getmblist"),
        headers: get_headers(),
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            if (str.status == 200) {
                var id1 = str.data[0].id;
                var qs1 = str.data[0].question;
                var id2 = str.data[1].id;
                var qs2 = str.data[1].question;
                var id3 = str.data[2].id;
                var qs3 = str.data[2].question;

                $("#q1").text(qs1);
                $("#q1").attr("name", id1);
                $("#q2").text(qs2);
                $("#q2").attr("name", id2);
                $("#q3").text(qs3);
                $("#q3").attr("name", id3);

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
}


function get_comments_paging(id, ctype, pagenum) {
    var fid = id; // 文章id
    var ctype = ctype; // 0教程 1提问 2灵感 3文章
    var pagenum = pagenum; // 分页数

    var datas = get_json({ "fid": fid, "ctype": ctype, "pagenum": pagenum })
    $.ajax({
        type: 'post',
        data: datas,
        url: get_url("/getcomments?pagenum=" + pagenum),
        headers: get_headers(),
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            if (str.status == 200) {
                var counts = str.data.counts;
                var datas = str.data.contentlist;
                var content = '<p class="comment-title">' +
                    '<span>全部评论</span><span class="num">' + counts + '</span>' +
                    '</p>';
                for (var i = 0; i < datas.length; i++) {
                    var author_id = datas[i].uid;
                    var author_name = datas[i].nickname;
                    var author_infomation = datas[i].userinfo;
                    var author_headpic = get_img_url(datas[i].headpic);

                    var tutorial_id = datas[i].id; // 文章id
                    var tutorial_comment = datas[i].comment; // 简介
                    var tutorial_creattime = datas[i].times;
                    var conment_id = datas[i].id;

                    // 判断是否可以修改
                    var c = '<div class="comment-item">' +
                        '<div class="img-box">' +
                        '<img src="' + author_headpic + '" onclick="go_personal_center(' + author_id + ')" style="cursor:pointer;"/>' +
                        '</div>' +
                        '<div class="comment-item-info">' +
                        '<div class="info">' +
                        '<div class="first-comment">' +
                        '<div class="user">' +
                        '<p class="name" onclick="go_personal_center(' + author_id + ')" style="cursor:pointer;">' + author_name + '</p>' +
                        '<p class="job">' + author_infomation + '</p>' +
                        '</div>' +
                        '<div class="date">' + tutorial_creattime + '</div>' +
                        '<p id="content' + conment_id + '" class="word" style="word-break:break-all;">' + tutorial_comment + '</p>' +
                        '<div class="info-other">' +
                        '<div class="operate">' +
                        '<label id="first_comment">';
                    // '<span title=" 评论" class="glyphicon glyphicon-comment"></span> 评论</label id="first_comment" >' +
                    // '<label><span title=" 点赞" class="glyphicon glyphicon-thumbs-up star"></span> 点赞</label>';

                    if (get_is_author(author_id) == true) {
                        c = c + '<label style="color: #f7726b;" onclick="show_comments(' + conment_id + ')"><span title=" 编辑" class="glyphicon glyphicon-edit"></span> 编辑</label>' +
                            '<label style="color: #f7726b;" onclick="delete_comments(' + conment_id + ', ' + id + ',' + ctype + ')"><span title=" 删除" class="glyphicon glyphicon glyphicon-remove-sign"></span> 删除</label>';
                    }
                    c = c + '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>'

                    content = content + c
                    if (i == 0) {
                        $("#repeat_cid").attr("value", conment_id);
                    }
                }
                $('#comment').html(content);
                $('#total').attr("value", counts);
                if (ctype == 0) {
                    var cid = $('#tutorial_id').val();
                }
                if (ctype == 1) {
                    var cid = $('#question_id').val();
                }
                if (ctype == 2) {
                    var cid = $('#inspiration_id').val();
                }
                if (ctype == 3) {
                    var cid = $('#experience_id').val();
                }
                compute_pagenum(pagenum, "get_comments_paging", cid, ctype)
                    // 已点赞和已收藏的用户显示红色点赞和红色收藏按钮，待做
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

// 删除评论
function delete_comments(id, fid, ctype) {
    var datas = get_json({ "cid": id });
    $.ajax({
        type: 'post',
        data: datas,
        url: get_url("/comment/delete"),
        headers: get_headers(),
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            if (str.status == 200) {
                get_comments_paging(fid, ctype, 1);
            } else {
                alert(str.msg);
            }
        },
        fail: function(err, status) {
            alert("获取数据失败！");
            console.log(err);
        }
    });
}

// 全局搜索跳转
function go_search_page(key, ctype, is_index = false) {
    var url = '';
    if (is_index == true) {
        url = "html/";
    }
    if (ctype == experience_type) {
        url = url + "experience.html?sk=" + key;
    }
    if (ctype == test_tutorial_type) {
        url = url + "test_tutorial.html?sk=" + key;
    }
    if (ctype == question_type) {
        url = url + "question.html?sk=" + key;
    }
    go_next_page(url);
}


// 点击事件搜索
function all_search(is_index = false) {
    var key = $('#all_search').val();
    if (check_null(key) == false) {
        alert("输入内容不能为空!");
        return;
    }
    var ctype = $("#search_type option:selected").text();
    if (ctype == "文章") {
        ctype = experience_type;
    }
    if (ctype == "教程") {
        ctype = test_tutorial_type;
    }
    if (ctype == "问题") {
        ctype = question_type;
    }
    go_search_page(key, ctype, is_index);
}


// 修改评论
function update_comments(id, content) {
    var content = $("#repeat" + id).val();
    var datas = get_json({ "cid": id, "comment": content });
    $.ajax({
        type: 'post',
        data: datas,
        url: get_url("/comment/update"),
        headers: get_headers(),
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            if (str.status == 200) {
                $("#content" + id).html('');
                $("#content" + id).text(content);
            } else {
                alert(str.msg);
            }
        },
        fail: function(err, status) {
            alert("获取数据失败！");
            console.log(err);
        }
    });
}


// 设置按钮选中状态
function set_tag_btn(id) {
    var btn = $('#tag' + id);
    if (btn.attr('style') == 'margin-top: 2px;margin-left: 2px; display:inline') {
        btn.attr('style', 'margin-top: 2px;margin-left: 2px; display:inline;background-color:#f7726b;');
        btn.val(true);
    } else {
        btn.attr('style', 'margin-top: 2px;margin-left: 2px; display:inline');
        btn.val(false);
    }
}

// 设置用户tags
// function set_user_tags(ctype) {
//     var url = "/getmytaglist?type=" + ctype;
//     $.ajax({
//         url: get_url(url),
//         type: "get",
//         headers: get_headers(),
//         xhrFields: { withCredentials: true },
//         crossDomain: true,
//         success: function(str) {
//             if (str.status == 200) {
//                 var tags = str.data.tags;
//                 tags = tags.split(",");
//                 var c = '';
//                 for (j = 0; j < tags.length; j++) {
//                     c = c + '<button id="tag' + j + '" value="" type="button" style="margin-top: 2px;margin-left: 2px; display:inline"' +
//                         ' class="btn-tags" onclick="set_tag_btn(' + j + ')">' + tags[j] + '</button>';
//                 }
//                 c = c + '<button style="margin-top: 2px;margin-left: 2px;width: 40px; display:inline" class="btn-tags" id="new_tags" onclick="new_tags()">+</button>';
//                 $("#my_tags_list").html(c);
//             } else {
//                 alert(str.msg);
//                 remove_user_login_status(str.msg)
//             }
//         },
//         error: function(str) {
//             alert("上传失败！")
//         }
//     });
// }

// 获取用户个人标签
function get_user_tags(ctype) {
    var url = "/getmytaglist?type=" + ctype;
    $.ajax({
        url: get_url(url),
        type: "get",
        headers: get_headers(),
        xhrFields: { withCredentials: true },
        crossDomain: true,
        async: false,
        success: function(str) {
            if (str.status == 200) {
                var tags = str.data.tags;
                tags = tags.split(",");
                var c = '';
                for (j = 0; j < tags.length; j++) {
                    c = c + '<button id="tag' + j + '" value="" type="button" style="margin-top: 2px;margin-left: 2px; display:inline"' +
                        ' class="btn-tags" onclick="set_tag_btn(' + j + ')">' + tags[j] + '</button>';
                }
                c = c + '<button style="margin-top: 2px;margin-left: 2px;width: 40px; display:inline" class="btn-tags" id="new_tags" onclick="new_tags()">+</button>';
                $("#my_tags_list").html(c);
            } else {
                alert(str.msg);
                remove_user_login_status(str.msg)
            }
        },
        error: function(str) {
            alert("上传失败！")
        }
    });
}



// 新增标签
function new_tags() {
    var status = $("#new_tags").text();
    if (status == "+") {
        $('#new_tag_div').show();
        $("#new_tags").text('取消');
    } else {
        $('#new_tag_div').hide();
        $("#new_tags").text('+')
    }
}
// 提交
function commit_tag(ctype) {
    var tag = $("#new_tag").val();
    if (tag == '') {
        alert("标签不能为空!");
        return
    }

    var url = "/newmytag";
    var datas = get_json({ "type": ctype, "tag": tag });
    $.ajax({
        url: get_url(url),
        type: "post",
        data: datas,
        headers: get_headers(),
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) {
            if (str.status == 200) {
                // 成功:重新加载标签
                get_user_tags(ctype);
                $('#new_tag_div').hide();
                $("#new_tags").text('+')
            } else {
                alert(str.msg);
                remove_user_login_status(str.msg)
            }
        },
        error: function(str) {
            alert("操作失败！")
        }
    });

}


// 显示修改框
function show_comments(id) {
    var content = $("#content" + id).text();
    $('#comment_tmp').text(content);
    var input = '<div class="comment-input" style="display: block;" id="comment-input-' + id + '">' +
        '<textarea placeholder="说点什么" class="message" name="" id="repeat' + id + '">' + content + '</textarea>' +
        '<div class="btn-box">' +
        '<div class="btn" onclick="update_comments(' + id + ')" style="marggin-right:10px;">提交</div>' +
        '<div class="btn" onclick="hide_comments(' + id + ')">取消</div>' +
        '</div>' +
        '</div>';
    $("#content" + id).html(input);
}

// 取消修改
function hide_comments(id) {
    $("#content" + id).html('');
    $("#content" + id).text($('#comment_tmp').text());
}


// 用户操作需要登录
function is_need_login(is_index = false) {
    if (get_user_login_status() == false) {
        alert("请先登录!");
        if (is_index == true) {
            go_next_page("html/login.html");
        } else {
            go_next_page("login.html");
        }
        throw SyntaxError("权限错误，请先登录！");
    }
}

// 判断是否为作者本人
function get_is_author(uid) {
    if (get_user_info("user_userid") == uid) {
        return true;
    }

    return false
}


// 跳转到心得体会（文章）
function go_experience_details(id, is_index = false) {
    var url = "html/experience_detail.html?aid=" + id;
    if (is_index == false) {
        url = "experience_detail.html?aid=" + id;
    }
    window.location.href = url;
}

// 跳转到提问详情
function go_question_details(id, is_index = false) {
    var url = "html/question_detail.html?aid=" + id;
    if (is_index == false) {
        url = "question_detail.html?aid=" + id;
    }
    window.location.href = url;
}

// 跳转到灵感列表
function go_inspiration_details(id, is_index = false) {
    var url = "html/inspiration_detail.html?aid=" + id;
    if (is_index == false) {
        url = "inspiration_detail.html?aid=" + id;
    }
    window.location.href = url;
}

// 跳转到教程详情页面
function go_tutorial_details(id, is_index = false) {
    is_need_login(is_index);
    var url = "html/test_tutorial_detail.html?aid=" + id;
    if (is_index == false) {
        url = "test_tutorial_detail.html?aid=" + id;
    }
    window.location.href = url;
}

// 跳转到教程列表
function go_tutorial_list(is_index = false) {
    is_need_login(is_index);
    url = "html/test_tutorial.html";

    if (is_index == false) {
        url = "test_tutorial.html";
    }
    window.location.href = url;
}

// 去密保页面
function go_set_mb(is_index = false) {
    is_need_login();

    var url = "html/set_mb.html";
    if (is_index == false) {
        url = "set_mb.html";
    }
    window.location.href = url;
}

// 跳转到个人中心
function go_personal_info(id, is_index = false) {
    var url = "html/personal_info.html?aid=" + id;
    if (is_index == false) {
        url = "personal_info.html?aid=" + id;
    }
    window.location.href = url;
}

// 跳转到个人中心
function go_personal_backgroud(uid) {
    is_need_login();
    window.location.href = "personal_backgroud.html?uid=" + uid;
}

// 跳转到修改密码页面
function go_update_password(uid) {
    is_need_login();
    window.location.href = "update_password_logined.html?uid=" + uid;
}


// 跳转到粉丝列表
function go_personal_fans(id, type, is_index = false) {
    // type: 0:粉丝列表; 1:关注列表
    var url = "html/personal_fans.html?id=" + id + "&type=" + type;
    if (is_index == false) {
        url = "personal_fans.html?id=" + id + "&type=" + type;
    }
    window.location.href = url;
}


//获取页面跳转的用户id
function get_id() {
    try {
        var id = window.location.href.split('=')[1].replace('#', '');
        if (id.search("&") != -1) {
            return id.split("&")[0];
        } else {
            return id;
        }
    } catch (err) {
        return '';
    }
}

//获取第二个参数
function get_sec_params() {
    return window.location.href.split('=')[2].replace('#', '');;
}

// 手机号正则表达式
function is_mobile(s) {
    let reg = /^1(3[0-9]|4[0-9]|5[0-9]|6[2,5,6,7]|7[0-9]|8[0-9]|9[1-9])\d{8}$/;
    return reg.test(s);
}


// 邮箱正则表达式
function is_email(s) {
    var reg1 = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if (!reg1.test(s)) {
        return false;
    }
    return true;
}


// 利用正则去掉前后空格
function space_trim(val) {
    return val.replace(/(^\s*)|(\s*$)/g, "");
}

// 检测为空方法
function check_null(val) {　　
    if (space_trim(val) == '') {
        return false;
    } else {
        return true;
    }
}