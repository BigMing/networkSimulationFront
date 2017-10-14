//解析url参数的函数，包括解码
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var url = decodeURI(window.location.search);
        var r = url.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})(jQuery);

//设置canvas画布大小
var canvas = document.getElementById('canvas');
var content = document.getElementById('content');
window.onload = window.onresize = function () {
    canvas.width = content.offsetWidth;
    canvas.height = content.offsetHeight - 50;
};

var stage = new JTopo.Stage(canvas); // 创建一个舞台对象

stage.eagleEye.visible = true; // 显示鹰眼

// 缩放
$('#zoomOutButton').click(function(){
    stage.zoomIn();
});
$('#zoomInButton').click(function(){
    stage.zoomOut();
});

var scene = new JTopo.Scene(stage); // 创建一个场景对象

// 定义获取和更新时间的函数
function showTime() {
    var curTime = new Date();
    $("#systemTime").html(curTime.toLocaleString());
    setTimeout("showTime()", 1000);
}

var scenarioId = $.getUrlParam("scenarioId");
//预读就记录下简单节点的id和类型
var simpleNodeId = [];
var simpleNodeType = [];

// 刷新画布区域的请求
function refreshCanvas() {
    //画出已有节点，简单节点
    $.ajax({
        url: '/NetworkSimulation/selectNodeList',
        data: {
            s_id : $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (data) {
            var objs = jQuery.parseJSON(data);
            for (var i = 0; i < objs.length; i++){
                //初始化简单节点的id和type
                simpleNodeId[objs[i].nodeName] = objs[i].uuid;
                simpleNodeType[objs[i].nodeName] = objs[i].nodeType;
                if (objs[i].cn_id == 0) {
                    //画出简单节点
                    createNode(objs[i].nodeName, objs[i].x, objs[i].y, objs[i].iconUrl);
                }
            }
        },
        error: function () {

        }
    });
    //画出三层复杂节点
    $.ajax({
        url: '/NetworkSimulation/selectComplexNodeList',
        data: {
            s_id : $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (data) {
            var objs = jQuery.parseJSON(data);
            for (var i = 0; i < objs.length; i++){
                createComplexNode(objs[i].complexNodeName, objs[i].x, objs[i].y, "img/zhonggui00.png");
            }
        },
        error: function () {

        }
    });
    //获取所有链路并画出
    $.ajax({
        url: '/NetworkSimulation/getLinkList',
        data: {
            s_id : $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (data) {
            setTimeout(function () {
                var fromNode = undefined;
                var toNode = undefined;
                //解析出来link对象
                var objs = jQuery.parseJSON(data);
                //获取画布上所有node对象
                var elements = scene.getDisplayedNodes();
                for (var i = 0; i < objs.length; i++) {
                    //对每个link对象找到fromNode和toNode
                    for (var j = 0; j < elements.length; j++) {
                        if (objs[i].logicalFromNodeName == elements[j].text) {
                            fromNode = elements[j];
                        }
                        if (objs[i].logicalToNodeName == elements[j].text) {
                            toNode = elements[j];
                        }
                    }
                    //画出链路，静态场景中
                    if (objs[i].linkStatus == 1 && objs[i].cn_id == 0) {
                        //断开的链路，红色
                        newLink(fromNode, toNode, objs[i].linkName, "255,0,0");
                    }
                    if (objs[i].linkStatus == 0 && objs[i].cn_id == 0) {
                        //接通的链路，蓝色
                        newLink(fromNode, toNode, objs[i].linkName, "0,0,255");
                    }
                    // 动态场景中
                    // if (objs[i].linkStatus == 2 && objs[i].cn_id == 0) {
                    //     //断开的链路，红色
                    //     newLink(fromNode, toNode, objs[i].linkName, "255,0,0");
                    // }
                    if (objs[i].linkStatus == 3 && objs[i].cn_id == 0) {
                        //接通的链路，蓝色
                        newLink(fromNode, toNode, objs[i].linkName, "0,0,255");
                    }
                }
            }, 1000);
        },
        error: function () {

        }
    });
}

//预读
$(document).ready(function () {
    showTime();
    //设置到stk提交框
    $("#scenarioId").val($.getUrlParam("scenarioId"));
    //显示工程名和场景名
    $("#projectName").html($.getUrlParam("projectName"));
    $("#scenarioName").html($.getUrlParam("scenarioName"));
    refreshCanvas();
});

/**
 * 右上角的选中状态
 */
scene.click(function () {
    var elements = scene.selectedElements;
    if (elements[0] == undefined) {
        $("#selectEle").html("none");
    }
    $("#selectEle").html(elements[0].text);
});

/**
 * 删除选中元素
 */
$("#remove").click(function () {
    var elements = scene.selectedElements;
    if (elements[0] == undefined){
        $.alert("请选中节点后在进行下一步操作");
    }else {
        for (var i = 0; i < elements.length; i++) {
            if (elements[i] instanceof JTopo.Node) {
                if (elements[i].fontColor == "255,0,0") {
                    //如果是复杂节点
                    $.alert("删除一个复杂节点" + elements[i].text);
                    //从画布删除节点
                    $.ajax({
                        url: '/NetworkSimulation/deleteComplexNode',
                        data: {
                            complexNodeName: elements[i].text,
                            s_id : $.getUrlParam("scenarioId")
                        },
                        type: 'post',
                        dataType: 'json',
                        async: false,
                        success: function (msg) {
                            if (msg == "删除成功") {
                                scene.remove(elements[i]);
                            }
                        },
                        error: function () {

                        }
                    });
                } else if (elements[i].fontColor == "0,0,0") {
                    //如果是简单节点
                    $.alert("删除一个简单节点" + elements[i].text);
                    //从画布删除节点
                    $.ajax({
                        url: '/NetworkSimulation/deleteNode',
                        data: {
                            nodeName: elements[i].text,
                            s_id : $.getUrlParam("scenarioId")
                        },
                        type: 'post',
                        dataType: 'json',
                        async: false,
                        success: function (msg) {
                            if (msg == "删除成功") {
                                scene.remove(elements[i]);
                            }
                        },
                        error: function () {

                        }
                    });
                }
            }
            if (elements[i] instanceof JTopo.Link) {
            	console.log(elements[i].strokeColor);
                if (elements[i].strokeColor == "255,0,0") {
                    //如果是断开的链路
                    $.alert("无法删除断开的链路！");
                } else {
                    $.alert("删除一个链路" + elements[i].text);
                    //从画布删除链路
                    $.ajax({
                        url: '/NetworkSimulation/deleteLink',
                        data: {
                            linkName: elements[i].text,
                            s_id : $.getUrlParam("scenarioId")
                        },
                        type: 'post',
                        dataType: 'json',
                        async: false,
                        success: function (msg) {
                            if (msg == "删除成功") {
                                scene.remove(elements[i]);
                            }
                        },
                        error: function () {

                        }
                    });
                }
            }
        }
    }
    //10秒后刷新链路
    setTimeout(function () {
        window.location.reload();
    }, 10 * 1000);
});

/**
 * 创建连线
 */
var beginNode = null;
var endLastNode = null;
var tempNodeA = new JTopo.Node('tempA');
tempNodeA.setSize(1, 1);

var tempNodeZ = new JTopo.Node('tempZ');
tempNodeZ.setSize(1, 1);

var link1 = new JTopo.Link(tempNodeA, tempNodeZ);

//按钮点击事件，添加
var link01 = document.getElementById("link01");
// var addlink02 = document.getElementById("addlink02");
// var link02 = document.getElementById("link02");
// var addlink03 = document.getElementById("addlink03");
// var link03 = document.getElementById("link03");
//停止添加
var link04 = document.getElementById("link04");
var flag = 0;
//1,2,3表示三种链路，4表示停止添加链路--------------------->用于添加链路类型时候的判断
$("#addlink01").click(function () {
    flag = 1;
    link01.style.color = "red";
    link02.style.color = "#333";
    link03.style.color = "#333";
    link04.style.color = "#333";
});
// addlink02.onclick = function () {
//     flag = 2;
//     link01.style.color = "#333";
//     link02.style.color = "red";
//     link03.style.color = "#333";
//     link04.style.color = "#333";
// };
// addlink03.onclick = function () {
//     flag = 3;
//     link01.style.color = "#333";
//     link02.style.color = "#333";
//     link03.style.color = "red";
//     link04.style.color = "#333";
//
// };
$("#addlink04").click(function () {
    flag = 0;
    link01.style.color = "#333";
    link02.style.color = "#333";
    link03.style.color = "#333";
    link04.style.color = "red";
});

//判断ip是否合法的正则
function isValidIP(ip)
{
    var reg =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return reg.test(ip);
}

//初始化复杂节点间链路模态框中的数据，分别是选择内部节点和端口的选择框
function initFromNode(data, k) {
    var html = '';
    var objs = jQuery.parseJSON(data);
    console.log("已解析复杂节点json：");
    for (var i = 0; i < objs.length; i++) {
        html += '<option onclick="getFromPort(' + k + ');" value="' + objs[i].nodeName + '">' + objs[i].nodeName + '</option>';
    }
    console.log("html：" + html);
    $('[id = "selectFromNode_' + k + '"]').html(html);
}
function getFromPort(k) {
    $.ajax({
        url: '/NetworkSimulation/getPortBynodeName',
        data: {
            nodeName: $('[id = "selectFromNode_' + k + '"]').val(),
            s_id : $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            var html = '';
            var objs = jQuery.parseJSON(msg);
            for (var i = 0; i < objs.length; i++) {
                if (objs[i].portStatus == 0) {
                    html += '<option value="' + objs[i].pt_id + '">' + objs[i].portName + '</option>';
                } else if (objs[i].portStatus == 1) {
                    html += '<option value="' + objs[i].pt_id + '" disabled="disabled">' + objs[i].portName + '</option>';
                }
            }
            $('[id = "selectFromPort_' + k + '"]').html(html);
        },
        error: function () {

        }
    });
}
function initToNode(data, k) {
    var html = '';
    var objs = jQuery.parseJSON(data);
    for (var i = 0; i < objs.length; i++) {
        html += '<option onclick="getToPort(' + k + ');" value="' + objs[i].nodeName + '">' + objs[i].nodeName + '</option>';
    }
    $('[id = "selectToNode_' + k + '"]').html(html);
}
function getToPort(k) {
    $.ajax({
        url: '/NetworkSimulation/getPortBynodeName',
        data: {
            nodeName: $('[id = "selectToNode_' + k + '"]').val(),
            s_id : $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            var html = '';
            var objs = jQuery.parseJSON(msg);
            for (var i = 0; i < objs.length; i++) {
                if (objs[i].portStatus == 0) {
                    html += '<option value="' + objs[i].pt_id + '">' + objs[i].portName + '</option>';
                } else if (objs[i].portStatus == 1) {
                    html += '<option value="' + objs[i].pt_id + '" disabled="disabled">' + objs[i].portName + '</option>';
                }
            }
            $('[id = "selectToPort_' + k + '"]').html(html);
        },
        error: function () {

        }
    });
}

//初始化复杂节点链路模态框中选择简单节点的端口
function initFromPort(data, k) {
    var html = '';
    var objs = jQuery.parseJSON(data);
    for (var i = 0; i < objs.length; i++) {
        if (objs[i].portStatus == 0) {
            html += '<option value="' + objs[i].pt_id + '">' + objs[i].portName + '</option>';
        } else if (objs[i].portStatus == 1) {
            html += '<option value="' + objs[i].pt_id + '" disabled="disabled">' + objs[i].portName + '</option>';
        }
    }
    $('[id = "fromPort_' + k + '"]').html(html);
}
function initToPort(data, k) {
    var html = '';
    var objs = jQuery.parseJSON(data);
    for (var i = 0; i < objs.length; i++) {
        if (objs[i].portStatus == 0) {
            html += '<option value="' + objs[i].pt_id + '">' + objs[i].portName + '</option>';
        } else if (objs[i].portStatus == 1) {
            html += '<option value="' + objs[i].pt_id + '" disabled="disabled">' + objs[i].portName + '</option>';
        }
    }
    $('[id = "toPort_' + k + '"]').html(html);
}

//新建链路——模态框
var link_ips = [];
scene.mouseup(function (e) {
    if (e.target != null && e.target instanceof JTopo.Node && flag != 0) {
        if (beginNode == null) {
            beginNode = e.target;
            scene.add(link1);
            tempNodeA.setLocation(e.x, e.y);
            tempNodeZ.setLocation(e.x, e.y);
        } else if (beginNode !== e.target) {
            endLastNode = e.target;
            getExitLinkIps();
            //判断选择的节点中是否有复杂节点，弹出相应的模态框
            if (beginNode.fontColor == "255,0,0" && endLastNode.fontColor == "255,0,0") {
                //复杂——复杂
                $("#complexNodeLinkModal_0").modal();
                //发送ajax查询fromNode的内部节点对象列表的json
                $.ajax({
                    url: '/NetworkSimulation/selectInnerNodeList',
                    data: {
                        complexNodeName: beginNode.text,
                        s_id : $.getUrlParam("scenarioId")
                    },
                    type: 'post',
                    dataType: 'json',
                    async: false,
                    success: function (msg) {
                        initFromNode(msg, 0);
                    },
                    error: function () {

                    }
                });
                //发送ajax查询toNode的内部节点对象列表的json
                $.ajax({
                    url: '/NetworkSimulation/selectInnerNodeList',
                    data: {
                        complexNodeName: endLastNode.text,
                        s_id : $.getUrlParam("scenarioId")
                    },
                    type: 'post',
                    dataType: 'json',
                    async: false,
                    success: function (msg) {
                        initToNode(msg, 0);
                    },
                    error: function () {

                    }
                });
            } else if (beginNode.fontColor == "255,0,0" && endLastNode.fontColor == "0,0,0") {
                //复杂——简单
                $("#complexNodeLinkModal_2").modal();
                //发送ajax查询fromNode的内部节点对象列表的json
                $.ajax({
                    url: '/NetworkSimulation/selectInnerNodeList',
                    data: {
                        complexNodeName: beginNode.text,
                        s_id : $.getUrlParam("scenarioId")
                    },
                    type: 'post',
                    dataType: 'json',
                    async: false,
                    success: function (msg) {
                        console.log("已获得复杂节点对象json");
                        initFromNode(msg, 2);
                    },
                    error: function () {

                    }
                });
                //发送ajax查询to端口
                $.ajax({
                    url: '/NetworkSimulation/getPortBynodeName',
                    data: {
                        nodeName: endLastNode.text,
                        s_id : $.getUrlParam("scenarioId")
                    },
                    type: 'post',
                    dataType: 'json',
                    async: false,
                    success: function (msg) {
                        initToPort(msg, 2);
                    },
                    error: function () {

                    }
                });
            } else if (beginNode.fontColor == "0,0,0" && endLastNode.fontColor == "255,0,0") {
                //简单——复杂
                $("#complexNodeLinkModal_1").modal();
                //发送ajax查询from端口
                $.ajax({
                    url: '/NetworkSimulation/getPortBynodeName',
                    data: {
                        nodeName: beginNode.text,
                        s_id : $.getUrlParam("scenarioId")
                    },
                    type: 'post',
                    dataType: 'json',
                    async: false,
                    success: function (msg) {
                        initFromPort(msg, 1);
                    },
                    error: function () {

                    }
                });
                //发送ajax查询toNode的内部节点对象列表的json
                $.ajax({
                    url: '/NetworkSimulation/selectInnerNodeList',
                    data: {
                        complexNodeName: endLastNode.text,
                        s_id : $.getUrlParam("scenarioId")
                    },
                    type: 'post',
                    dataType: 'json',
                    async: false,
                    success: function (msg) {
                        console.log("已读取内部节点");
                        initToNode(msg, 1);
                    },
                    error: function () {

                    }
                });
            } else {
                //简单——简单
                $("#linkModal").modal();
                //发送ajax查询from端口
                $.ajax({
                    url: '/NetworkSimulation/getPortBynodeName',
                    data: {
                        nodeName: beginNode.text,
                        s_id : $.getUrlParam("scenarioId")
                    },
                    type: 'post',
                    dataType: 'json',
                    async: false,
                    success: function (msg) {
                        initFromPortList(msg);
                    },
                    error: function () {

                    }
                });
                //发送ajax查询to端口
                $.ajax({
                    url: '/NetworkSimulation/getPortBynodeName',
                    data: {
                        nodeName: endLastNode.text,
                        s_id : $.getUrlParam("scenarioId")
                    },
                    type: 'post',
                    dataType: 'json',
                    async: false,
                    success: function (msg) {
                        initToPortList(msg);
                    },
                    error: function () {

                    }
                });
            }
        } else {
            beginNode = null;
        }
    } else {
        scene.remove(link1);
    }
});

//查询已有链路的地址
function getExitLinkIps() {
    $.ajax({
        url: '/NetworkSimulation/getLinkList',
        data: {
            s_id : $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (data) {
            var objs = jQuery.parseJSON(data);
            for (var i = 0; i < objs.length; i++){
                //存已有ip地址的前三位
                link_ips[i] = objs[i].fromNodeIP.substring(0,objs[i].fromNodeIP.lastIndexOf("."));
            }
            console.log("已读取存在的网段");
        },
        error: function () {

        }
    });
}

//判断输入的ip与已存在的ip不属于同网段
$("#fromNodeIP").blur(function () {
    var ip = $("#fromNodeIP").val();
    if (isValidIP(ip)) {
        //再判断是否重复
        for (var i = 0; i < link_ips.length; i++){
            if (ip.match(link_ips[i]) != null){
                //匹配到不空，说明有重复的网段，显示出错误信息
                $("#fromNodeIpErrorInfo").removeAttr("hidden");
                $("#fromNodeIpErrorInfo").html("输入的地址网段与已有的重复，请重新输入！");
                $("#fromNodeIP").val("");
                return false;
            }
        }
        //匹配到都是null，说明没有重复的网段
        $("#fromNodeIpErrorInfo").attr("hidden", "hidden");
        return true;
    } else {
        $("#fromNodeIpErrorInfo").removeAttr("hidden");
        $("#fromNodeIpErrorInfo").html("输入的ip地址不合法，请重新输入！");
        $("#fromNodeIP").val("");
        return false;
    }
});
$("#toNodeIP").blur(function () {
    var ip = $("#toNodeIP").val();
    if (isValidIP(ip)) {
        //再判断是否重复
        for (var i = 0; i < link_ips.length; i++){
            if (ip.match(link_ips[i]) != null){
                $("#toNodeIpErrorInfo").removeAttr("hidden");
                $("#toNodeIpErrorInfo").html("输入的地址网段与已有的重复，请重新输入！");
                $("#toNodeIP").val("");
                return false;
            }
        }
        $("#toNodeIpErrorInfo").attr("hidden", "hidden");
        return true;
    } else {
        $("#toNodeIpErrorInfo").removeAttr("hidden");
        $("#toNodeIpErrorInfo").html("输入的ip地址不合法，请重新输入！");
        $("#toNodeIP").val("");
        return false;
    }
});

$("#fromNodeIP_0").blur(function () {
    var ip = $("#fromNodeIP_0").val();
    if (isValidIP(ip)) {
        //再判断是否重复
        for (var i = 0; i < link_ips.length; i++){
            if (ip.match(link_ips[i]) != null){
                //匹配到不空，说明有重复的网段，显示出错误信息
                $("#fromNodeIpErrorInfo_0").removeAttr("hidden");
                $("#fromNodeIpErrorInfo_0").html("输入的地址网段与已有的重复，请重新输入！");
                $("#fromNodeIP_0").val("");
                return false;
            }
        }
        //匹配到都是null，说明没有重复的网段
        $("#fromNodeIpErrorInfo_0").attr("hidden", "hidden");
        return true;
    } else {
        $("#fromNodeIpErrorInfo_0").removeAttr("hidden");
        $("#fromNodeIpErrorInfo_0").html("输入的ip地址不合法，请重新输入！");
        $("#fromNodeIP_0").val("");
        return false;
    }
});
$("#toNodeIP_0").blur(function () {
    var ip = $("#toNodeIP_0").val();
    if (isValidIP(ip)) {
        //再判断是否重复
        for (var i = 0; i < link_ips.length; i++){
            if (ip.match(link_ips[i]) != null){
                $("#toNodeIpErrorInfo_0").removeAttr("hidden");
                $("#toNodeIpErrorInfo_0").html("输入的地址网段与已有的重复，请重新输入！");
                $("#toNodeIP_0").val("");
                return false;
            }
        }
        $("#toNodeIpErrorInfo_0").attr("hidden", "hidden");
        return true;
    } else {
        $("#toNodeIpErrorInfo_0").removeAttr("hidden");
        $("#toNodeIpErrorInfo_0").html("输入的ip地址不合法，请重新输入！");
        $("#toNodeIP_0").val("");
        return false;
    }
});

$("#fromNodeIP_1").blur(function () {
    var ip = $("#fromNodeIP_1").val();
    if (isValidIP(ip)) {
        //再判断是否重复
        for (var i = 0; i < link_ips.length; i++){
            if (ip.match(link_ips[i]) != null){
                //匹配到不空，说明有重复的网段，显示出错误信息
                $("#fromNodeIpErrorInfo_1").removeAttr("hidden");
                $("#fromNodeIpErrorInfo_1").html("输入的地址网段与已有的重复，请重新输入！");
                $("#fromNodeIP_1").val("");
                return false;
            }
        }
        //匹配到都是null，说明没有重复的网段
        $("#fromNodeIpErrorInfo_1").attr("hidden", "hidden");
        return true;
    } else {
        $("#fromNodeIpErrorInfo_1").removeAttr("hidden");
        $("#fromNodeIpErrorInfo_1").html("输入的ip地址不合法，请重新输入！");
        $("#fromNodeIP_1").val("");
        return false;
    }
});
$("#toNodeIP_1").blur(function () {
    var ip = $("#toNodeIP_1").val();
    if (isValidIP(ip)) {
        //再判断是否重复
        for (var i = 0; i < link_ips.length; i++){
            if (ip.match(link_ips[i]) != null){
                $("#toNodeIpErrorInfo_1").removeAttr("hidden");
                $("#toNodeIpErrorInfo_1").html("输入的地址网段与已有的重复，请重新输入！");
                $("#toNodeIP_1").val("");
                return false;
            }
        }
        $("#toNodeIpErrorInfo_1").attr("hidden", "hidden");
        return true;
    } else {
        $("#toNodeIpErrorInfo_1").removeAttr("hidden");
        $("#toNodeIpErrorInfo_1").html("输入的ip地址不合法，请重新输入！");
        $("#toNodeIP_1").val("");
        return false;
    }
});

$("#fromNodeIP_2").blur(function () {
    var ip = $("#fromNodeIP_2").val();
    if (isValidIP(ip)) {
        //再判断是否重复
        for (var i = 0; i < link_ips.length; i++){
            if (ip.match(link_ips[i]) != null){
                //匹配到不空，说明有重复的网段，显示出错误信息
                $("#fromNodeIpErrorInfo_2").removeAttr("hidden");
                $("#fromNodeIpErrorInfo_2").html("输入的地址网段与已有的重复，请重新输入！");
                $("#fromNodeIP_2").val("");
                return false;
            }
        }
        //匹配到都是null，说明没有重复的网段
        $("#fromNodeIpErrorInfo_2").attr("hidden", "hidden");
        return true;
    } else {
        $("#fromNodeIpErrorInfo_2").removeAttr("hidden");
        $("#fromNodeIpErrorInfo_2").html("输入的ip地址不合法，请重新输入！");
        $("#fromNodeIP_2").val("");
        return false;
    }
});
$("#toNodeIP_2").blur(function () {
    var ip = $("#toNodeIP_2").val();
    if (isValidIP(ip)) {
        //再判断是否重复
        for (var i = 0; i < link_ips.length; i++){
            if (ip.match(link_ips[i]) != null){
                $("#toNodeIpErrorInfo_2").removeAttr("hidden");
                $("#toNodeIpErrorInfo_2").html("输入的地址网段与已有的重复，请重新输入！");
                $("#toNodeIP_2").val("");
                return false;
            }
        }
        $("#toNodeIpErrorInfo_2").attr("hidden", "hidden");
        return true;
    } else {
        $("#toNodeIpErrorInfo_2").removeAttr("hidden");
        $("#toNodeIpErrorInfo_2").html("输入的ip地址不合法，请重新输入！");
        $("#toNodeIP_2").val("");
        return false;
    }
});

var fromPortList = [];
var fromPortId = [];
//初始化from端口下拉框
function initFromPortList(data) {
    fromPortList = [];
    fromPortId = [];
    var objs = jQuery.parseJSON(data);
    for (var i = 0; i < objs.length; i++){
        fromPortList[i] = objs[i].portName;
        fromPortId[i] = objs[i].pt_id;
    }
    var areaCont = "";
    for (var i = 0; i < objs.length; i++){
        if (objs[i].portStatus == 0){
            areaCont += '<option value="' + fromPortId[i] + '">' + fromPortList[i] + '</option>';
        } else {
            areaCont += '<option value="' + fromPortId[i] + '" disabled="disabled">' + fromPortList[i] + '(已占用)' + '</option>';
        }
    }
    $("#fromPort").html(areaCont);
}

var toPortList = [];
var toPortId = [];
//初始化to端口下拉框
function initToPortList(data) {
    toPortList = [];
    toPortId = [];
    var objs = jQuery.parseJSON(data);
    for (var i = 0; i < objs.length; i++){
        toPortList[i] = objs[i].portName;
        toPortId[i] = objs[i].pt_id;
    }
    var areaCont = "";
    for (var i = 0; i < objs.length; i++){
        if (objs[i].portStatus == 0){
            areaCont += '<option value="' + toPortId[i] + '">' + toPortList[i] + '</option>';
        } else {
            areaCont += '<option value="' + toPortId[i] + '" disabled="disabled">' + toPortList[i] + '(已占用)' + '</option>';
        }
    }
    $("#toPort").html(areaCont);
}

scene.mousedown(function (e) {
    if (e.target == null || e.target === beginNode || e.target === link1) {
        scene.remove(link1);
    }
});

scene.mousemove(function (e) {
    tempNodeZ.setLocation(e.x, e.y);
});

//创建节点函数
function createNode(name, X, Y, pic) {
    var node = new JTopo.Node(name);
    node.setLocation(X, Y);
    node.fontColor = "0,0,0";
    node.setImage(pic, true);
    scene.add(node);
}

function createComplexNode(name, X, Y, pic) {
    var node = new JTopo.Node(name);
    node.setLocation(X, Y);
    node.fontColor = "255,0,0";
    node.setImage(pic, true);
    scene.add(node);
}

//创建连线函数
function newLink(nodeA, nodeZ, text, color) {
    var link = new JTopo.Link(nodeA, nodeZ, text);
    link.fontColor = "0,0,0";
    link.lineWidth = 2; // 线宽
    //link.dashedPattern = dashedPattern; // 虚线
    link.bundleOffset = 60; // 折线拐角处的长度
    link.bundleGap = 20; // 线条之间的间隔
    link.textOffsetY = 3; // 文本偏移量（向下3个像素）
    link.strokeColor = color;
    link.arrowsRadius = 10;
    scene.add(link);
    return link;
}

$("#weixing1").draggable({
    helper: "clone"
});
$("#weixing2").draggable({
    helper: "clone"
});
$("#weixing3").draggable({
    helper: "clone"
});
$("#weixing4").draggable({
    helper: "clone"
});

var uiOut;//全局数据-->用于传递变量-->将拖动的数据信息保存起来
//保存已有的管理ip
var node_ips = [];
//新建节点
$("#canvas").droppable({
    drop: function (event, ui) {
        uiOut = ui;//保存数据
        var getId = uiOut.draggable[0].id;
        node_ips = [];
        //如果拖拽的是简单节点
        if (getId == "weixing1") {
            //首先弹出模态框
            $("#myModal").modal();
            //查询已有节点的信息，确保输入的管理ip不会重复
            $.ajax({
                url: '/NetworkSimulation/selectNodeList',
                data: {
                    s_id : $.getUrlParam("scenarioId")
                },
                type: 'post',
                dataType: 'json',
                async: false,
                success: function (data) {
                    var objs = jQuery.parseJSON(data);
                    for (var i = 0; i < objs.length; i++){
                        node_ips[i] = objs[i].manageIp;
                    }
                },
                error: function () {

                }
            });
        }
        //如果拖拽的是复杂节点
        if (getId == "weixing2") {
            $("#complexNodeModal").modal();
        }
    }
});

//判断输入管理ip的合法性
$("#manageIP").blur(function () {
    var ip = $("#manageIP").val();
    //先检查合法性
    var reSpaceCheck = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
    if (reSpaceCheck.test(ip)) {
        ip.match(reSpaceCheck);
        if ( RegExp.$1 == 192 && RegExp.$2 == 168 && ( RegExp.$3 == 10 || RegExp.$3 == 5 )
            && RegExp.$4 <= 255 && RegExp.$4 > 0) {
            //再检查是否有重复
            for (var i = 0; i < node_ips.length; i++){
                if (ip == node_ips[i]){
                    $("#nodeIpErrorInfo").removeAttr("hidden");
                    $("#nodeIpErrorInfo").html("输入的ip又已有节点的管理ip重复，请重新输入！");
                    //清空输入框的值
                    $("#manageIP").val("");
                    return false;
                }
            }
            $("#nodeIpErrorInfo").attr("hidden", "hidden");
            return true;
        }else {
            $("#nodeIpErrorInfo").removeAttr("hidden");
            $("#nodeIpErrorInfo").html("输入的网段不合法，请重新输入！");
            //清空输入框的值
            $("#manageIP").val("");
            return false;
        }
    } else {
        $("#nodeIpErrorInfo").removeAttr("hidden");
        $("#nodeIpErrorInfo").html("输入的ip地址不合法，请重新输入！");
        //清空输入框的值
        $("#manageIP").val("");
        return false;
    }
});

//创建节点模态框中的提交
$("#addNode").click(function () {
    //在画布上绘制出节点图标
    // createNode($("#nodeName").val(), uiOut.offset.left - document.getElementById("slider_1").offsetWidth, uiOut.offset.top - 102, "img/gaogui01.png");
    $.ajax({
        url: '/NetworkSimulation/addNode',
        data: {
            nodeName : $("#nodeName").val(),
            manageIp : $("#manageIP").val(),
            nodeType : $("#nodeType").val(),
            hardwareArchitecture : $("#hardwareArchitecture").val(),
            operatingSystem : $("#operatingSystem").val(),
            flavorType : $("#nodeConfig").val(),
            imageName : $("#nodeImage").val(),
            x : uiOut.offset.left - document.getElementById("slider_1").offsetWidth,
            y : uiOut.offset.top - 102,
            s_id : $.getUrlParam("scenarioId"),
            iconUrl : "img/gaogui01.png"
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            $.alert(msg);
            if (msg == "创建成功") {
                //在画布上绘制出节点图标
                createNode($("#nodeName").val(), uiOut.offset.left - document.getElementById("slider_1").offsetWidth, uiOut.offset.top - 102, "img/gaogui01.png");
                //关闭模态框
                $('#myModal').modal('hide');
            }
        },
        error: function () {

        }
    });
});

//新建复杂节点提交
$("#addComplexNode").click(function () {
    //发送执行ajax的请求
    $.ajax({
        url: '/NetworkSimulation/addComplexNode',
        data: {
            complexNodeName : $("#complexNodeName").val(),
            x : uiOut.offset.left - document.getElementById("slider_1").offsetWidth,
            y : uiOut.offset.top - 102,
            s_id : $.getUrlParam("scenarioId"),
            iconUrl : "img/zhonggui01.png"
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            $.alert(msg);
            if (msg == "创建成功") {
                //在画布上绘制出节点图标
                createComplexNode($("#complexNodeName").val(), uiOut.offset.left - document.getElementById("slider_1").offsetWidth, uiOut.offset.top - 102, "img/zhonggui01.png");
                //关闭模态框
                $('#complexNodeModal').modal('hide');
            }
        },
        error: function () {

        }
    });
});

//链路模态框中请求的发送
$("#addLink").click(function () {
    $.ajax({
        url: '/NetworkSimulation/addLink',
        data: {
            linkName : $("#linkName").val(),
            linkType : $("#linkType").val(),
            fromNodeIP : $("#fromNodeIP").val(),
            toNodeIP : $("#toNodeIP").val(),
            fromNodeName : beginNode.text,
            toNodeName : endLastNode.text,
            logicalFromNodeName : beginNode.text,
            logicalToNodeName : endLastNode.text,
            txPort_id : $("#fromPort").val(),
            rxPort_id : $("#toPort").val(),
            linkNoise : $("#channelNoise").val(),
            channelModel : $("#channelType").val(),
            linkLength : $("#linkLength").val(),
            scenario_id : $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            $.alert(msg);
            if (msg == "创建成功") {
                //在画布上绘制出链路
                if ($("#linkType").val() == 0) {//有线链路
                    // newLink(beginNode, endLastNode, beginNode.text + ":" + fromNodeIP.value + " -> " + endLastNode.text + ":" + toNodeIP.value, "0,0,255");
                    newLink(beginNode, endLastNode, $("#linkName").val(), "0,0,255");
                } else if ($("#linkType").val() == 1) {//无线链路
                    newLink(beginNode, endLastNode, "链路2", "0,0,0");
                }
                beginNode = null;
                scene.remove(link1);
                //关闭模态框
                $('#linkModal').modal('hide');
            }
        },
        error: function () {

        }
    });
});

//复杂到复杂链路模态框提交
$("#addComplexLink_0").click(function () {
    $.ajax({
        url: '/NetworkSimulation/addLink',
        data: {
            linkName : $("#linkName_0").val(),
            linkType : $("#linkType_0").val(),
            fromNodeIP : $("#fromNodeIP_0").val(),
            toNodeIP : $("#toNodeIP_0").val(),
            fromNodeName : $("#selectFromNode_0").val(),
            toNodeName : $("#selectToNode_0").val(),
            logicalFromNodeName : beginNode.text,
            logicalToNodeName : endLastNode.text,
            txPort_id : $("#selectFromPort_0").val(),
            rxPort_id : $("#selectToPort_0").val(),
            linkNoise : $("#channelNoise_0").val(),
            // linkInterference : $("#channelDisturbance_0").val(),
            channelModel : $("#channelType_0").val(),
            linkLength : $("#linkLength_0").val(),
            scenario_id : $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            $.alert(msg);
            if (msg == "创建成功") {
                //在画布上绘制出链路
                if ($("#linkType_0").val() == 0) {//有线链路
                    // newLink(beginNode, endLastNode, beginNode.text + ":" + fromNodeIP.value + " -> " + endLastNode.text + ":" + toNodeIP.value, "0,0,255");
                    newLink(beginNode, endLastNode, $("#linkName_0").val(), "0,0,255");
                } else if ($("#linkType_0").val() == 1) {//无线链路
                    newLink(beginNode, endLastNode, "链路2", "0,0,0");
                }
                beginNode = null;
                scene.remove(link1);
                //关闭模态框
                $('#complexNodeLinkModal_0').modal('hide');
            }
        },
        error: function () {

        }
    });
});

//简单到复杂链路模态框提交
$("#addComplexLink_1").click(function () {
    $.ajax({
        url: '/NetworkSimulation/addLink',
        data: {
            linkName : $("#linkName_1").val(),
            linkType : $("#linkType_1").val(),
            fromNodeIP : $("#fromNodeIP_1").val(),
            toNodeIP : $("#toNodeIP_1").val(),
            fromNodeName : beginNode.text,
            toNodeName : $("#selectToNode_1").val(),
            logicalFromNodeName : beginNode.text,
            logicalToNodeName : endLastNode.text,
            txPort_id : $("#fromPort_1").val(),
            rxPort_id : $("#selectToPort_1").val(),
            linkNoise : $("#channelNoise_1").val(),
            // linkInterference : $("#channelDisturbance_1").val(),
            channelModel : $("#channelType_1").val(),
            linkLength : $("#linkLength_1").val(),
            scenario_id : $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            $.alert(msg);
            if (msg == "创建成功") {
                //在画布上绘制出链路
                if ($("#linkType_1").val() == 0) {//有线链路
                    // newLink(beginNode, endLastNode, beginNode.text + ":" + fromNodeIP.value + " -> " + endLastNode.text + ":" + toNodeIP.value, "0,0,255");
                    newLink(beginNode, endLastNode, $("#linkName_1").val(), "0,0,255");
                } else if ($("#linkType_1").val() == 1) {//无线链路
                    newLink(beginNode, endLastNode, "链路2", "0,0,0");
                }
                beginNode = null;
                scene.remove(link1);
                //关闭模态框
                $('#complexNodeLinkModal_1').modal('hide');
            }
        },
        error: function () {

        }
    });
});

//复杂到简单链路模态框提交
$("#addComplexLink_2").click(function () {
    $.ajax({
        url: '/NetworkSimulation/addLink',
        data: {
            linkName : $("#linkName_2").val(),
            linkType : $("#linkType_2").val(),
            fromNodeIP : $("#fromNodeIP_2").val(),
            toNodeIP : $("#toNodeIP_2").val(),
            fromNodeName : $("#selectFromNode_2").val(),
            toNodeName : endLastNode.text,
            logicalFromNodeName : beginNode.text,
            logicalToNodeName : endLastNode.text,
            txPort_id : $("#selectFromPort_2").val(),
            rxPort_id : $("#toPort_2").val(),
            linkNoise : $("#channelNoise_2").val(),
            linkInterference : $("#channelDisturbance_2").val(),
            channelModel : $("#channelType_2").val(),
            linkLength : $("#linkLength_2").val(),
            scenario_id : $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            $.alert(msg);
            if (msg == "创建成功") {
                //在画布上绘制出链路
                if ($("#linkType_2").val() == 0) {//有线链路
                    // newLink(beginNode, endLastNode, beginNode.text + ":" + fromNodeIP.value + " -> " + endLastNode.text + ":" + toNodeIP.value, "0,0,255");
                    newLink(beginNode, endLastNode, $("#linkName_2").val(), "0,0,255");
                } else if ($("#linkType_2").val() == 1) {//无线链路
                    newLink(beginNode, endLastNode, "链路2", "0,0,0");
                }
                beginNode = null;
                scene.remove(link1);
                //关闭模态框
                $('#complexNodeLinkModal_2').modal('hide');
            }
        },
        error: function () {

        }
    });
});

//点击上传stk文件
$("#inputFileSubmit").click(function () {
    // $.ajaxFileUpload({
    //     url: '/NetworkSimulation/sendStkFile', //用于文件上传的服务器端请求地址
    //     secureuri: false, //是否需要安全协议，一般设置为false
    //     fileElementId: 'inputFile', //文件上传域的ID
    //     dataType: 'json', //返回值类型 一般设置为json
    //     success: function (data, status) {
    //         $.alert(data);
    //         window.open(encodeURI("dynamicSetting.html?scenarioId=" + $.getUrlParam("scenarioId")));
    //     },
    //     error: function (data, status, e) {
    //         $.alert(e);
    //     }
    // });
    // setTimeout(function () {
    //     location.herf = encodeURI("index3.html?scenarioId=" + scenarioId + "&scenarioName=" + $("#scenarioName").html + "&projectName=" + $("#projectName").html);
    // }, 300);
    setTimeout(function () {
        window.open(encodeURI("dynamicSetting.html?scenarioId=" + scenarioId));
    }, 1000);
});

/**
 * 点击开始仿真按钮
 */
$("#startSimulation").click(function () {
    $.ajax({
        url: '/NetworkSimulation/startSimulation',
        data: {
            s_id : $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: true,
        success: function (msg) {
            console.log("开始仿真：" + msg);
            $.alert(msg);
        },
        error: function () {

        }
    });
    setInterval(function () { // 每分钟刷新画布
        refreshCanvas();
    }, 60 * 1000);
});

//打开控制台页面
$("#openCli").click(function () {
    var elements = scene.selectedElements;
    if (elements[0] == undefined || elements[0] instanceof JTopo.Link || elements[0].fontColor == "255,0,0"){
        $.alert("请选中简单节点后在进行下一步操作");
    } else if (simpleNodeType[elements[0].text] == 0) {
        //如果是docker节点
        window.open(encodeURI("dockerConsole.html?nodeId=" + simpleNodeId[elements[0].text]));
    } else if (simpleNodeType[elements[0].text] == 1) {
        //如果是vm
        $.ajax({
            url: '/NetworkSimulation/openConsole',
            data: {
                nodeName: elements[0].text,
                s_id : $.getUrlParam("scenarioId")
            },
            type: 'post',
            dataType: 'json',
            async: false,
            success: function (msg) {
                // $.alert("即将打开vm控制台：" + msg);
                window.open(msg);
            },
            error: function () {

            }
        });
    } else if (simpleNodeType[elements[0].text] == null) {
        //如果是新建的节点，未存id和type就刷新
        $.alert("自动刷新后请您再打开。");
        window.location.reload();
    }
});

//打开内部编辑器
$("#openInnerEdit").click(function () {
    var elements = scene.selectedElements;
    if (elements[0] == undefined || elements[0] instanceof JTopo.Link || elements[0].fontColor != "255,0,0"){
        $.alert("请选中三层复杂节点后在进行下一步操作");
    } else {
        window.open(encodeURI("innerEdit.html?nodeName=" + elements[0].text + "&scenarioId=" + $.getUrlParam("scenarioId")));
    }
});

/**
 * 打开节点编辑器
 */
$("#editNode").click(function () {
    var elements = scene.selectedElements;
    if (elements[0] instanceof JTopo.Node && elements[0].fontColor == "0,0,0") { // 选中的是简单节点
        window.open(encodeURI("nodeEdit.html?nodeName=" + elements[0].text + "&scenarioId=" + $.getUrlParam("scenarioId")));
    } else if (elements[0] instanceof JTopo.Node && elements[0].fontColor == "255,0,0") { // 选中的是复杂节点
        window.open(encodeURI("complexNodeEdit.html?complexNodeName=" + elements[0].text + "&scenarioId=" + $.getUrlParam("scenarioId")));
    } else {
        $.alert("请选中节点后在进行下一步操作！");
    }
});

//设置链路定时断开
$("#cutLink").click(function () {
   var elements = scene.selectedElements;
   if (elements[0] == undefined || elements[0] instanceof JTopo.Node){
       $.alert("请选中链路后在进行下一步操作！");
   } else {
       //弹出模态框
       $("#cutLinkModal").modal();
   }
});

//设置链路定时断开提交
$("#cutLinkSubmit").click(function () {
    setTimeout(function () {
        $.ajax({
            url: '/NetworkSimulation/cutLink',
            data: {
                linkName : elements[0].text,
                scenario_id : $.getUrlParam("scenarioId")
            },
            type: 'post',
            dataType: 'json',
            async: true,
            success: function (msg) {
                $.alert(msg);
                if (msg == "断开成功") {
                    //变化链路为红色虚线
                    changeLinkToRed(elements[0]);
                }
            },
            error: function () {

            }
        });
    }, $("#cutLinkTime").val() * 1000);
    //关闭模态框
    $("#cutLinkModal").modal('hide');
});

//接通链路
$("#connectLink").click(function () {
    var elements = scene.selectedElements;
    if (elements[0] == undefined || elements[0] instanceof JTopo.Node){
        $.alert("请选中链路后在进行下一步操作");
    } else {
        $.ajax({
            url: '/NetworkSimulation/connectLink',
            data: {
                linkName : elements[0].text,
                scenario_id : $.getUrlParam("scenarioId")
            },
            type: 'post',
            dataType: 'json',
            async: false,
            success: function (msg) {
                $.alert(msg);
                if (msg == "恢复成功") {
                    //变化链路为蓝色
                    changeLinkToBlue(elements[0]);
                }
            },
            error: function () {

            }
        });
    }
});

//options
var linkListHtml ='';
//status
var statusMap = [];
//设置链路通段时间
$("#setLinkTime").click(function () {
    //弹出模态框
    $("#setLinkTimeModal").modal();
    $.ajax({
        url: '/NetworkSimulation/getLinkList',
        data: {
            s_id : $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (data) {
            initSelectLink(data);
        },
        error: function () {

        }
    });
    // var testJson = '[{"channelModel":0,"fromNodeName":"55","l_id":44,"linkInterference":234,"linkLength":34,"linkName":"link321","linkNoise":132,"linkStatus":0,"linkType":0,"rxPort_id":95,"scenario_id":25,"toNodeName":"66","txPort_id":94},{"channelModel":0,"fromNodeName":"6677","l_id":45,"linkInterference":234,"linkLength":34,"linkName":"link321123","linkNoise":132,"linkStatus":0,"linkType":0,"rxPort_id":97,"scenario_id":25,"toNodeName":"55","txPort_id":96}]';
    // initSelectLink(testJson);
});

//初始化可选链路列表
function initSelectLink(data) {
    linkListHtml = '';
    var objs = jQuery.parseJSON(data);
    for (var i = 0; i < objs.length; i++) {
        linkListHtml += '<option value="' + objs[i].linkName + '" >' + objs[i].linkName + '</option>';
        statusMap[objs[i].linkName] = objs[i].linkStatus;
    }
    // console.log(linkListHtml);
    $("#selectLink_0").html(linkListHtml);
}

//判断链路状态来决定是否能选择连通或断开
function selectConnction(i) {
    //如果是断开的那一行
    // console.log($('[id = "selectLink_' + i + '"]').val());
    if (statusMap[$('[id = "selectLink_' + i + '"]').val()] == 1) {
        $('[id = "switch_' + i + '"]').children().last().attr("disabled", "disabled");
        $('[id = "switch_' + i + '"]').children().first().removeAttr("disabled", "disabled");
    }
    //如果是连通的一行
    if (statusMap[$('[id = "selectLink_' + i + '"]').val()] == 0) {
        $('[id = "switch_' + i + '"]').children().first().attr("disabled", "disabled");
        $('[id = "switch_' + i + '"]').children().last().removeAttr("disabled", "disabled");
    }
}

//用于记录第几行的数据的标记,默认已经有第0行
var flag_1 = 0;
//点击增加一行
$("#addOneControl").click(function () {
    ++flag_1;
    var htmlString1 = '<div class="form-group">\
            <label class="col-sm-2 control-label">时刻</label>\
            <div class="col-sm-2">\
            <input type="text" class="form-control" placeholder="X秒" id="moment_' + flag_1 + '">\
            </div>\
            <div class="col-sm-4">\
            <select class="form-control" id="selectLink_' + flag_1 + '" onchange="selectConnction(' + flag_1 + ');">';
    var htmlString2 = '</select>\
            </div>\
            <div class="col-sm-4">\
            <select class="form-control" id="switch_' + flag_1 + '">\
            <option value="0" >连通</option>\
            <option value="1" >断开</option>\
            </select>\
            </div>\
            </div>';
    var htmlString = $("#setLinkTimeForm").html() + htmlString1 + linkListHtml + htmlString2;
    $("#setLinkTimeForm").html(htmlString);
});

//点击删除一行
$("#minusOneControl").click(function () {
    if (flag_1 > 0) {
        //flag最小回归为0
        --flag_1;
    }
    $("#setLinkTimeForm").children().last().remove();
});

//设置链路通断时间点击提交
$("#setLinkTimeSubmit").click(function () {
    //i为行数
    // console.log("flag_1:" + flag_1);
    console.log("链路名：" + $('[id = "selectLink_' + 0 + '"]').val());
    if ($("#totalTime").val() == '') {
        $.alert("请输入总仿真时间！");
        return false;
    }
    var elements = scene.getDisplayedElements();
    //遍历每行定时任务
    for (var i = 0; i <= flag_1; i++) {
        if ($('[id = "moment_' + i + '"]').val() > $("#totalTime").val()) {
            $.alert("第" + i + "行的时刻输入大于总仿真时间，请重新输入！");
            $('[id = "moment_' + i + '"]').val('');
            return false;
        }
        if ($('[id = "switch_' + i + '"]').val() == 0) {
            console.log("发送第" + i + "行连通请求");
            console.log("链路名：" + $('[id = "selectLink_' + i + '"]').val());
            $.ajax({
                url: '/NetworkSimulation/connectLink',
                data: {
                    linkName : $('[id = "selectLink_' + i + '"]').val(),
                    scenario_id : $.getUrlParam("scenarioId"),
                    delayTime : $('[id = "moment_' + i + '"]').val()
                },
                type: 'post',
                dataType: 'json',
                async: true,
                success: function (msg) {
                    if (msg == "恢复成功") {
                        //变化链路为蓝色
                        for (var i = 0; i < elements.length; i++) {
                            //在画布上找到该链路对象
                            if (elements[i] instanceof JTopo.Link && elements[i].text == $('[id = "selectLink_' + i + '"]').val()) {
                                changeLinkToBlue(elements[i]);
                            }
                        }
                    } else {
                        $.alert("第" + i + "条指令执行失败：" + msg);
                    }
                },
                error: function (msg) {

                }
            });
        }
        if ($('[id = "switch_' + i + '"]').val() == 1) {
            console.log("发送第" + i + "行断开请求");
            console.log("链路名：" + $('[id = "selectLink_' + i + '"]').val());
            $.ajax({
                url: '/NetworkSimulation/cutLink',
                data: {
                    linkName : $('[id = "selectLink_' + i + '"]').val(),
                    scenario_id : $.getUrlParam("scenarioId"),
                    delayTime : $('[id = "moment_' + i + '"]').val()
                },
                type: 'post',
                dataType: 'json',
                async: true,
                success: function (msg) {
                    if (msg == "断开成功") {
                        //变化链路为红色虚线
                        for (var i = 0; i < elements.length; i++) {
                            //在画布上找到该链路对象
                            if (elements[i] instanceof JTopo.Link && elements[i].text == $('[id = "selectLink_' + i + '"]').val()) {
                                changeLinkToRed(elements[i]);
                            }
                        }
                    } else {
                        $.alert("第" + i + "条指令执行失败：" + msg);
                    }
                },
                error: function (msg) {

                }
            });
        }
    }
    $.alert("画布将在" + $("#totalTime").val() + "s后刷新！请稍等");
    setTimeout(function () {
        window.location.reload();
    }, $("#totalTime").val() * 1000 + 10 * 1000);
    //关闭模态框
    $("#setLinkTimeModal").modal('hide');
});