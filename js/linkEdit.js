// 解析url参数的函数，包括解码
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var url = decodeURI(window.location.search);
        var r = url.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})(jQuery);

$(document).ready(function () {
    $.ajax({ // 根据链路名和场景id查询链路的属性，返回链路对象的json
        url: '/NetworkSimulation/getLinkByLinkName',
        data: {
            linkName : $.getUrlParam("linkName"),
            s_id : $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            console.log(msg);
            initLinkAttr(msg);
        },
        error: function () {

        }
    });
});

/**
 * 初始化链路的属性
 * @param 链路对象的json
 */
function initLinkAttr(data) {
    var linkObj = jQuery.parseJSON(data);
    $("#linkName").val(linkObj.linkName);
    $("#linkId").val(linkObj.linkId);
    $("#linkType").val(linkObj.linkType);
    $("#channelNoise").val(linkObj.linkNoise);
    $("#channelType").val(linkObj.channelModel);
    $("#linkLength").val(linkObj.linkLength);
    $("#fromIP").val(linkObj.fromNodeIP);
    $("#toIP").val(linkObj.toNodeIP);
}

/**
 * 编辑链路属性提交
 */
$("#submit").click(function () {
    $.ajax({
        url: '/NetworkSimulation/editLink',
        data: {
            linkName : $.getUrlParam("linkName"),
            linkId : $("#linkId").val(),
            linkType : $("#linkType").val(),
            linkNoise : $("#channelNoise").val(),
            channelModel : $("#channelType").val(),
            linkLength : $("#linkLength").val(),
            s_id : $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            $.alert(msg);
        },
        error: function () {

        }
    });
});