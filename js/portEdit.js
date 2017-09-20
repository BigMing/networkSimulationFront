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
            p_id : $("#portId").val(),
            portType : $("#portType").val(),
            antennaType : $("#antennaType").val(),
            antennaGain : $("#antennaGain").val(),
            transmittingPower : $("#transmittingPower").val(),
            modulationSystem : $("#modulationSystem").val(),
            encodedMode : $("#encodedMode").val(),
            spectralBandwidth : $("#spectralBandwidth").val(),
            maximumRate : $("#maximumRate").val(),
            packetLoss : $("#packetLoss").val(),
            timeDelay : $("#timeDelay").val()
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            alert(msg);
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
            alert(msg);
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
    $("#antennaType").val(objs[0].antennaType);
    $("#antennaGain").val(objs[0].antennaGain);
    $("#transmittingPower").val(objs[0].transmittingPower);
    $("#modulationSystem").val(objs[0].modulationSystem);
    $("#encodedMode").val(objs[0].encodedMode);
    $("#spectralBandwidth").val(objs[0].spectralBandwidth);
    $("#maximumRate").val(objs[0].maximumRate);
    $("#packetLoss").val(objs[0].packetLoss);
    $("#timeDelay").val(objs[0].timeDelay);
}