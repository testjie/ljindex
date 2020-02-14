// const baseurl = "http://192.168.0.103:2333";
// const baseurl = "http://132.232.44.158:2333";
const baseurl = "http://192.144.148.91:2333";
// const baseurl = "http://127.0.0.1:5000";
// const baseurl = "http://192.168.1.100:5000";
// const baseurl = "http://132.232.44.158:2333";

const upload_url = baseurl + "/uploadedit"


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
        $('#headpic').attr("src", headpic) // 用户头像
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
    var is_logined = false
    var token = get_user_info("user_token")
    if (token != null) {
        // 显示用户信息
        is_logined = true
    }
    set_user_navigation(is_logined, is_index)
};



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
    alert("暂未开放")
}

// 跳转到练习页面
function go_student_answering(is_index = false) {
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

// 计算页面
function compute_pagenum(id, method, cid = -1000) {
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
        $("#pre").attr("href", "javascript:" + method + "(" + pres + ", " + cid + ")")
        $("#next").attr("href", "javascript:" + method + "(" + next + ", " + cid + ")")
        $("#current").text("第" + id + "页/共" + last + "页")
    } else {
        $("#pre").attr("href", "javascript:" + method + "(" + cid + ", " + pres + ")")
        $("#next").attr("href", "javascript:" + method + "(" + cid + "," + next + ")")
        $("#current").text("第" + id + "页/共" + last + "页")
    }

}


// 分页计算
function user_compute_pagenum(id, method, uid, cid = -1000) {
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

function get_user4_status(ctype, fid) {
    // ctype: 0教程1提问2灵感3心得体会
    // fid: 对应的id；评论就是评论id

    // 查询用户是否登录
    if (get_user_login_status() == false) {
        return "1,1,1"
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
                alert(str.msg);
                remove_user_login_status(str.msg)
            }
        },
        fail: function(err, status) {
            alert(err.data);
            console.log(err);
        }
    });
    return user_like;
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
    var url = "html/test_tutorial_detail.html?aid=" + id;
    if (is_index == false) {
        url = "test_tutorial_detail.html?aid=" + id;
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
    var id = window.location.href.split('=')[1].replace('#', '');
    if (id.search("&") != -1) {
        return id.split("&")[0];
    } else {
        return id;
    }
}

//获取第二个参数
function get_sec_params() {
    return window.location.href.split('=')[2].replace('#', '');;
}

// 手机号正则表达式
function is_mobile(s) {
    let reg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
    return reg.test(s);
}


// 邮箱正则表达式
function is_email(s) {
    var patrn = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if (!patrn.exec(s)) return false
    return true
}