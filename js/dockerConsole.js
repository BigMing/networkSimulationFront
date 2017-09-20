//解析url参数的函数，包括解码
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var url = decodeURI(window.location.search);
        var r = url.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})(jQuery);

//绑定回车键
$(document).keydown(function (e) {
    var theEvent = window.event || e;
    var code = theEvent.keyCode || theEvent.which;
    if (code == 13) {
        $("#submit").click();
    }
});

$("#submit").click(function () {
    if ($("#command").val() == '') {
        $.alert("请先输入命令！");
    } else {
        //发送需要执行的命令行
        $.ajax({
            url: '/NetworkSimulation/sendCommand',
            data: {
                command : $("#command").val(),
                uuid : $.getUrlParam("nodeId")
            },
            type: 'post',
            dataType: 'json',
            async: false,
            success: function (data) {
                var html = $("#display").val() + data;
                $("#display").val(html);
            },
            error: function () {

            }
        });
    }
})