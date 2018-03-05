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
 * 设置canvas画布大小
 */
var canvas = document.getElementById('canvas');
var content = document.getElementById('content');
window.onload = window.onresize = function () {
    canvas.width = content.offsetWidth;
    // canvas.height = content.offsetHeight - 50;
    canvas.height = $(document).height() - 100;
};

$("#slider_1").height($(document).height() - 50); // 设置侧边栏高度

var stage = new JTopo.Stage(canvas); // 创建一个舞台对象
stage.eagleEye.visible = true; // 显示鹰眼
var scene = new JTopo.Scene(stage); // 创建一个场景对象

/**
 * 画布缩放
 */
$('#zoomOutButton').click(function(){
    stage.zoomIn();
});
$('#zoomInButton').click(function(){
    stage.zoomOut();
});

/**
 * 定义获取和更新时间的函数
 */
function showTime() {
    var curTime = new Date();
    $("#systemTime").html(curTime.toLocaleString());
    setTimeout("showTime()", 1000);
}

/**
 * 记录下场景id，在提交解析stk文件时自动填入
 */
var scenarioId = $.getUrlParam("scenarioId");

/**
 * 记录下简单节点的id和类型
 */
var simpleNodeId = [];
var simpleNodeType = [];

/**
 * 刷新画布区域的请求函数
 */
function refreshCanvas() {
    scene.clear(); // 先清楚元素再重画上去
    // 画出已有节点，简单节点
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
                // 解析出来link对象
                var objs = jQuery.parseJSON(data);
                // 获取画布上所有node对象
                var elements = scene.getDisplayedNodes();
                for (var i = 0; i < objs.length; i++) {
                    // 对每个link对象找到fromNode和toNode
                    for (var j = 0; j < elements.length; j++) {
                        if (objs[i].logicalFromNodeName == elements[j].text) {
                            fromNode = elements[j];
                        }
                        if (objs[i].logicalToNodeName == elements[j].text) {
                            toNode = elements[j];
                        }
                    }
                    // 画出链路，静态场景中
                    if (objs[i].linkStatus == 1 && objs[i].cn_id == 0) {
                        newLink(fromNode, toNode, objs[i].linkName, "255,0,0"); // 断开的链路，红色
                    }
                    if (objs[i].linkStatus == 0 && objs[i].cn_id == 0) {
                        newLink(fromNode, toNode, objs[i].linkName, "0,0,255"); // 接通的链路，蓝色
                    }
                    // 动态场景中
                    // if (objs[i].linkStatus == 2 && objs[i].cn_id == 0) {
                    //     //断开的链路，红色
                    //     newLink(fromNode, toNode, objs[i].linkName, "255,0,0");
                    // }
                    if (objs[i].linkStatus == 3 && objs[i].cn_id == 0) {
                        newLink(fromNode, toNode, objs[i].linkName, "0,0,255"); // 接通的链路，蓝色
                    }
                }
            }, 1000);
        },
        error: function () {

        }
    });
}

/**
 * 显示时间，工程名和场景名，刷新画布
 */
$(document).ready(function () {
    if ($.session.get('login') != 'true') { // 如果未登录
        $.alert("请先登录！3秒后自动跳转");
        setTimeout(function () {
            window.location.replace(encodeURI("login.html"));
        }, 3000);
    }
    showTime(); // 右上角显示时间
    $("#scenarioId").val($.getUrlParam("scenarioId")); // 设置到stk提交框
    $("#projectName").html($.getUrlParam("projectName")); // 显示工程名和场景名
    $("#scenarioName").html($.getUrlParam("scenarioName")); // 显示场景名
    refreshCanvas(); // 刷新画布
});

/**
 * 画布中元素的选中状态，名称显示到操作栏
 */
