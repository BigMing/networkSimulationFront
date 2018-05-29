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
    canvas.height = $(document).height() - 100;
    $("#inName").html($.getUrlParam("nodeName") + " 节点内部编辑器"); // 改变左上角的文字
};

$("#slider").height($(document).height() - 50);

var stage = new JTopo.Stage(canvas); // 创建一个舞台对象
var scene = new JTopo.Scene(stage); // 创建一个场景对象
stage.eagleEye.visible = true; // 显示鹰眼

$('#zoomOutButton').click(function(){
    stage.zoomIn();
});
$('#zoomInButton').click(function(){
    stage.zoomOut();
});

var complexNodeId; // 获得复杂节点id并保存
function getComplexNodeId() {
    $.ajax({
        url: '/NetworkSimulation/getComplexNodeId',
        data: {
            s_id : $.getUrlParam("scenarioId"),
            complexNodeName : $.getUrlParam("nodeName")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (data) {
            complexNodeId = data;
            console.log("已经取得复杂节点id");
        },
        error: function () {

        }
    });
}

/**
 * 获取内部链路对象的列表并画出来
 */
function initLinkOnCanvas() {
    $.ajax({
        url: '/NetworkSimulation/getInnerLinkList',
        data: {
            cn_id : complexNodeId
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
                    //对每个link对象找到fromNode和toNode
                    for (var j = 0; j < elements.length; j++) {
                        if (objs[i].logicalFromNodeName == elements[j].text) {
                            fromNode = elements[j];
                        }
                        if (objs[i].logicalToNodeName == elements[j].text) {
                            toNode = elements[j];
                        }
                    }
                    // 画出链路
                    if (objs[i].linkStatus == 1 && objs[i].cn_id == complexNodeId) {
                        newLink(fromNode, toNode, objs[i].linkName, "255,0,0"); // 断开的链路，红色
                    }
                    if (objs[i].linkStatus == 0 && objs[i].cn_id == complexNodeId) {
                        newLink(fromNode, toNode, objs[i].linkName, "0,0,255"); // 接通的链路，蓝色
                    }
                }
            }, 1000);
        },
        error: function () {

        }
    });
    // 获取所有L2链路并画出
    $.ajax({
        url: '/NetworkSimulation/getL2LinkList',
        data: {
            s_id: $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (data) {
        	console.log(data);
            setTimeout(function () { // 1.5秒之后执行
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
                    if (fromNode == undefined || toNode == undefined) {
						continue;
					} else {
						newLink(fromNode, toNode, objs[i].linkName + "("
								+ fromNode.text + "->" + toNode.text + ")",
								"128,0,128"); // 直接画出紫色链路
					}
                    fromNode = undefined;
                    toNode = undefined;
                }
            }, 1500);
        },
        error: function () {

        }
    });
}

