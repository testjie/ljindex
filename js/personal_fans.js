$(document).ready(function() {
    initialize_page();
    var id = get_id();
    var type = get_sec_params();

    $('#uid').attr("value", id);
    get_user_infos(id);
    get_fans_list(1, type);

    // 提问
    $("#get_articles").click(function() {
        $("#answering_list").html('');
        get_articles_list(1);
    });
    // 提问
    $("#get_questsion").click(function() {
        $("#answering_list").html('');
        get_fans_list(1);
    });

    // 灵感
    $("#get_inspiration").click(function() {
        $("#answering_list").html('');
        get_inspirations_list(1);
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
                var fans = str.data.fens;
                var follows = str.data.follows;

                // 头像
                // $('#headpic1').attr("src", headpic);
                $('#headpic').attr("style", " no-repeat center top;background-size:cover; cursor:pointer;");
                $('#headpic').attr("src", headpic);

                // 背景图
                $('#personal-header').attr("style", 'background: url("' + titlepic + '") no-repeat center top;background-size:cover; cursor:pointer;');
                // 用户信息
                $('#username').text(nickname);
                $('#userinfo').text(userinfo);
                $('#fans').text(fans);
                $('#fanslist').attr("onclick", "go_personal_fans(" + $('#uid').val() + "," + 0 + ")");

                $('#follows').text(follows);
                $('#followslist').attr("onclick", "go_personal_fans(" + $('#uid').val() + "," + 1 + ")");

                if (get_user_info("user_userid") == uid) {
                    $('#update_user_info').attr("href", 'personal_info.html?uid=' + $('#uid').val());
                } else {
                    // 是粉丝显示取消关注，不是显示关注
                    if (get_user_is_fans(uid) == "已关注") {
                        $('#update_user_info').text("取消关注");
                        $('#update_user_info').attr("name", "取消关注"); //接下来就是取消关注
                        $('#update_user_info').removeAttr("target");
                        $('#update_user_info').attr("href", 'javascript:follow_user(' + $('#uid').val() + ');');
                    } else {
                        $('#update_user_info').text("关注");
                        $('#update_user_info').attr("name", "关注"); //1已关注
                        $('#update_user_info').removeAttr("target");
                        $('#update_user_info').attr("href", 'javascript:follow_user(' + $('#uid').val() + ');');
                    }
                }

                return str.data;
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


// 获取粉丝列表
function get_fans_list(nums, type) {
    var uid = $('#uid').val();

    if (type == 0) {
        // 粉丝列表
        var url = get_url("/getuserfens?&uid=" + uid);
        $("#get_fans").attr("style", "color:#f7726b");
        $("#fan_nums").attr("style", "color:#f7726b");

    } else {
        var url = get_url("/getuserfollows?&uid=" + uid); // 这里改成关注列表
        $("#get_follows").attr("style", "color:#f7726b");
        $("#follow_nums").attr("style", "color:#f7726b");
    }
    // 页面跳转
    $('#get_fans').attr("onclick", "go_personal_fans(" + $('#uid').val() + "," + 0 + ")");
    $('#fanslist').attr("onclick", "go_personal_fans(" + $('#uid').val() + "," + 0 + ")");
    $('#get_follows').attr("onclick", "go_personal_fans(" + $('#uid').val() + "," + 1 + ")");
    $('#followslist').attr("onclick", "go_personal_fans(" + $('#uid').val() + "," + 1 + ")");

    $.ajax({
        type: 'get',
        url: url,
        headers: get_headers(),
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 获取成功
                var content = '';
                var datas = str.data.userlist;
                var counts = str.data.counts;
                for (var i = 0; i < datas.length; i++) {
                    var fans_id = datas[i].id;
                    var fans_headpic = datas[i].headpic;
                    var fans_nickname = datas[i].nickname;
                    var fans_userinfo = datas[i].userinfo;
                    users = '<div class="apply list-item">' +
                        '<div class="user-box" style="cursor:pointer;"  onclick="go_personal_center(' + fans_id + ')"><div class="img-box avatar">' +
                        '<img src="' + get_img_url(fans_headpic) + '" alt="" onclick="go_personal_center(' + fans_id + ')"> ' +
                        '</div><div class="info" onclick="go_personal_center(' + fans_id + ')"><p class="name">' + fans_nickname + '</p>' +
                        '<p class="job" onclick="go_personal_center(' + fans_id + ')">' + fans_userinfo + '</p></div></div><div class=" apply-word"></div></div>'

                    content = content + users;
                }
                if (type == 0) {
                    $('#fan_nums').text("(" + counts + ")");
                } else {
                    $('#follow_nums').text("(" + counts + ")");
                }

                $('#list').html(content);

                // 分页相关
                $('#total').val(counts);
                $('#num').text("(" + counts + ")");
                user_compute_pagenum(nums, "get_fans_list", type);

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