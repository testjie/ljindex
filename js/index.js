$(document).ready(function() {

    initialize_page(true) // 初始化页面title
    get_carousels_list() // 轮播图
    get_tutorials_list() // 推荐教程
    get_questions_list() // 热门讨论
    get_experiences_list() // 心得体会
    get_inspirer_list() // 灵光一闪
    get_hotuser_list() // 获取热门用户
    set_copyright_version();

});

// 获取首页轮播图 > get_title_img
function get_carousels_list() {
    $.ajax({
        type: 'get',
        url: get_url("/get_title_img?num=3"),
        success: function(str) { //返回json结果

            if (str.status == 200) {
                // 获取成功
                var c = '';
                var li = '';
                var content = '';
                for (var i = 0; i < str.data.length; i++) {
                    var title = str.data[i].title;
                    var rurl = str.data[i].rurl; // 跳转地址
                    // rurl = rurl.replace("http://", "");

                    var img_url = get_img_url(str.data[i].imghost); // 图片地址
                    if (i == 0) {
                        c = '<div class="item active">' +
                            '<a href="' + rurl + '" target="_blank">' +
                            '<img src="' + img_url + '" alt="' + title + '" style="height:450px"/>' +
                            '</a><div class="carousel-caption">' +
                            '<h3>' + title + '</h3>' +
                            '</div>' +
                            '</div>'

                        li = li + '<li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>'
                    } else {
                        c = '<div class="item" style="background-size:cover">' +
                            '<a href="' + rurl + '" target="_blank">' +
                            '<img src="' + img_url + '" alt="' + title + '" style="height:450px" />' +
                            '</a><div class="carousel-caption">' +
                            '<h3>' + title + '</h3>' +
                            '</div>' +
                            '</div>'
                        li = li + '<li data-target="#carousel-example-generic" data-slide-to="' + i + '"></li>'
                    }
                    content = content + c;
                }
                $('#lunbotu').append(content);
                $('#lunbotu_index').append(li);

            } else {
                alert("轮播图获取失败！");
            }

        },
        fail: function(err, status) {
            alert("轮播图获取失败！");
            console.log(err);
        }
    });
}

