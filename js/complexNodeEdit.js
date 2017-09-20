/**
 * Created by sjm on 2017/6/21.
 */
//解析url参数的函数，包括解码
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var url = decodeURI(window.location.search);
        var r = url.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})(jQuery);

$(document).ready(function () {
    //获得复杂节点的属性，显出节点属性
    $.ajax({
        url: '/NetworkSimulation/getComplexNodeBynodeName',
        data: {
            complexNodeName : $.getUrlParam("complexNodeName"),
            s_id : $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            initNodeAttr(msg);
        },
        error: function () {

        }
    });
});

//显示节点属性
function initNodeAttr(data) {
    var objs = jQuery.parseJSON(data);
    $("#nodeName").val(objs.complexNodeName);
    $("#nodeId").val(objs.cn_id);
    $("#innerNodeCount").val(objs.nodes.length);
    $("#innerLinkCount").val(objs.links.length);
    var nodeOptions = '';
    for (var i = 0; i < objs.nodes.length; i++) {
        nodeOptions += '<option>' + objs.nodes[i].nodeName + '</option>'
    }
    $("#innerNodeList").html(nodeOptions);
    var linkOptions = '';
    for (var i = 0; i < objs.links.length; i++) {
        linkOptions += '<option>' + objs.links[i].linkName + '</option>'
    }
    $("#innerLinkList").html(linkOptions);
}

//编辑复杂节点属性提交
$("#editNode").click(function () {
    $.ajax({
        url: '/NetworkSimulation/editComplexNode',
        data: {
            nodeName : $("#nodeName").val(),
            cn_id : $("#nodeId").val(),
            s_id : $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            alert(msg);
            //刷新当前页面
            location.herf = encodeURI("complexNodeEdit.html?complexNodeName=" + $("#nodeName").val() + "&scenarioId=" + $.getUrlParam("scenarioId"));
        },
        error: function () {

        }
    });
});