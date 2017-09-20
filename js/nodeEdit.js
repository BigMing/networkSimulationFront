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
    areaCont = "";
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

//新建网口
$("#addPort").click(function () {
    $("#myModal").modal();
});

//新建网口提交
$("#submitPort").click(function () {
    $.ajax({
        url: '/NetworkSimulation/addPort',
        data: {
            n_id : $("#nodeId").val(),
            portName : $("#portName").val(),
            portType : $("#portType").val(),
            // portIP : $("#portIP").val(),
            antennaType : $("#antennaType").val(),
            antennaGain : $("#antennaGain").val(),
            txPower : $("#txPower").val(),
            modulationScheme : $("#modulationScheme").val(),
            channelCodingScheme : $("#channelCodingScheme").val(),
            frequencyBandwidth : $("#frequencyBandwidth").val(),
            txBitRate : $("#txBitRate").val(),
            txPacketLoss : $("#txPacketLoss").val()
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

//打开节点内部编辑器
// $("#editInnerScenario").click(function () {
//     window.open(encodeURI("innerEdit.html?nodeId=" + $("#nodeId").val()));
// });

//编辑节点属性提交
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