// 获取推荐教程 > coures
function get_tutorials_list() {
    $.ajax({
        type: 'get',
        url: get_url("/getcoures"),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 获取成功
                var c = '';
                var content = '';
                for (var i = 0; i < str.data.length; i++) {
                    var time = str.data[i].times;
                    var cid = str.data[i].id;
                    var shoucang = str.data[i].collections;
                    var likes = str.data[i].goods;
                    var title = str.data[i].title;
                    var img_url = get_img_url(str.data[i].ximg);

                    c = '<li onclick="go_tutorial_details(' + cid + ', true)" style="cursor:pointer;">' +
                        '<img src="' + img_url + '" alt="" style="width:240px; height:150px;" />' +
                        '<div class="details">' +
                        '<div class="desc">' + title + '</div>' +
                        '<div class="resets">' +
                        '<div class="time">' + time + '</div>' +
                        '<div class="peoplelove">' +
                        '<label>' +
                        '<span class="glyphicon glyphicon-user"></span>收藏' + shoucang + '</label>' +
                        '<label>' +
                        '<span class="glyphicon glyphicon-heart"></span>点赞' + likes + '</label>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</li>';

                    content = content + c;
                }
                $('#articles').append(content);
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


// 获取热门讨论 > questions
function get_questions_list() {
    $.ajax({
        type: 'get',
        url: get_url("/getquestions?num=3"),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 获取成功
                var c = '';
                var content = '';
                for (var i = 0; i < str.data.length; i++) {
                    var qid = str.data[i].id;
                    var title = str.data[i].title;
                    var brief = str.data[i].brief;
                    var img_url = get_img_url(str.data[i].ximg);
                    var comments = 456;
                    var reading = 456;
                    var collections = str.data[i].collections;
                    var likes = str.data[i].goods;
                    var createtime = "2019.12.12"

                    c = '<li onclick="go_question_details(' + qid + ', true)" style="cursor:pointer;">' +
                        '<p class="title" style="word-break:break-all;">' + title + '</p>' +
                        '<section class="details">' +
                        '<img src="' + img_url + '" alt="" sytle="width:125px; height:125px"/>' +
                        '<div class="desc">' + brief + '<div class="more">' +
                        // '<label>[阅读全文]</label>' +
                        '</div>' +
                        '</div>' +
                        ' </section>' +
                        '<div class="resets" style="float:right;">' +
                        '<div class="time">' + createtime + '</div>' +
                        '<div class="peoplelove">' +
                        // '<label style="padding-left:3px;"><span class="glyphicon glyphicon-comment"></span>评论' + comments + '</label>' +
                        // '<label style="padding-left:3px;"><span class="glyphicon glyphicon-open"></span>阅读' + reading + '</label>' +
                        '<label style="padding-left:3px;"><span class="glyphicon glyphicon-user"></span>收藏' + collections + '</label>' +
                        '<label style="padding-left:3px;"><span class="glyphicon glyphicon-heart"></span>点赞' + likes + '</label>' +
                        '</div>' +
                        '</div>' +
                        '</li>'
                    content = content + c;
                }
                $('#questsions').append(content);

            } else {
                alert(str.msg);
                remove_user_login_status(str.msg)

            }

        },
        fail: function(err, status) {
            alert("热门文章获取失败！");
            console.log(err);
        }
    });
}


// 心得体会 > article
function get_experiences_list() {
    $.ajax({
        type: 'get',
        url: get_url("/getarticle?num=4"),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 获取成功
                var c = '';
                var content = '';
                for (var i = 0; i < str.data.length; i++) {
                    var aid = str.data[i].id;
                    var title = str.data[i].title;
                    var brief = str.data[i].brief;
                    var img_url = get_img_url(str.data[i].ximg);
                    var createtime = str.data[i].times;
                    var reading = str.data[i].collections;
                    var likes = str.data[i].goods;

                    c = '<li onclick="go_experience_details(' + aid + ', true)" style="cursor:pointer;">' +
                        '<img src="' + img_url + '" alt=""  style="width:80px; height:80px;"/>' +
                        '<div class="details">' +
                        '<div class="title" style="word-break:break-all;">' + title + '</div>' +
                        '<div class="desc">' + brief + '</div>' +
                        '<div class="resets">' +
                        '<div class="time">' + createtime + '</div>' +
                        '<div class="peoplelove">' +
                        '<label><span class="glyphicon glyphicon-user"></span>收藏' + reading + '</label>' +
                        '<label><span class="glyphicon glyphicon-heart"></span>点赞' + likes + '</label>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</li>'
                    content = content + c;
                }
                $('#xdth').append(content);

            } else {
                alert(str.msg);
                remove_user_login_status(str.msg)

            }

        },
        fail: function(err, status) {
            alert("热门文章获取失败！");
            console.log(err);
        }
    });
}


// 获取灵感
function get_inspirer_list() {
    $.ajax({
        type: 'get',
        url: get_url("/getinspirer?num=4"),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 获取成功
                var c = '';
                var content = '';
                for (var i = 0; i < str.data.length; i++) {
                    var id = str.data[i].id;
                    var img_url = get_img_url(str.data[i].ximg.split(",")[0]);
                    var icontent = str.data[i].content;

                    c = '<li onclick="go_inspiration_details(' + id + ', true)" style="cursor:pointer;">' +
                        '<img src="' + img_url + '" alt="" style="width:200px; height:150px;"/>' +
                        '<div class="content">' +
                        '<div class="title">灵光乍现</div>' +
                        '<div class="desc">' + icontent + '</div>' +
                        '</div>' +
                        '</li>'
                    content = content + c;
                }
                $('#lgys').append(content);

            } else {
                alert(str.msg);
                remove_user_login_status(str.msg)

            }

        },
        fail: function(err, status) {
            alert("热门文章获取失败！");
            console.log(err);
        }
    });

}


// 获取热门用户
function get_hotuser_list() {
    $.ajax({
        type: 'get',
        url: get_url("/gethighusers?num=14"),
        success: function(str) { //返回json结果
            if (str.status == 200) {
                // 获取成功
                var content = '';
                for (var i = 0; i < str.data.length; i++) {
                    var uid = str.data[i].id;
                    var nickname = str.data[i].nickname;
                    // var nickname = str.data[i].nickname;
                    var headpic = get_img_url(str.data[i].headpic);
                    var c = '<li onclick="go_personal_details(' + uid + ', true)" style="cursor:pointer;">' +
                        '<img class="avatar" src="' + headpic + '" alt=""  />' +
                        '<span>' + nickname + '</span>' +
                        '</li>'
                    content = content + c;
                }
                $('#hotuser').append(content);
            } else {
                alert(str.msg);
                remove_user_login_status(str.msg)

            }

        },
        fail: function(err, status) {
            alert("热门文章获取失败！");
            console.log(err);
        }
    });
}