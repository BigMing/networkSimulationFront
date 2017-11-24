$("#login").click(function () {
    $.ajax({
        url: '/NetworkSimulation/userCheck',
        data: {
            username : $("#username").val(),
            psw : $("#password").val()
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            $.alert(msg);
            if (msg == "登录成功") {
                $.session.set('login', 'true'); // 设置jquery session，不关闭浏览器都有效
                window.location.replace(encodeURI("detailProject.html?username=" + $("#username"))); // 跳转
            }
        },
        error: function () {

        }
    });
});