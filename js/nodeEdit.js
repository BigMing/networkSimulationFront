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

var portList = [];
var portId = [];

//var json = '{"flavorType":"small","hardwareArchitecture":0,"imageName":"Zph/new:11.04","manageIp":"1.2.3.4","n_id":12,"nodeName":"lastTestTonigjt","nodeStatus":0,"nodeType":0,"numberInternalLink":0,"numberInternalModule":0,"numberPort":0,"operatingSystem":1,"s_id":14,"x":0,"y":0}';

$(document).ready(function () {
    //获得节点的属性，显出节点属性
    $.ajax({
        url: '/NetworkSimulation/getNodeBynodeName',
        data: {
            nodeName : $.getUrlParam("nodeName"),
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
    //获得网口列表，显示网口
    $.ajax({
        url: '/NetworkSimulation/getPortList',
        data: {
            n_id : $("#nodeId").val()
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            //alert(msg);
            prasePortList(msg);
            initPortList();
        },
        error: function () {

        }
    });
});

//显示节点属性
function initNodeAttr(data) {
    var objs = jQuery.parseJSON(data);
    $("#nodeName").val(objs.nodeName);
    $("#nodeId").val(objs.n_id);
    $("#manageIP").val(objs.manageIp);
    $("#nodeType").val(objs.nodeType);
    $("#hardwareArchitecture").val(objs.hardwareArchitecture);
    $("#operatingSystem").val(objs.operatingSystem);
    $("#nodeConfig").val(objs.flavorType);
    $("#nodeImage").val(objs.imageName);
    $("#portCount").val(objs.length);
}

//解析网口列表json
function prasePortList(data) {
    portList = [];
    portId = [];
    var objs = jQuery.parseJSON(data);
    for (var i = 0; i < objs.length; i++){
        portList[i] = objs[i].portName;
        portId[i] = objs[i].pt_id;
    }
}

//显示网口列表
function initPortList() {
    var areaCont = "";
    for (var i = 0; i < portList.length; i++){
        areaCont += '<option onClick="selectP(' + i + ');">' + portList[i] + '</option>';
    }
    $("#selectPort").html(areaCont);
}

//选中列表中网口
function selectP(i) {
    $("#editPort").removeAttr("disabled");
    $("#delPort").removeAttr("disabled");
    //打开网口编辑器
    $("#editPort").click(function () {
        window.open(encodeURI("portEdit.html?portId=" + portId[i]));
    });
    //删除网口
    $("#delPort").click(function () {
        $.ajax({
            url: '/NetworkSimulation/deletePort',
            data: {
                pt_id : portId[i]
            },
            type: 'post',
            dataType: 'json',
            async: false,
            success: function (msg) {
                alert(msg);
                window.location.reload();
            },
            error: function () {

            }
        });
    });
}

/**
 * 选择网口类型需要禁用掉一些属性
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

/**
 * 点击新建网口，要初始化可选模板参数
 */
var portTemplateObjs; // 端口模板对象
$("#addPort").click(function () {
    $("#myModal").modal(); // 弹出模态框
    $.ajax({ // 查询已有的端口模板，返回List<端口>的json
        url: '/NetworkSimulation/getPortTemplate',
        data: {

        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            console.log(msg);
            portTemplateObjs = jQuery.parseJSON(msg);
            var html = '';
            for (var i = 0; i < portTemplateObjs.length; i++) {
                html += '<option value="' + portTemplateObjs[i].portName + '">' + '（模板）' + portTemplateObjs[i].portName + '</option>';
            }
            $("#portTemplate").html(html);
            $("#portTemplate").val(''); // 初始化让它谁也不选
        },
        error: function () {

        }
    });
});

/**
 * 选中某一个模板之后自动填入部分参数
 */
$("#portTemplate").change(function () {
    var portTemplateName = $("#portTemplate").val();
    for (var i = 0; i < portTemplateObjs.length; i++) {
        if (portTemplateName == portTemplateObjs[i].portName) { // 找到选中模板对应的对象
            $("#portType").val(portTemplateObjs[i].portType);
            $("#transmitterPower").val(portTemplateObjs[i].transmitterPower);
            $("#transmitterFrequency").val(portTemplateObjs[i].transmitterFrequency);
            $("#transmitterBandwidth").val(portTemplateObjs[i].transmitterBandwidth);
            $("#transmitterGain").val(portTemplateObjs[i].transmitterGain);
            $("#receiverFrequency").val(portTemplateObjs[i].receiverFrequency);
            $("#receiverBandwidth").val(portTemplateObjs[i].receiverBandwidth);
            $("#receiverGain").val(portTemplateObjs[i].receiverGain);
            $("#modem").val(portTemplateObjs[i].modem);
            $("#maximumRate").val(portTemplateObjs[i].maximumRate);
            $("#packetLoss").val(portTemplateObjs[i].packetLoss);
        }
    }
});

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
 * 新建网口提交
 */
$("#submitPort").click(function () {
    if ($("input[name='saveAsTemplateCheckbox']:checked").val() == 1) { // 选中了保存为模板
        $.ajax({
            url: '/NetworkSimulation/addPortAsTemplate',
            data: {
                n_id : $("#nodeId").val(),
                portName : $("#portName").val(),
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
                window.location.reload();
            },
            error: function () {

            }
        });
    } else { // 未选中保存为模板
        $.ajax({
            url: '/NetworkSimulation/addPort',
            data: {
                n_id : $("#nodeId").val(),
                portName : $("#portName").val(),
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
                window.location.reload();
            },
            error: function () {

            }
        });
    }
});

/**
 * 编辑节点属性提交
 */
$("#editNode").click(function () {
    $.ajax({
        url: '/NetworkSimulation/editNode',
        data: {
            nodeName : $("#nodeName").val(),
            n_id : $("#nodeId").val(),
            manageIp : $("#manageIP").val(),
            nodeType : $("#nodeType").val(),
            hardwareArchitecture : $("#hardwareArchitecture").val(),
            operatingSystem : $("#operatingSystem").val(),
            nodeConfig : $("#nodeConfig").val(),
            nodeImage : $("#nodeImage").val(),
            s_id : $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            alert(msg);
            //刷新当前页面
            location.herf = encodeURI("nodeEdit.html?nodeName=" + $("#nodeName").val() + "&scenarioId=" + $.getUrlParam("scenarioId"));
        },
        error: function () {

        }
    });
});