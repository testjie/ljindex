$(document).ready(function() {
    initialize_page();
    $('#uid').attr("value", get_id());
    get_user_infos(get_id());
    // get_user_info();
    get_fans_list(1);



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
                var fensi = str.data.fens;
                var guanzhu = str.data.follows;

                $('#headpic1').attr("src", headpic);
                $('#headpic').attr("src", headpic);
                $('#personal-header').attr("style", 'background: url("' + titlepic + '") no-repeat center top;background-size:cover');

                $('#username').text(nickname);
                $('#userinfo').text(userinfo);
                $('#fensi').text(fensi);
                $('#guanzhu').text(guanzhu);

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
function get_fans_list(nums) {
    var uid = $('#uid').val()

    $.ajax({
        type: 'get',
        url: get_url("/getuserfens?&uid=" + uid),
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
                        '<div class="user-box"><div class="img-box avatar">' +
                        '<img src="' + get_img_url(fans_headpic) + '" alt="">' +
                        '</div><div class="info"><p class="name">' + fans_nickname + '</p>' +
                        '<p class="job">' + fans_userinfo + '</p></div></div><div class=" apply-word"></div></div>'

                    content = content + users;

                }
                $('#list').html(content);

                // 分页相关
                $('#total').val(counts);
                $('#num').text("(" + counts + ")");
                $("#get_fans").attr("style", "color:#f7726b");
                $("#num").attr("style", "color:#f7726b");

                user_compute_pagenum(nums, "get_fans_list", uid, -10000)

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