$(document).ready(function () {
    getComplexNodeId();
    // 画出已有内部节点，获取内部节点的对象列表
    $.ajax({
        url: '/NetworkSimulation/selectInnerNodeList',
        data: {
            s_id : $.getUrlParam("scenarioId"),
            complexNodeName : $.getUrlParam("nodeName")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (data) {
            var objs = jQuery.parseJSON(data);
            for (var i = 0; i < objs.length; i++) {
                if (objs[i].cn_id == complexNodeId) {
                	if (objs[i].nodeType == 2) {
                		createSwitchNode(objs[i].nodeName, objs[i].x, objs[i].y, objs[i].iconUrl);
                	} else {                		
                		createNode(objs[i].nodeName, objs[i].x, objs[i].y, objs[i].iconUrl);
                	}
                }
            }
        },
        error: function () {

        }
    });
    setTimeout("initLinkOnCanvas()", 500); // 画出链路
});

/**
 * 画布中的选中元素名称显示
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
    }else {
        for (var i = 0; i < elements.length; i++) {
            if (elements[i] instanceof JTopo.Node) {
                $.alert("删除一个节点" + elements[i].text);
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
            if (elements[i] instanceof JTopo.Link) {
                console.log(elements[i].strokeColor);
                if (elements[i].strokeColor == "255,0,0") { // 如果是断开的链路
                    $.alert("无法删除断开的链路！");
                } else {
                    $.alert("删除一个链路" + elements[i].text);
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
    // 10秒后刷新页面
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

var link01 = document.getElementById("link01");// 按钮点击事件，添加
var link04 = document.getElementById("link04"); // 停止添加

var flag = 0; // 1,2,3表示三种链路，4表示停止添加链路，用于添加链路类型时候的判断

$("#addlink01").click(function () {
    flag = 1;
    link01.style.color = "red";
    link04.style.color = "#333";
});

$("#addlink04").click(function () {
    flag = 0;
    link01.style.color = "#333";
    link04.style.color = "red";
    beginNode = null;
});

/**
 * 弹出链路模态框
 */
scene.mouseup(function (e) {
    if (e.target != null && e.target instanceof JTopo.Node && flag != 0) {
        if (beginNode == null) {
            beginNode = e.target;
            scene.add(link1);
            tempNodeA.setLocation(e.x, e.y);
            tempNodeZ.setLocation(e.x, e.y);
        } else if (beginNode !== e.target) {
            endLastNode = e.target;
            $("#linkModal").modal(); // 弹出模态框
            //发送ajax查询from端口
            if (beginNode.fontColor == "0,1,0") { // 起始节点是交换机，设置vlan端口
                var html = "";
                for (var i = 0; i < 3; i++) { // 设置vlan_0 - vlan_2
                    html += '<option value="' + i + '">vlan_' + i + '</option>';
                }
                console.log(html);
                $("#fromPort").html(html);
            } else { // 起始节点不是交换机，需要查询端口
                $.ajax({ // 发送ajax查询from端口
                    url: '/NetworkSimulation/getPortBynodeName',
                    data: {
                        nodeName: beginNode.text,
                        s_id: $.getUrlParam("scenarioId")
                    },
                    type: 'post',
                    dataType: 'json',
                    async: true,
                    success: function (msg) {
                        initFromPortList(msg);
                    },
                    error: function () {

                    }
                });
            }
            if (endLastNode.fontColor == "0,1,0") { // 终止节点是交换机，设置vlan端口
                var html = "";
                for (var i = 0; i < 3; i++) { // 设置vlan_0 - vlan_2
                    html += '<option value="' + i + '">vlan_' + i + '</option>';
                }
                console.log(html);
                $("#toPort").html(html);
            } else { // 查询终止节点to端口
                $.ajax({ // 发送ajax查询to端口
                    url: '/NetworkSimulation/getPortBynodeName',
                    data: {
                        nodeName: endLastNode.text,
                        s_id: $.getUrlParam("scenarioId")
                    },
                    type: 'post',
                    dataType: 'json',
                    async: true,
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

var fromPortObjs;
/**
 * 初始化from端口下拉框
 */
function initFromPortList(data) {
    fromPortObjs = jQuery.parseJSON(data);
    var areaCont = "";
    for (var i = 0; i < fromPortObjs.length; i++){
        if (fromPortObjs[i].portStatus == 0){
            areaCont += '<option value="' + fromPortObjs[i].pt_id + '">' + fromPortObjs[i].portName + '(' + fromPortObjs[i].portIp + ')' + '</option>';
        } else {
            areaCont += '<option value="' + fromPortObjs[i].pt_id + '" disabled="disabled">' + fromPortObjs[i].portName + '(已占用)' + '</option>';
        }
    }
    $("#fromPort").html(areaCont);
}

var toPortObjs;
/**
 * 初始化to端口下拉框
 */
function initToPortList(data) {
    toPortObjs = jQuery.parseJSON(data);
    var areaCont = "";
    for (var i = 0; i < toPortObjs.length; i++){
        if (toPortObjs[i].portStatus == 0){
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
    if (fromPortIp.match(toPortIp) != null) { // 有重复
        $("#portErrorInfo").removeAttr("hidden");
    } else { // 没有重复
        $("#portErrorInfo").attr("hidden", "hidden");
    }
});

scene.mousedown(function (e) {
    if (e.target == null || e.target === beginNode || e.target === link1) {
        scene.remove(link1);
    }
});
scene.mousemove(function (e) {
    tempNodeZ.setLocation(e.x, e.y);
});

/**
 * 创建节点函数
 */
function createNode(name, X, Y, pic) {
    var node = new JTopo.Node(name);
    node.setLocation(X, Y);
    node.fontColor = "0,0,0";
    node.setImage(pic, true);
    scene.add(node);
}

function createSwitchNode(name, X, Y, pic) { // 画出交换机类型的节点
    var node = new JTopo.Node(name);
    node.setLocation(X, Y);
    node.fontColor = "0,1,0";
    node.setImage(pic, true);
    scene.add(node);
}

/**
 * 创建连线函数
 */
function newLink(nodeA, nodeZ, text, color) {
    var link = new JTopo.Link(nodeA, nodeZ, text);
    link.fontColor = "0,0,0";
    link.lineWidth = 2; // 线宽
    //link.dashedPattern = dashedPattern; // 虚线
    link.bundleOffset = 50; // 折线拐角处的长度
    link.bundleGap = 20; // 线条之间的间隔
    link.textOffsetY = 3; // 文本偏移量（向下3个像素）
    link.strokeColor = color;
    // link.arrowsRadius = 10;
    scene.add(link);
    // return link;
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

var uiOut; // 全局数据-->用于传递变量-->将拖动的数据信息保存起来
// var node_ips = [];
$("#canvas").droppable({
    drop: function (event, ui) {
        uiOut = ui;//保存数据
        //首先弹出模态框
        $("#myModal").modal();
    }
});

var iconUrl;
/**
 * 内部节点模态框中的提交
 */
$("#addNode").click(function () {
    var getId = uiOut.draggable[0].id; // jquery获取图片，竟然要加一个[0]，这是什么鬼 (⊙o⊙)
    if (getId == "weixing1") {
        iconUrl = "img/switchOptical_01.png";
    } else if (getId == "weixing2") {
        iconUrl = "img/router_01.png";
    } else if (getId == "weixing3") {
        iconUrl = "img/5200_01.png";
    }
    // createNode($("#nodeName").val(), uiOut.offset.left - document.getElementById("slider").offsetWidth, uiOut.offset.top - 102, iconUrl);
    // $('#myModal').modal('hide');

    $.ajax({
        url: '/NetworkSimulation/addInnerNode',
        data: {
            nodeName : $("#nodeName").val(),
            manageIp : $("#manageIP").val(),
            nodeType : $("#nodeType").val(),
            hardwareArchitecture : $("#hardwareArchitecture").val(),
            operatingSystem : $("#operatingSystem").val(),
            flavorType : $("#nodeConfig").val(),
            imageName : $("#nodeImage").val(),
            x : uiOut.offset.left - document.getElementById("slider").offsetWidth,
            y : uiOut.offset.top - 102,
            s_id : $.getUrlParam("scenarioId"),
            iconUrl : iconUrl,
            complexNodeName : $.getUrlParam("nodeName")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            $.alert(msg);
            if (msg == "创建成功") {
                if ($("#nodeType").val() == 2) { // 是二层交换机节点
                    createSwitchNode($("#nodeName").val(), uiOut.offset.left - document.getElementById("slider").offsetWidth, uiOut.offset.top - 102, iconUrl);
                } else { // 不是二层交换机
                    createNode($("#nodeName").val(), uiOut.offset.left - document.getElementById("slider").offsetWidth, uiOut.offset.top - 102, iconUrl);
                }
                $('#myModal').modal('hide');
            }
        },
        error: function () {

        }
    });
});

/**
 * 内部链路模态框中请求的发送
 */
$("#addLink").click(function () {
    // newLink(beginNode, endLastNode, $("#linkName").val(), "0,0,255");
    // beginNode = null;
    // scene.remove(link1);
    // $('#linkModal').modal('hide');
    var linkType = 0;
    var fromIp;
    var toIp;
    if (beginNode.fontColor == "0,1,0" && endLastNode.fontColor == "0,1,0") { // 交换机到交换机
        linkType = 5;
    } else if (beginNode.fontColor == "0,1,0") { // 交换机到三层节点
        linkType = 6;
        for (var i = 0; i < toPortObjs.length; i++) {
            if (toPortObjs[i].pt_id == $("#toPort").val()) {
                toIp = toPortObjs[i].portIp;
            }
        }
    } else if (endLastNode.fontColor == "0,1,0") { // 三层到交换机
        linkType = 7;
        for (var i = 0; i < fromPortObjs.length; i++) {
            if (fromPortObjs[i].pt_id == $("#fromPort").val()) {
                fromIp = fromPortObjs[i].portIp;
            }
        }
    }
    $.ajax({
        url: '/NetworkSimulation/addInnerLink',
        data: {
            linkName : $("#linkName").val(),
            linkType : linkType,
            fromNodeIP : fromIp,
            toNodeIP : toIp,
            fromNodeName : beginNode.text,
            toNodeName : endLastNode.text,
            logicalFromNodeName : beginNode.text,
            logicalToNodeName : endLastNode.text,
            txPort_id : $("#fromPort").val(),
            rxPort_id : $("#toPort").val(),
            linkNoise : $("#channelNoise").val(),
            channelModel : $("#channelType").val(),
            linkLength : $("#linkLength").val(),
            scenario_id : $.getUrlParam("scenarioId"),
            complexNodeName : $.getUrlParam("nodeName"),
            onlyPort : $("#onlyPort").val()
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            $.alert(msg);
            if (msg == "创建成功") {
                newLink(beginNode, endLastNode, $("#linkName").val() + "(" + beginNode.text + "->" + endLastNode.text + ")", "0,0,255");
                beginNode = null;
                scene.remove(link1);
                $('#linkModal').modal('hide');
            }
        },
        error: function () {

        }
    });
});

/**
 * 打开控制台页面
 */
$("#openCli").click(function () {
    var elements = scene.selectedElements;
    if (elements[0] == undefined || elements[0] instanceof JTopo.Link || elements[0].fontColor == "255,0,0"){
        $.alert("请选中简单节点后在进行下一步操作");
    } else {
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
                window.open(encodeURI(msg));
            },
            error: function () {

            }
        });
    }
});

/**
 * 打开节点编辑器
 */
$("#editNode").click(function () {
    var elements = scene.selectedElements;
    if (elements[0] instanceof JTopo.Node && elements[0].fontColor == "0,0,0") { // 选中的是简单三层节点
        window.open(encodeURI("nodeEdit.html?nodeName=" + elements[0].text + "&scenarioId=" + $.getUrlParam("scenarioId")));
    } else if (elements[0] instanceof JTopo.Node && elements[0].fontColor == "255,0,0") { // 选中的是复杂节点
        window.open(encodeURI("complexNodeEdit.html?complexNodeName=" + elements[0].text + "&scenarioId=" + $.getUrlParam("scenarioId")));
    } else if (elements[0] instanceof JTopo.Link) { // 选中的是链路
        window.open(encodeURI("linkEdit.html?linkName=" + elements[0].text + "&scenarioId=" + $.getUrlParam("scenarioId")));
    } else if (elements[0] instanceof JTopo.Node && elements[0].fontColor == "0,1,0") { // 选中的是二层节点
        window.open(encodeURI("nodeEdit.html?nodeName=" + elements[0].text + "&scenarioId=" + $.getUrlParam("scenarioId") + "&isL2node=1"));
    } else {
        $.alert("不支持的操作！");
    }
});

/**
 * 退出页面
 */
window.onbeforeunload = onbeforeunload_handler;
window.onunload = onunload_handler;
function onbeforeunload_handler() {
    var warning = "确认退出?";
    return warning;
}

function onunload_handler() {
    var warning = "谢谢光临";
    alert(warning);
}

/**
 * 提交内部场景编辑
 */
$("#submit").click(function () {
    opener.location.reload();
    setTimeout(function () {
        window.close();
    }, 1000);
});