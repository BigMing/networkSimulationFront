/**
 * Created by sjm on 2017/6/28.
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

//编辑网口属性提交
$("#editPort").click(function () {
    $.ajax({
        url: '/NetworkSimulation/editPort',
        data: {
            portName : $("#portName").val(),
            portId : $("#portId").val(),
            portType : $("#portType").val(),
            transmitterPower : $("#transmitterPower").val(),
            transmitterFrequency : $("#transmitterFrequency").val(),
            transmitterBandwidth : $("#transmitterBandwidth").val(),
            transmitterGain : $("#transmitterGain").val(),
            receiverFrequency : $("#receiverFrequency").val(),
            receiverBandwidth : $("#receiverBandwidth").val(),
            receiverGain : $("#receiverGain").val(),
            modem : $("#modem").val(),
            maximumRate : $("#maximumRate").val(),
            packetLoss : $("#packetLoss").val()
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            $.alert(msg);
            //刷新当前页面
            location.herf = encodeURI("portEdit.html?portId=" + $("#portId").val());
        },
        error: function () {

        }
    });
});

//预读
$(document).ready(function () {
    $.ajax({
        url: '/NetworkSimulation/getPort',
        data: {
            p_id : $.getUrlParam("portId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            console.log(msg);
            initPortAttr(msg);
        },
        error: function () {

        }
    });
});

//显示出端口属性
function initPortAttr(data) {
    var objs = jQuery.parseJSON(data);
    $("#portName").val(objs[0].portName);
    $("#portId").val(objs[0].p_id);
    $("#portType").val(objs[0].portType);
    $("#transmitterPower").val(objs[0].transmitterPower);
    $("#transmitterFrequency").val(objs[0].transmitterFrequency);
    $("#transmitterBandwidth").val(objs[0].transmitterBandwidth);
    $("#transmitterGain").val(objs[0].transmitterGain);
    $("#receiverFrequency").val(objs[0].receiverFrequency);
    $("#receiverBandwidth").val(objs[0].receiverBandwidth);
    $("#receiverGain").val(objs[0].receiverGain);
    $("#modem").val(objs[0].modem);
    $("#maximumRate").val(objs[0].maximumRate);
    $("#packetLoss").val(objs[0].packetLoss);
    if ($("#portType").val() == 1) { // 类型1
        $("#transmitterPower").removeAttr("disabled", "disabled");
        $("#transmitterFrequency").removeAttr("disabled", "disabled");
        $("#transmitterBandwidth").removeAttr("disabled", "disabled");
        $("#transmitterGain").removeAttr("disabled", "disabled");
        $("#receiverFrequency").removeAttr("disabled", "disabled");
        $("#receiverBandwidth").removeAttr("disabled", "disabled");
        $("#receiverGain").removeAttr("disabled", "disabled");
        $("#modem").removeAttr("disabled", "disabled");
        $("#maximumRate").attr("disabled", "disabled");
        $("#packetLoss").attr("disabled", "disabled");
    }
    if ($("#portType").val() == 2) { // 类型2
        $("#transmitterPower").attr("disabled", "disabled");
        $("#transmitterFrequency").attr("disabled", "disabled");
        $("#transmitterBandwidth").attr("disabled", "disabled");
        $("#transmitterGain").attr("disabled", "disabled");
        $("#receiverFrequency").attr("disabled", "disabled");
        $("#receiverBandwidth").attr("disabled", "disabled");
        $("#receiverGain").attr("disabled", "disabled");
        $("#modem").attr("disabled", "disabled");
        $("#maximumRate").removeAttr("disabled", "disabled");
        $("#packetLoss").removeAttr("disabled", "disabled");
    }
}

/**
 * 选择网口类型需要禁用掉一些属性
 */
$("#portType").change(function () {
    if ($("#portType").val() == 1) { // 类型1
        $("#transmitterPower").removeAttr("disabled", "disabled");
        $("#transmitterFrequency").removeAttr("disabled", "disabled");
        $("#transmitterBandwidth").removeAttr("disabled", "disabled");
        $("#transmitterGain").removeAttr("disabled", "disabled");
        $("#receiverFrequency").removeAttr("disabled", "disabled");
        $("#receiverBandwidth").removeAttr("disabled", "disabled");
        $("#receiverGain").removeAttr("disabled", "disabled");
        $("#modem").removeAttr("disabled", "disabled");
        $("#maximumRate").attr("disabled", "disabled");
        $("#packetLoss").attr("disabled", "disabled");
    }
    if ($("#portType").val() == 2) { // 类型2
        $("#transmitterPower").attr("disabled", "disabled");
        $("#transmitterFrequency").attr("disabled", "disabled");
        $("#transmitterBandwidth").attr("disabled", "disabled");
        $("#transmitterGain").attr("disabled", "disabled");
        $("#receiverFrequency").attr("disabled", "disabled");
        $("#receiverBandwidth").attr("disabled", "disabled");
        $("#receiverGain").attr("disabled", "disabled");
        $("#modem").attr("disabled", "disabled");
        $("#maximumRate").removeAttr("disabled", "disabled");
        $("#packetLoss").removeAttr("disabled", "disabled");
    }
});