scene.click(function () {
    var elements = scene.selectedElements;
    if (elements[0] == undefined) {
        $("#selectEle").html("null");
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
    } else {
        for (var i = 0; i < elements.length; i++) {
            if (elements[i] instanceof JTopo.Node) { // 如果是节点
                if (elements[i].fontColor == "255,0,0") { // 如果是复杂节点
                    $.alert("删除一个复杂节点：" + elements[i].text);
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
                } else if (elements[i].fontColor == "0,0,0") { // 如果是简单节点
                    $.alert("删除一个简单节点：" + elements[i].text);
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
            if (elements[i] instanceof JTopo.Link) { // 如果是链路被选中
                if (elements[i].strokeColor == "255,0,0") { // 如果是断开的链路
                    $.alert("无法删除断开的链路！");
                } else { // 正常的链路
                    $.alert("删除一个链路：" + elements[i].text);
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
    // setTimeout("refreshCanvas()", 10 * 1000); // 10秒后刷新画布
});

/**
 * 创建连线相关
 */
var beginNode = null;
var endLastNode = null;

var tempNodeA = new JTopo.Node('tempA');
tempNodeA.setSize(1, 1);
var tempNodeZ = new JTopo.Node('tempZ');
tempNodeZ.setSize(1, 1);

var link1 = new JTopo.Link(tempNodeA, tempNodeZ); // 临时显示的线段，跟随鼠标

var link01 = document.getElementById("link01");// 按钮点击事件，添加
var link04 = document.getElementById("link04"); // 停止添加

var flag = 0; // 1,2,3表示三种链路，4表示停止添加链路，用于添加链路类型时候的判断

/**
 * 点击添加链路按钮
 */
$("#addlink01").click(function () {
    flag = 1;
    link01.style.color = "red";
    link04.style.color = "#333";
});

/**
 * 点击停止添加链路
 */
$("#addlink04").click(function () {
    flag = 0;
    link01.style.color = "#333";
    link04.style.color = "red";
    beginNode = null;
});

/**
 * 判断ip是否合法的正则
 */
// function isValidIP(ip) {
//     var reg =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
//     return reg.test(ip);
// }

/**
 * 初始化复杂节点间链路模态框中的数据，分别是选择内部节点和端口的选择框
 * @param data 节点json
 * @param k 标识是那种链路模态框
 */
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

/**
 * 选中节点后，初始化其中的端口
 */
var fromPortObjs_0;
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
            fromPortObjs_0 = jQuery.parseJSON(msg);
            var objs = jQuery.parseJSON(msg);
            for (var i = 0; i < objs.length; i++) {
                if (objs[i].portStatus == 0 || objs[i].isMultiplexing == 1) {
                    html += '<option value="' + objs[i].pt_id + '">' + objs[i].portName + '(' + objs[i].portIp + ')' + '</option>';
                } else if (objs[i].portStatus == 1) {
                    html += '<option value="' + objs[i].pt_id + '" disabled="disabled">' + objs[i].portName + '(已占用)' + '</option>';
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

var toPortObjs_0;
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
            toPortObjs_0 = jQuery.parseJSON(msg);
            var objs = jQuery.parseJSON(msg);
            for (var i = 0; i < objs.length; i++) {
                if (objs[i].portStatus == 0 || objs[i].isMultiplexing == 1) {
                    html += '<option value="' + objs[i].pt_id + '">' + objs[i].portName + '(' + objs[i].portIp + ')' + '</option>';
                } else if (objs[i].portStatus == 1) {
                    html += '<option value="' + objs[i].pt_id + '" disabled="disabled">' + objs[i].portName + '(已占用)' + '</option>';
                }
            }
            $('[id = "selectToPort_' + k + '"]').html(html);
        },
        error: function () {

        }
    });
}

/**
 * 初始化复杂节点链路模态框中选择简单节点的端口
 */
var fromPortObjs_1;
function initFromPort(data, k) {
    var html = '';
    fromPortObjs_1 = jQuery.parseJSON(data);
    var objs = jQuery.parseJSON(data);
    for (var i = 0; i < objs.length; i++) {
        if (objs[i].portStatus == 0 || objs[i].isMultiplexing == 1) {
            html += '<option value="' + objs[i].pt_id + '">' + objs[i].portName + '(' + objs[i].portIp + ')' + '</option>';
        } else if (objs[i].portStatus == 1) {
            html += '<option value="' + objs[i].pt_id + '" disabled="disabled">' + objs[i].portName + '(已占用)' + '</option>';
        }
    }
    $('[id = "fromPort_' + k + '"]').html(html);
}

var toPortObjs_1;
function initToPort(data, k) {
    var html = '';
    toPortObjs_1 = jQuery.parseJSON(data);
    var objs = jQuery.parseJSON(data);
    for (var i = 0; i < objs.length; i++) {
        if (objs[i].portStatus == 0 || objs[i].isMultiplexing == 1) {
            html += '<option value="' + objs[i].pt_id + '">' + objs[i].portName + '(' + objs[i].portIp + ')' + '</option>';
        } else if (objs[i].portStatus == 1) {
            html += '<option value="' + objs[i].pt_id + '" disabled="disabled">' + objs[i].portName + '(已占用)' + '</option>';
        }
    }
    $('[id = "toPort_' + k + '"]').html(html);
}

/**
 * 判断复杂到复杂节点链路模态框中选择的端口网段
 */
$("#selectToPort_0, #selectFromPort_0").blur(function () {
    var fromPortId = $("#selectFromPort_0").val();
    var toPortId = $("#selectToPort_0").val();
    var fromPortIp;
    var toPortIp;
    for (var i = 0; i < fromPortObjs_0.length; i++) {
        if (fromPortId == fromPortObjs_0[i].pt_id) {
            fromPortIp = fromPortObjs_0[i].portIp;
        }
    }
    for (var i = 0; i < toPortObjs_0.length; i++) {
        if (toPortId == toPortObjs_0[i].pt_id) {
            toPortIp = toPortObjs_0[i].portIp;
        }
    }
    fromPortIp = fromPortIp.substring(0, fromPortIp.lastIndexOf("."));
    toPortIp = toPortIp.substring(0, toPortIp.lastIndexOf(".")); // 取得网段
    if (fromPortIp.match(toPortIp) != null) {
        $("#portErrorInfo_0").attr("hidden", "hidden");
    } else {
        $("#portErrorInfo_0").removeAttr("hidden");
    }
});

/**
 * 简单到复杂节点链路模态框端口网段的判断
 */
$("#selectToPort_1, #fromPort_1").blur(function () {
    var fromPortId = $("#fromPort_1").val();
    var toPortId = $("#selectToPort_1").val();
    var fromPortIp;
    var toPortIp;
    for (var i = 0; i < fromPortObjs_1.length; i++) {
        if (fromPortId == fromPortObjs_1[i].pt_id) {
            fromPortIp = fromPortObjs_1[i].portIp;
        }
    }
    for (var i = 0; i < toPortObjs_0.length; i++) {
        if (toPortId == toPortObjs_0[i].pt_id) {
            toPortIp = toPortObjs_0[i].portIp;
        }
    }
    fromPortIp = fromPortIp.substring(0, fromPortIp.lastIndexOf("."));
    toPortIp = toPortIp.substring(0, toPortIp.lastIndexOf(".")); // 取得网段
    if (fromPortIp.match(toPortIp) != null) {
        $("#portErrorInfo_1").attr("hidden", "hidden");
    } else {
        $("#portErrorInfo_1").removeAttr("hidden");
    }
});

/**
 * 复杂到简单节点链路模态框端口网段的判断
 */
$("#selectFromPort_2, #toPort_2").blur(function () {
    var fromPortId = $("#selectFromPort_2").val();
    var toPortId = $("#toPort_2").val();
    var fromPortIp;
    var toPortIp;
    for (var i = 0; i < fromPortObjs_0.length; i++) {
        if (fromPortId == fromPortObjs_0[i].pt_id) {
            fromPortIp = fromPortObjs_0[i].portIp;
        }
    }
    for (var i = 0; i < toPortObjs_1.length; i++) {
        if (toPortId == toPortObjs_1[i].pt_id) {
            toPortIp = toPortObjs_1[i].portIp;
        }
    }
    fromPortIp = fromPortIp.substring(0, fromPortIp.lastIndexOf("."));
    toPortIp = toPortIp.substring(0, toPortIp.lastIndexOf(".")); // 取得网段
    if (fromPortIp.match(toPortIp) != null) {
        $("#portErrorInfo_2").attr("hidden", "hidden");
    } else {
        $("#portErrorInfo_2").removeAttr("hidden");
    }
});

/**
 * 查询已有链路的地址
 */
// function getExitLinkIps() {
//     $.ajax({
//         url: '/NetworkSimulation/getLinkList',
//         data: {
//             s_id : $.getUrlParam("scenarioId")
//         },
//         type: 'post',
//         dataType: 'json',
//         async: false,
//         success: function (data) {
//             var objs = jQuery.parseJSON(data);
//             for (var i = 0; i < objs.length; i++){
//                 //存已有ip地址的前三位
//                 link_ips[i] = objs[i].fromNodeIP.substring(0,objs[i].fromNodeIP.lastIndexOf("."));
//             }
//             console.log("已读取存在的网段");
//         },
//         error: function () {
//
//         }
//     });
// }

/**
 * 判断输入的ip与已存在的ip不属于同网段
 */
// $("#fromNodeIP").blur(function () {
//     var ip = $("#fromNodeIP").val();
//     if (isValidIP(ip)) {
//         //再判断是否重复
//         for (var i = 0; i < link_ips.length; i++){
//             if (ip.match(link_ips[i]) != null){
//                 //匹配到不空，说明有重复的网段，显示出错误信息
//                 $("#fromNodeIpErrorInfo").removeAttr("hidden");
//                 $("#fromNodeIpErrorInfo").html("输入的地址网段与已有的重复，请重新输入！");
//                 $("#fromNodeIP").val("");
//                 return false;
//             }
//         }
//         //匹配到都是null，说明没有重复的网段
//         $("#fromNodeIpErrorInfo").attr("hidden", "hidden");
//         return true;
//     } else {
//         $("#fromNodeIpErrorInfo").removeAttr("hidden");
//         $("#fromNodeIpErrorInfo").html("输入的ip地址不合法，请重新输入！");
//         $("#fromNodeIP").val("");
//         return false;
//     }
// });
// $("#toNodeIP").blur(function () {
//     var ip = $("#toNodeIP").val();
//     if (isValidIP(ip)) {
//         //再判断是否重复
//         for (var i = 0; i < link_ips.length; i++){
//             if (ip.match(link_ips[i]) != null){
//                 $("#toNodeIpErrorInfo").removeAttr("hidden");
//                 $("#toNodeIpErrorInfo").html("输入的地址网段与已有的重复，请重新输入！");
//                 $("#toNodeIP").val("");
//                 return false;
//             }
//         }
//         $("#toNodeIpErrorInfo").attr("hidden", "hidden");
//         return true;
//     } else {
//         $("#toNodeIpErrorInfo").removeAttr("hidden");
//         $("#toNodeIpErrorInfo").html("输入的ip地址不合法，请重新输入！");
//         $("#toNodeIP").val("");
//         return false;
//     }
// });

// $("#fromNodeIP_0").blur(function () {
//     var ip = $("#fromNodeIP_0").val();
//     if (isValidIP(ip)) {
//         //再判断是否重复
//         for (var i = 0; i < link_ips.length; i++){
//             if (ip.match(link_ips[i]) != null){
//                 //匹配到不空，说明有重复的网段，显示出错误信息
//                 $("#fromNodeIpErrorInfo_0").removeAttr("hidden");
//                 $("#fromNodeIpErrorInfo_0").html("输入的地址网段与已有的重复，请重新输入！");
//                 $("#fromNodeIP_0").val("");
//                 return false;
//             }
//         }
//         //匹配到都是null，说明没有重复的网段
//         $("#fromNodeIpErrorInfo_0").attr("hidden", "hidden");
//         return true;
//     } else {
//         $("#fromNodeIpErrorInfo_0").removeAttr("hidden");
//         $("#fromNodeIpErrorInfo_0").html("输入的ip地址不合法，请重新输入！");
//         $("#fromNodeIP_0").val("");
//         return false;
//     }
// });
// $("#toNodeIP_0").blur(function () {
//     var ip = $("#toNodeIP_0").val();
//     if (isValidIP(ip)) {
//         //再判断是否重复
//         for (var i = 0; i < link_ips.length; i++){
//             if (ip.match(link_ips[i]) != null){
//                 $("#toNodeIpErrorInfo_0").removeAttr("hidden");
//                 $("#toNodeIpErrorInfo_0").html("输入的地址网段与已有的重复，请重新输入！");
//                 $("#toNodeIP_0").val("");
//                 return false;
//             }
//         }
//         $("#toNodeIpErrorInfo_0").attr("hidden", "hidden");
//         return true;
//     } else {
//         $("#toNodeIpErrorInfo_0").removeAttr("hidden");
//         $("#toNodeIpErrorInfo_0").html("输入的ip地址不合法，请重新输入！");
//         $("#toNodeIP_0").val("");
//         return false;
//     }
// });

// $("#fromNodeIP_1").blur(function () {
//     var ip = $("#fromNodeIP_1").val();
//     if (isValidIP(ip)) {
//         //再判断是否重复
//         for (var i = 0; i < link_ips.length; i++){
//             if (ip.match(link_ips[i]) != null){
//                 //匹配到不空，说明有重复的网段，显示出错误信息
//                 $("#fromNodeIpErrorInfo_1").removeAttr("hidden");
//                 $("#fromNodeIpErrorInfo_1").html("输入的地址网段与已有的重复，请重新输入！");
//                 $("#fromNodeIP_1").val("");
//                 return false;
//             }
//         }
//         //匹配到都是null，说明没有重复的网段
//         $("#fromNodeIpErrorInfo_1").attr("hidden", "hidden");
//         return true;
//     } else {
//         $("#fromNodeIpErrorInfo_1").removeAttr("hidden");
//         $("#fromNodeIpErrorInfo_1").html("输入的ip地址不合法，请重新输入！");
//         $("#fromNodeIP_1").val("");
//         return false;
//     }
// });
// $("#toNodeIP_1").blur(function () {
//     var ip = $("#toNodeIP_1").val();
//     if (isValidIP(ip)) {
//         //再判断是否重复
//         for (var i = 0; i < link_ips.length; i++){
//             if (ip.match(link_ips[i]) != null){
//                 $("#toNodeIpErrorInfo_1").removeAttr("hidden");
//                 $("#toNodeIpErrorInfo_1").html("输入的地址网段与已有的重复，请重新输入！");
//                 $("#toNodeIP_1").val("");
//                 return false;
//             }
//         }
//         $("#toNodeIpErrorInfo_1").attr("hidden", "hidden");
//         return true;
//     } else {
//         $("#toNodeIpErrorInfo_1").removeAttr("hidden");
//         $("#toNodeIpErrorInfo_1").html("输入的ip地址不合法，请重新输入！");
//         $("#toNodeIP_1").val("");
//         return false;
//     }
// });

// $("#fromNodeIP_2").blur(function () {
//     var ip = $("#fromNodeIP_2").val();
//     if (isValidIP(ip)) {
//         //再判断是否重复
//         for (var i = 0; i < link_ips.length; i++){
//             if (ip.match(link_ips[i]) != null){
//                 //匹配到不空，说明有重复的网段，显示出错误信息
//                 $("#fromNodeIpErrorInfo_2").removeAttr("hidden");
//                 $("#fromNodeIpErrorInfo_2").html("输入的地址网段与已有的重复，请重新输入！");
//                 $("#fromNodeIP_2").val("");
//                 return false;
//             }
//         }
//         //匹配到都是null，说明没有重复的网段
//         $("#fromNodeIpErrorInfo_2").attr("hidden", "hidden");
//         return true;
//     } else {
//         $("#fromNodeIpErrorInfo_2").removeAttr("hidden");
//         $("#fromNodeIpErrorInfo_2").html("输入的ip地址不合法，请重新输入！");
//         $("#fromNodeIP_2").val("");
//         return false;
//     }
// });
// $("#toNodeIP_2").blur(function () {
//     var ip = $("#toNodeIP_2").val();
//     if (isValidIP(ip)) {
//         //再判断是否重复
//         for (var i = 0; i < link_ips.length; i++){
//             if (ip.match(link_ips[i]) != null){
//                 $("#toNodeIpErrorInfo_2").removeAttr("hidden");
//                 $("#toNodeIpErrorInfo_2").html("输入的地址网段与已有的重复，请重新输入！");
//                 $("#toNodeIP_2").val("");
//                 return false;
//             }
//         }
//         $("#toNodeIpErrorInfo_2").attr("hidden", "hidden");
//         return true;
//     } else {
//         $("#toNodeIpErrorInfo_2").removeAttr("hidden");
//         $("#toNodeIpErrorInfo_2").html("输入的ip地址不合法，请重新输入！");
//         $("#toNodeIP_2").val("");
//         return false;
//     }
// });

/**
 * 简单节点之间的链路初始化from端口下拉框
 */
var fromPortObjs;
function initFromPortList(data) {
    fromPortObjs = jQuery.parseJSON(data);
    var areaCont = "";
    for (var i = 0; i < fromPortObjs.length; i++){
        if (fromPortObjs[i].portStatus == 0 || fromPortObjs[i].isMultiplexing == 1){ // 未被占用或者是一对多的端口
            areaCont += '<option value="' + fromPortObjs[i].pt_id + '">' + fromPortObjs[i].portName + '(' + fromPortObjs[i].portIp + ')' + '</option>';
        } else {
            areaCont += '<option value="' + fromPortObjs[i].pt_id + '" disabled="disabled">' + fromPortObjs[i].portName + '(已占用)' + '</option>';
        }
    }
    $("#fromPort").html(areaCont);
}

/**
 * 简单节点之间的链路初始化to端口下拉框
 */
var toPortObjs;
function initToPortList(data) {
    toPortObjs = jQuery.parseJSON(data);
    var areaCont = "";
    for (var i = 0; i < toPortObjs.length; i++){
        if (toPortObjs[i].portStatus == 0 || toPortObjs[i].isMultiplexing == 1){
            areaCont += '<option value="' + toPortObjs[i].pt_id + '">' + toPortObjs[i].portName + '(' + toPortObjs[i].portIp + ')' + '</option>';
        } else {
            areaCont += '<option value="' + toPortObjs[i].pt_id + '" disabled="disabled">' + toPortObjs[i].portName + '(已占用)' + '</option>';
        }
    }
    $("#toPort").html(areaCont);
}

/**
 * 判断选择的两个端口ip是否在同一网段
 */
$("#toPort, #fromPort").blur(function () {
    var fromPortId = $("#fromPort").val();
    var toPortId = $("#toPort").val();
    var fromPortIp;
    var toPortIp;
    for (var i = 0; i < fromPortObjs.length; i++) {
        if (fromPortId == fromPortObjs[i].pt_id) {
            fromPortIp = fromPortObjs[i].portIp;
        }
    }
    for (var i = 0; i < toPortObjs.length; i++) {
        if (toPortId == toPortObjs[i].pt_id) {
            toPortIp = toPortObjs[i].portIp;
        }
    }
    fromPortIp = fromPortIp.substring(0, fromPortIp.lastIndexOf("."));
    toPortIp = toPortIp.substring(0, toPortIp.lastIndexOf(".")); // 取得网段
    if (fromPortIp.match(toPortIp) != null) { // 匹配上了，是同一网段。
        $("#portErrorInfo").attr("hidden", "hidden"); // 不显示错误信息
    } else { // 不是同一网段
        $("#portErrorInfo").removeAttr("hidden"); // 显示错误信息
    }
});

/**
 * 初始化链路模板选择框
 */
var linkTemplateObjs;
function initLinkTemplate(data) {
    linkTemplateObjs = jQuery.parseJSON(data);
    var html = '';
    for (var i = 0; i < linkTemplateObjs.length; i++) {
        html += '<option value="' + linkTemplateObjs[i].linkName + '">' + '（模板）' + linkTemplateObjs[i].linkName + '</option>';
    }
    $("#linkTemplate").html(html);
    $("#linkTemplate").val(''); // 初始化为空
}

/**
 * 选中模板后自动填入部分参数
 */
$("#linkTemplate").change(function () {
    var linkTemplateName = $("#linkTemplate").val();
    for (var i = 0; i < linkTemplateObjs.length; i++) {
        if (linkTemplateName == linkTemplateObjs[i].linkName) { // 找到选中的链路模板对象
            $("#linkType").val(linkTemplateObjs[i].linkType);
            $("#channelNoise").val(linkTemplateObjs[i].linkNoise);
            $("#channelType").val(linkTemplateObjs[i].channelModel);
            $("#linkLength").val(linkTemplateObjs[i].linkLength);
        }
    }
});

//判断输入管理ip的合法性
// $("#manageIP").blur(function () {
//     var ip = $("#manageIP").val();
//     //先检查合法性
//     var reSpaceCheck = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
//     if (reSpaceCheck.test(ip)) {
//         ip.match(reSpaceCheck);
//         if ( RegExp.$1 == 192 && RegExp.$2 == 168 && ( RegExp.$3 == 10 || RegExp.$3 == 5 )
//             && RegExp.$4 <= 255 && RegExp.$4 > 0) {
//             //再检查是否有重复
//             for (var i = 0; i < node_ips.length; i++){
//                 if (ip == node_ips[i]){
//                     $("#nodeIpErrorInfo").removeAttr("hidden");
//                     $("#nodeIpErrorInfo").html("输入的ip又已有节点的管理ip重复，请重新输入！");
//                     //清空输入框的值
//                     $("#manageIP").val("");
//                     return false;
//                 }
//             }
//             $("#nodeIpErrorInfo").attr("hidden", "hidden");
//             return true;
//         }else {
//             $("#nodeIpErrorInfo").removeAttr("hidden");
//             $("#nodeIpErrorInfo").html("输入的网段不合法，请重新输入！");
//             //清空输入框的值
//             $("#manageIP").val("");
//             return false;
//         }
//     } else {
//         $("#nodeIpErrorInfo").removeAttr("hidden");
//         $("#nodeIpErrorInfo").html("输入的ip地址不合法，请重新输入！");
//         //清空输入框的值
//         $("#manageIP").val("");
//         return false;
//     }
// });