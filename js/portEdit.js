/**
 * Created by sjm on 2017/6/28.
 */
/**
 * 解析url参数的函数，包括解码
 */
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var url = decodeURI(window.location.search);
        var r = url.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})(jQuery);

/**
 * 判断ip是否合法的正则
 */
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
    if ($.getUrlParam("ethName") != null) { // 二层节点的网卡
        $.ajax({ // 编辑二层节点的网卡提交
            url: '/NetworkSimulation/editEth',
            data: {
                nodeName : $.getUrlParam("nodeName"), // 定位二层网卡的实例，节点名
                ethName : $.getUrlParam("ethName"), // 该实例中要编辑的网卡名eth
                toNodeName : $.getUrlParam("toNodeName"), // 二层节点另外一端节点名
                toEth : $.getUrlParam("toEth"), // 另一端的节点的网卡名
                portName : $("#portName").val(),
                pt_id : $("#portId").val(),
                isMultiplexing : $("#isMultiplexing").val(),
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
    } else { // 三层节点的端口
        $.ajax({ // 编辑三层节点的端口提交
            url: '/NetworkSimulation/editPort',
            data: {
                portName : $("#portName").val(),
                pt_id : $("#portId").val(),
                isMultiplexing : $("#isMultiplexing").val(),
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
    }
});

$(document).ready(function () {
    if ($.getUrlParam("ethName") != null) { // 二层节点的端口

    } else { // 三层节点的端口
        $.ajax({ // 根据pt_id获取port对象的json，三层节点的端口有效
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
    }
});

/**
 * 显示出端口属性
 * @param data 端口对象的json
 */
function initPortAttr(data) {
    var objs = jQuery.parseJSON(data);
    $("#portName").val(objs.portName);
    $("#portId").val(objs.pt_id);
    $("#isMultiplexing").val(objs.isMultiplexing);
    $("#portType").val(objs.portType);
    $("#portIp").val(objs.portIp);
    $("#transmitterPower").val(objs.transmitterPower);
    $("#transmitterFrequency").val(objs.transmitterFrequency);
    $("#transmitterBandwidth").val(objs.transmitterBandwidth);
    $("#transmitterGain").val(objs.transmitterGain);
    $("#receiverFrequency").val(objs.receiverFrequency);
    $("#receiverBandwidth").val(objs.receiverBandwidth);
    $("#receiverGain").val(objs.receiverGain);
    $("#modem").val(objs.modem);
    $("#maximumRate").val(objs.maximumRate);
    $("#packetLoss").val(objs.packetLoss);
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