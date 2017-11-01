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
                    createNode(objs[i].nodeName, objs[i].x, objs[i].y, objs[i].iconUrl);
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
// var link_ips = [];
scene.mouseup(function (e) {
    if (e.target != null && e.target instanceof JTopo.Node && flag != 0) {
        if (beginNode == null) {
            beginNode = e.target;
            scene.add(link1);
            tempNodeA.setLocation(e.x, e.y);
            tempNodeZ.setLocation(e.x, e.y);
        } else if (beginNode !== e.target) {
            endLastNode = e.target;
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
            //查询已有链路的地址
            // $.ajax({
            //     url: '/NetworkSimulation/getLinkList',
            //     data: {
            //         s_id : $.getUrlParam("scenarioId")
            //     },
            //     type: 'post',
            //     dataType: 'json',
            //     async: false,
            //     success: function (data) {
            //         var objs = jQuery.parseJSON(data);
            //         for (var i = 0; i < objs.length; i++){
            //             //存已有ip地址的前三位
            //             link_ips[i] = objs[i].fromNodeIP.substring(0,objs[i].fromNodeIP.lastIndexOf("."));
            //         }
            //         console.log("已读取存在的网段");
            //     },
            //     error: function () {
            //
            //     }
            // });
        } else {
            beginNode = null;
        }
    } else {
        scene.remove(link1);
    }
});

// 判断输入的ip与已存在的ip不属于同网段
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
        // node_ips = [];
        //首先弹出模态框
        $("#myModal").modal();
        //查询已有节点的信息，确保输入的管理ip不会重复
        // $.ajax({
        //     url: '/NetworkSimulation/selectNodeList',
        //     data: {
        //         s_id : $.getUrlParam("scenarioId")
        //     },
        //     type: 'post',
        //     dataType: 'json',
        //     async: false,
        //     success: function (data) {
        //         var objs = jQuery.parseJSON(data);
        //         for (var i = 0; i < objs.length; i++){
        //             node_ips[i] = objs[i].manageIp;
        //         }
        //     },
        //     error: function () {
        //
        //     }
        // });
    }
});

// 判断输入管理ip的合法性
// $("#manageIP").blur(function () {
//     var ip = $("#manageIP").val();
//     //先检查合法性
//     var reSpaceCheck = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
//     if (reSpaceCheck.test(ip)) {
//         ip.match(reSpaceCheck);
//         if (RegExp.$1 == 192 && RegExp.$2 == 168 && RegExp.$3 == 10
//             && RegExp.$4<=255 && RegExp.$4>=0) {
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
    $('#myModal').modal('hide');
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
                createNode($("#nodeName").val(), uiOut.offset.left - document.getElementById("slider").offsetWidth, uiOut.offset.top - 102, iconUrl);
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
    $.ajax({
        url: '/NetworkSimulation/addInnerLink',
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
            scenario_id : $.getUrlParam("scenarioId"),
            complexNodeName : $.getUrlParam("nodeName")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            $.alert(msg);
            if (msg == "创建成功") {
                if ($("#linkType").val() == 0) { // 有线链路
                    newLink(beginNode, endLastNode, $("#linkName").val(), "0,0,255");
                } else if ($("#linkType").val() == 1) { // 无线链路
                    newLink(beginNode, endLastNode, $("#linkName").val(), "0,0,0");
                }
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
    if (elements[0] == undefined || elements[0] instanceof JTopo.Link || elements[0].fontColor == "255,0,0"){
        $.alert("请选中简单节点后在进行下一步操作");
    } else {
        window.open(encodeURI("nodeEdit.html?nodeName="+ elements[0].text + "&scenarioId=" + $.getUrlParam("scenarioId")));
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