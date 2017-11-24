/**
 * Created by sjm on 2017/6/28.
 */
// 解析url参数的函数，包括解码
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var url = decodeURI(window.location.search);
        var r = url.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})(jQuery);

// 判断ip是否合法的正则
function isValidIP(ip) {
    var reg =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return reg.test(ip);
}

/**
 * 判断输入的ip地址是否合法
 */
$("#portIp").blur(function () {
    var ip = $("#portIp").val();
    if (isValidIP(ip)) {
        $("#portIpErrorInfo").attr("hidden", "hidden");
    } else {
        $("#portIpErrorInfo").removeAttr("hidden");
    }
});

/**
 * 编辑网口属性提交
 */
$("#editPort").click(function () {
    $.ajax({
        url: '/NetworkSimulation/editPort',
        data: {
            portName : $("#portName").val(),
            pt_id : $("#portId").val(),
            portType : $("#portType").val(),
            portIp : $("#portIp").val(),
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
            location.herf = encodeURI("portEdit.html?portId=" + $("#portId").val()); // 刷新
        },
        error: function () {

        }
    });
});

$(document).ready(function () {
    $.ajax({
        url: '/NetworkSimulation/getPort',
        data: {
            pt_id : $.getUrlParam("portId")
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
    $("#portId").val(objs[0].pt_id);
    $("#portType").val(objs[0].portType);
    $("#portIp").val(objs[0].portIp);
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
        $("#transmitterPowerDiv").removeAttr("hidden", "hidden");
        $("#transmitterFrequencyDiv").removeAttr("hidden", "hidden");
        $("#transmitterBandwidthDiv").removeAttr("hidden", "hidden");
        $("#transmitterGainDiv").removeAttr("hidden", "hidden");
        $("#receiverFrequencyDiv").removeAttr("hidden", "hidden");
        $("#receiverBandwidthDiv").removeAttr("hidden", "hidden");
        $("#receiverGainDiv").removeAttr("hidden", "hidden");
        $("#modemDiv").removeAttr("hidden", "hidden");
        $("#maximumRateDiv").attr("hidden", "hidden");
        $("#packetLossDiv").attr("hidden", "hidden");
    }
    if ($("#portType").val() == 2) { // 类型2
        $("#transmitterPowerDiv").attr("hidden", "hidden");
        $("#transmitterFrequencyDiv").attr("hidden", "hidden");
        $("#transmitterBandwidthDiv").attr("hidden", "hidden");
        $("#transmitterGainDiv").attr("hidden", "hidden");
        $("#receiverFrequencyDiv").attr("hidden", "hidden");
        $("#receiverBandwidthDiv").attr("hidden", "hidden");
        $("#receiverGainDiv").attr("hidden", "hidden");
        $("#modemDiv").attr("hidden", "hidden");
        $("#maximumRateDiv").removeAttr("hidden", "hidden");
        $("#packetLossDiv").removeAttr("hidden", "hidden");
    }
}

/**
 * 选择网口类型需要隐藏掉一些属性
 */
$("#portType").change(function () {
    if ($("#portType").val() == 1) { // 类型1
        $("#transmitterPowerDiv").removeAttr("hidden", "hidden");
        $("#transmitterFrequencyDiv").removeAttr("hidden", "hidden");
        $("#transmitterBandwidthDiv").removeAttr("hidden", "hidden");
        $("#transmitterGainDiv").removeAttr("hidden", "hidden");
        $("#receiverFrequencyDiv").removeAttr("hidden", "hidden");
        $("#receiverBandwidthDiv").removeAttr("hidden", "hidden");
        $("#receiverGainDiv").removeAttr("hidden", "hidden");
        $("#modemDiv").removeAttr("hidden", "hidden");
        $("#maximumRateDiv").attr("hidden", "hidden");
        $("#packetLossDiv").attr("hidden", "hidden");
    }
    if ($("#portType").val() == 2) { // 类型2
        $("#transmitterPowerDiv").attr("hidden", "hidden");
        $("#transmitterFrequencyDiv").attr("hidden", "hidden");
        $("#transmitterBandwidthDiv").attr("hidden", "hidden");
        $("#transmitterGainDiv").attr("hidden", "hidden");
        $("#receiverFrequencyDiv").attr("hidden", "hidden");
        $("#receiverBandwidthDiv").attr("hidden", "hidden");
        $("#receiverGainDiv").attr("hidden", "hidden");
        $("#modemDiv").attr("hidden", "hidden");
        $("#maximumRateDiv").removeAttr("hidden", "hidden");
        $("#packetLossDiv").removeAttr("hidden", "hidden");
    }
});