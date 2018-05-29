/**
 * 新建链路——打开模态框，鼠标点击后
 */
scene.mouseup(function (e) {
    if (e.target != null && e.target instanceof JTopo.Node) { // 拖动了节点
        $.ajax({ // 更新节点坐标
            url: '/NetworkSimulation/updateNodeLocation',
            data: {
                s_id: $.getUrlParam("scenarioId"),
                nodeName : e.target.text,
                x : e.target.x,
                y : e.target.y
            },
            type: 'post',
            dataType: 'json',
            async: true,
            success: function (msg) {
                console.log(msg);
            },
            error: function () {

            }
        });
    }
    if (e.target != null && e.target instanceof JTopo.Node && flag != 0) { // 点击了画布上的节点，且flag！=0
        if (beginNode == null) { // 还未设置起始节点的话
            beginNode = e.target; // 设置起始节点
            scene.add(link1);
            tempNodeA.setLocation(e.x, e.y);
            tempNodeZ.setLocation(e.x, e.y);
        } else if (beginNode !== e.target) { // 设置了起始节点，点击了其他节点的话
            endLastNode = e.target; // 此时设置终止节点，然后弹出链路模态框
            // 判断选择的节点中是否有复杂节点，弹出相应的模态框
            if (beginNode.fontColor == "255,0,0" && endLastNode.fontColor == "255,0,0") { // 复杂——复杂
                $("#complexNodeLinkModal_0").modal();
                // 发送ajax查询fromNode的内部节点对象列表的json
                $.ajax({
                    url: '/NetworkSimulation/selectInnerNodeList',
                    data: {
                        complexNodeName: beginNode.text,
                        s_id: $.getUrlParam("scenarioId")
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
                // 发送ajax查询toNode的内部节点对象列表的json
                $.ajax({
                    url: '/NetworkSimulation/selectInnerNodeList',
                    data: {
                        complexNodeName: endLastNode.text,
                        s_id: $.getUrlParam("scenarioId")
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
            } else if (beginNode.fontColor == "255,0,0") { // 复杂——简单
                $("#complexNodeLinkModal_2").modal();
                // 发送ajax查询fromNode的内部节点对象列表的json
                $.ajax({
                    url: '/NetworkSimulation/selectInnerNodeList',
                    data: {
                        complexNodeName: beginNode.text,
                        s_id: $.getUrlParam("scenarioId")
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
                if (endLastNode.fontColor == "0,1,0") { // 终止节点是交换机，设置vlan端口
                    var html = "";
                    for (var i = 0; i < 3; i++) { // 设置vlan_0 - vlan_2
                        html += '<option value="' + i + '">vlan_' + i + '</option>';
                    }
                    console.log(html);
                    $("#toPort_2").html(html);
                } else {
                    $.ajax({ // 发送ajax查询to端口
                        url: '/NetworkSimulation/getPortBynodeName',
                        data: {
                            nodeName: endLastNode.text,
                            s_id: $.getUrlParam("scenarioId")
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
                }
            } else if (endLastNode.fontColor == "255,0,0") { // 简单——复杂
                $("#complexNodeLinkModal_1").modal();
                if (beginNode.fontColor == "0,1,0") { // 起始节点是交换机，设置vlan端口
                    var html = "";
                    for (var i = 0; i < 3; i++) { // 设置vlan_0 - vlan_2
                        html += '<option value="' + i + '">vlan_' + i + '</option>';
                    }
                    console.log(html);
                    $("#fromPort_1").html(html);
                } else {
                    $.ajax({ // 发送ajax查询from端口
                        url: '/NetworkSimulation/getPortBynodeName',
                        data: {
                            nodeName: beginNode.text,
                            s_id: $.getUrlParam("scenarioId")
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
                }
                // 发送ajax查询toNode的内部节点对象列表的json
                $.ajax({
                    url: '/NetworkSimulation/selectInnerNodeList',
                    data: {
                        complexNodeName: endLastNode.text,
                        s_id: $.getUrlParam("scenarioId")
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
            } else { // 简单——简单
                $("#linkModal").modal(); // 弹出模态框
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
                $.ajax({ // 发送ajax查询链路模板，要返回链路list的json
                    url: '/NetworkSimulation/getLinkTemplate',
                    data: {},
                    type: 'post',
                    dataType: 'json',
                    async: true,
                    success: function (msg) {
                        console.log(msg);
                        initLinkTemplate(msg);
                    },
                    error: function () {

                    }
                });
            }
        } else {
            beginNode = null;
        }
    } else { // 点选的不是节点
        scene.remove(link1);
    }
});

/**
 * 鼠标点下时
 */
scene.mousedown(function (e) {
    if (e.target == null || e.target === beginNode || e.target === link1) {
        scene.remove(link1);
    }
});

/**
 * 鼠标在画布移动的过程中
 */
scene.mousemove(function (e) {
    tempNodeZ.setLocation(e.x, e.y);
});

/**
 * 创建节点函数，用字体的颜色来区分节点类型（星际节点，地面节点，交换机节点）
 */
function createNode(name, X, Y, pic) { // 星际节点
    var node = new JTopo.Node(name);
    node.setLocation(X, Y);
    node.fontColor = "0,0,0";
    node.setImage(pic, true);
    scene.add(node);
}

function createRealNode(name, X, Y, pic) { // 星际节点
    var node = new JTopo.Node(name);
    node.setLocation(X, Y);
    node.fontColor = "0,0,2";
    node.setImage(pic, true);
    scene.add(node);
}

function createNode1(name, X, Y, pic) { // 地面节点
    var node = new JTopo.Node(name);
    node.setLocation(X, Y);
    node.fontColor = "0,0,1";
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

function createComplexNode(name, X, Y, pic) { // 星际复杂节点
    var node = new JTopo.Node(name);
    node.setLocation(X, Y);
    node.fontColor = "255,0,0";
    node.setImage(pic, true);
    scene.add(node);
}

function createComplexNode1(name, X, Y, pic) { // 地面复杂节点
    var node = new JTopo.Node(name);
    node.setLocation(X, Y);
    node.fontColor = "255,0,1";
    node.setImage(pic, true);
    scene.add(node);
}

/**
 * 创建链路函数
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
    // link.arrowsRadius = 10; // 箭头大小
    scene.add(link);
    // return link;
}

/**
 * 侧边的节点图标拖拽到画布区域
 */
$("#weixing1").draggable({ // 简单节点
    helper: "clone"
});
$("#weixing2").draggable({ // 复杂节点
    helper: "clone"
});
$("#weixing3").draggable({ // 实物节点
    helper: "clone"
});

var uiOut;// 全局数据-->用于传递变量-->将拖动的数据信息保存起来
// var node_ips = []; // 保存已有的管理ip
/**
 * 新建节点——弹出模态框，将拖拽的图标到画布区域放下时
 */
$("#canvas").droppable({
    drop: function (event, ui) {
        uiOut = ui; // 保存数据
        var getId = uiOut.draggable[0].id; // 此id即是html上元素的id
        // node_ips = [];
        if (getId == "weixing1") { // 如果拖拽的是简单节点
            $("#myModal").modal();
        }
        if (getId == "weixing2") { // 如果拖拽的是复杂节点，弹出复杂节点模态框
            $("#complexNodeModal").modal();
        }
        if (getId == "weixing3") { // 实物节点
            $("#realNodeModal").modal();
        }
    }
});

/**
 * 选择图标预览
 */
$("#iconUrl").change(function () {
    $("#iconUrl_0").attr('src', $("#iconUrl").val());
});

/**
 * 创建节点模态框的提交
 */
$("#addNode").click(function () {
    // var iconUrl = $("input[name='optionsRadiosinline0']:checked").val(); // 选择的图标类型
    var iconUrl = $("#iconUrl").val();

    // if (iconUrl == "img/xinguanzhan01.png" || iconUrl == "img/cheliang_01.jpg" || iconUrl == "img/shouchi_01.png") { // 如果是地面节点
    //     createNode1($("#nodeName").val(), uiOut.offset.left - document.getElementById("slider_1").offsetWidth, uiOut.offset.top - 102, iconUrl);
    // } else { // 如果是星际节点
    //     createNode($("#nodeName").val(), uiOut.offset.left - document.getElementById("slider_1").offsetWidth, uiOut.offset.top - 102, iconUrl);
    // }
    // $('#myModal').modal('hide');

    if ($("#nodeType").val() == 2 || $("#nodeType").val() == 3) { // 设置为存入交换机的图标
        iconUrl = "img/switchOptical_01.png";
    }

    $.ajax({ // 发送创建节点的请求给后台
        url: '/NetworkSimulation/addNode',
        data: {
            nodeName: $("#nodeName").val(),
            manageIp: $("#manageIP").val(),
            nodeType: $("#nodeType").val(),
            hardwareArchitecture: $("#hardwareArchitecture").val(),
            operatingSystem: $("#operatingSystem").val(),
            flavorType: $("#nodeConfig").val(),
            imageName: $("#nodeImage").val(),
            x: uiOut.offset.left - document.getElementById("slider_1").offsetWidth,
            y: uiOut.offset.top - 102,
            s_id: $.getUrlParam("scenarioId"),
            iconUrl: iconUrl
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            $.alert(msg);
            if (msg == "创建成功") {
                if ($("#nodeType").val() == 2 || $("#nodeType").val() == 3) { // 是二层交换机节点
                    createSwitchNode($("#nodeName").val(), uiOut.offset.left - document.getElementById("slider_1").offsetWidth, uiOut.offset.top - 102, "img/switchOptical_01.png");
                } else if (iconUrl == "img/xinguanzhan01.png" || iconUrl == "img/cheliang_01.jpg" || iconUrl == "img/shouchi_01.png") { // 如果是地面节点且不是交换机节点
                    createNode1($("#nodeName").val(), uiOut.offset.left - document.getElementById("slider_1").offsetWidth, uiOut.offset.top - 102, iconUrl);
                } else { // 如果是星际节点且不是交换机节点
                    createNode($("#nodeName").val(), uiOut.offset.left - document.getElementById("slider_1").offsetWidth, uiOut.offset.top - 102, iconUrl);
                }
                $('#myModal').modal('hide');
            }
        },
        error: function () {

        }
    });
});

/**
 * 创建实物节点提交
 */
$("#addRealNode").click(function () {
    $.ajax({
        url: '/NetworkSimulation/addRealNode',
        data: {
            nodeName: $("#realNodeName").val(),
            manageIp: $("#manageIP").val(),
            realNodeIp : $("#realNodeIP"),
            nodeType: 20,
            hardwareArchitecture: $("#hardwareArchitecture").val(),
            operatingSystem: $("#operatingSystem").val(),
            flavorType: $("#nodeConfig").val(),
            imageName: $("#nodeImage").val(),
            x: uiOut.offset.left - document.getElementById("slider_1").offsetWidth,
            y: uiOut.offset.top - 102,
            s_id: $.getUrlParam("scenarioId"),
            iconUrl: "img/5200_01.png"
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            $.alert(msg);
            if (msg == "创建成功") {
                createRealNode($("#realNodeName").val(), uiOut.offset.left - document.getElementById("slider_1").offsetWidth, uiOut.offset.top - 102, "img/5200_01.png");
                $('#myModal').modal('hide');
            }
        },
        error: function () {

        }
    });
});

/**
 * 选择复杂节点图标预览
 */
$("#complexIconUrl").change(function () {
    $("#complexIconUrl_0").attr('src', $("#complexIconUrl_0").val());
});

/**
 * 新建复杂节点提交
 */
$("#addComplexNode").click(function () {
    // var iconUrl = $("input[name='optionsRadiosinline1']:checked").val();
    var iconUrl = $("#complexIconUrl").val();

    // if (iconUrl == "img/xinguanzhan01.png" || iconUrl == "img/cheliang_01.jpg" || iconUrl == "img/shouchi_01.png") { // 如果是地面节点
    //     createComplexNode1($("#complexNodeName").val(), uiOut.offset.left - document.getElementById("slider_1").offsetWidth, uiOut.offset.top - 102, iconUrl);
    // } else { // 如果是星际节点
    //     createComplexNode($("#complexNodeName").val(), uiOut.offset.left - document.getElementById("slider_1").offsetWidth, uiOut.offset.top - 102, iconUrl);
    // }
    // $('#complexNodeModal').modal('hide');

    $.ajax({
        url: '/NetworkSimulation/addComplexNode',
        data: {
            complexNodeName: $("#complexNodeName").val(),
            x: uiOut.offset.left - document.getElementById("slider_1").offsetWidth,
            y: uiOut.offset.top - 102,
            s_id: $.getUrlParam("scenarioId"),
            iconUrl: iconUrl
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            $.alert(msg);
            if (msg == "创建成功") {
                if (iconUrl == "img/xinguanzhan01.png" || iconUrl == "img/cheliang_01.jpg" || iconUrl == "img/shouchi_01.png") { // 如果是地面节点
                    createComplexNode1($("#complexNodeName").val(), uiOut.offset.left - document.getElementById("slider_1").offsetWidth, uiOut.offset.top - 102, iconUrl);
                } else { // 如果是星际节点
                    createComplexNode($("#complexNodeName").val(), uiOut.offset.left - document.getElementById("slider_1").offsetWidth, uiOut.offset.top - 102, iconUrl);
                }
                $('#complexNodeModal').modal('hide');
            }
        },
        error: function () {

        }
    });
});

/**
 * 链路模态框中请求的发送
 */
$("#addLink").click(function () {
    // if ((beginNode.fontColor == "0,0,0" || beginNode.fontColor == "255,0,0") && endLastNode.fontColor == "0,0,0" || endLastNode.fontColor == "255,0,0") { // 如果是星星之间的链路
    //     newLink(beginNode, endLastNode, $("#linkName").val(), "0,0,255");
    // } else { // 非星星之间的链路，星地链路
    //     newLink(beginNode, endLastNode, $("#linkName").val(), "128,0,128"); // 紫色
    // }
    // beginNode = null;
    // scene.remove(link1);
    // $('#linkModal').modal('hide');
    var isTemplate = 0; // 标记该链路是否保存为模板
    if ($("input[name='saveAsTemplateCheckbox']:checked").val() == 1) { // 链路保存为模板
        isTemplate = 1;
    }
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
    if (beginNode.fontColor == "0,0,2" || endLastNode.fontColor == "0,0,2") {
        linkType = 20;
    }
    $.ajax({
        url: '/NetworkSimulation/addLink',
        data: {
            linkName: $("#linkName").val(),
            linkType: linkType,
            fromNodeIP: fromIp,
            toNodeIP: toIp,
            fromNodeName: beginNode.text,
            toNodeName: endLastNode.text,
            logicalFromNodeName: beginNode.text,
            logicalToNodeName: endLastNode.text,
            txPort_id: $("#fromPort").val(),
            rxPort_id: $("#toPort").val(),
            linkNoise: $("#channelNoise").val(),
            channelModel: $("#channelType").val(),
            linkLength: $("#linkLength").val(),
            scenario_id: $.getUrlParam("scenarioId"),
            isTemplate: isTemplate,
            onlyPort : $("#onlyPort").val()
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            $.alert(msg);
            if (msg == "创建成功") {
                if ((beginNode.fontColor == "0,0,0" || beginNode.fontColor == "255,0,0") && endLastNode.fontColor == "0,0,0" || endLastNode.fontColor == "255,0,0") { // 如果是星星之间的链路
                    newLink(beginNode, endLastNode, $("#linkName").val() + "(" + beginNode.text + "->" + endLastNode.text + ")", "0,0,255"); // 蓝色
                } else if (beginNode.fontColor == "0,1,0" || endLastNode.fontColor == "0,1,0") { // 如果是二层链路
                    newLink(beginNode, endLastNode, $("#linkName").val() + "(" + beginNode.text + "->" + endLastNode.text + ")", "0,1,255"); // 蓝色
                } else { // 非星星之间的链路，星地链路
                    newLink(beginNode, endLastNode, $("#linkName").val() + "(" + beginNode.text + "->" + endLastNode.text + ")", "128,0,128"); // 紫色
                }
                // if ($("#linkType").val() == 0) { // 有线链路
                //     if ((beginNode.fontColor == "0,0,0" || beginNode.fontColor == "255,0,0") && endLastNode.fontColor == "0,0,0" || endLastNode.fontColor == "255,0,0") { // 如果是星星之间的链路
                //         newLink(beginNode, endLastNode, $("#linkName").val() + "(" + beginNode.text + "->" + endLastNode.text + ")", "0,0,255"); // 蓝色
                //     } else { // 非星星之间的链路，星地链路
                //         newLink(beginNode, endLastNode, $("#linkName").val() + "(" + beginNode.text + "->" + endLastNode.text + ")", "128,0,128"); // 紫色
                //     }
                // } else if ($("#linkType").val() == 1) { // 无线链路
                //     newLink(beginNode, endLastNode, $("#linkName").val(), "0,0,0");
                // }
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
 * 复杂到复杂链路模态框提交
 */
$("#addComplexLink_0").click(function () {
    // if ((beginNode.fontColor == "0,0,0" || beginNode.fontColor == "255,0,0") && endLastNode.fontColor == "0,0,0" || endLastNode.fontColor == "255,0,0") { // 如果是星星之间的链路
    //     newLink(beginNode, endLastNode, $("#linkName_0").val(), "0,0,255");
    // } else { // 非星星之间的链路，星地链路
    //     newLink(beginNode, endLastNode, $("#linkName_0").val(), "128,0,128"); // 紫色
    // }
    // beginNode = null;
    // scene.remove(link1);
    // $('#complexNodeLinkModal_0').modal('hide');
    var fromNodeType; // 要确定复杂节点里面的节点类型
    for (var i = 0; i < fromNodeObjs.length; i++) {
        if ($("#selectFromNode_0").val() == fromNodeObjs[i].nodeName) {
            fromNodeType = fromNodeObjs[i].nodeType;
        }
    }
    var toNodeType; // 要确定复杂节点里面的节点类型
    for (var i = 0; i < toNodeObjs.length; i++) {
        if ($("#selectToNode_0").val() == toNodeObjs[i].nodeName) {
            toNodeType = toNodeObjs[i].nodeType;
        }
    }
    var linkType = 0;
    var fromIp;
    var toIp;
    if (fromNodeType == 2 && toNodeType == 2) { // 交换机到交换机
        linkType = 5;
    } else if (fromNodeType == 2) { // 交换机到三层节点
        linkType = 6;
        for (var i = 0; i < toPortObjs_0.length; i++) {
            if (toPortObjs_0[i].pt_id == $("#selectToPort_0").val()) {
                toIp = toPortObjs_0[i].portIp;
            }
        }
    } else if (toNodeType == 2) { // 三层到交换机
        linkType = 7;
        for (var i = 0; i < fromPortObjs_0.length; i++) {
            if (fromPortObjs_0[i].pt_id == $("#selectFromPort_0").val()) {
                fromIp = fromPortObjs_0[i].portIp;
            }
        }
    }
    $.ajax({
        url: '/NetworkSimulation/addLink',
        data: {
            linkName: $("#linkName_0").val(),
            linkType: linkType,
            fromNodeIP: fromIp,
            toNodeIP: toIp,
            fromNodeName: $("#selectFromNode_0").val(),
            toNodeName: $("#selectToNode_0").val(),
            logicalFromNodeName: beginNode.text,
            logicalToNodeName: endLastNode.text,
            txPort_id: $("#selectFromPort_0").val(),
            rxPort_id: $("#selectToPort_0").val(),
            linkNoise: $("#channelNoise_0").val(),
            channelModel: $("#channelType_0").val(),
            linkLength: $("#linkLength_0").val(),
            scenario_id: $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            $.alert(msg);
            if (msg == "创建成功") {
                if ((beginNode.fontColor == "0,0,0" || beginNode.fontColor == "255,0,0") && endLastNode.fontColor == "0,0,0" || endLastNode.fontColor == "255,0,0") { // 如果是星星之间的链路
                    newLink(beginNode, endLastNode, $("#linkName_0").val() + "(" + $("#selectFromNode_0").val() + "->" + $("#selectToNode_0").val() + ")", "0,0,255");
                } else { // 非星星之间的链路，星地链路
                    newLink(beginNode, endLastNode, $("#linkName_0").val() + "(" + $("#selectFromNode_0").val() + "->" + $("#selectToNode_0").val() + ")", "128,0,128"); // 紫色
                }
                beginNode = null;
                scene.remove(link1);
                $('#complexNodeLinkModal_0').modal('hide');
            }
        },
        error: function () {

        }
    });
});

/**
 * 简单到复杂链路模态框提交
 */
$("#addComplexLink_1").click(function () {
    // if ((beginNode.fontColor == "0,0,0" || beginNode.fontColor == "255,0,0") && endLastNode.fontColor == "0,0,0" || endLastNode.fontColor == "255,0,0") { // 如果是星星之间的链路
    //     newLink(beginNode, endLastNode, $("#linkName_1").val(), "0,0,255");
    // } else { // 非星星之间的链路，星地链路
    //     newLink(beginNode, endLastNode, $("#linkName_1").val(), "128,0,128"); // 紫色
    // }
    // beginNode = null;
    // scene.remove(link1);
    // $('#complexNodeLinkModal_1').modal('hide');
    var toNodeType; // 要确定复杂节点里面的节点类型
    for (var i = 0; i < toNodeObjs.length; i++) {
        if ($("#selectToNode_1").val() == toNodeObjs[i].nodeName) {
            toNodeType = toNodeObjs[i].nodeType;
        }
    }
    var linkType = 0;
    var fromIp;
    var toIp;
    if (beginNode.fontColor == "0,1,0" && toNodeType == 2) { // 交换机到交换机
        linkType = 5;
    } else if (beginNode.fontColor == "0,1,0") { // 交换机到三层节点
        linkType = 6;
        for (var i = 0; i < toPortObjs_0.length; i++) {
            if (toPortObjs_0[i].pt_id == $("#selectToPort_1").val()) {
                toIp = toPortObjs_0[i].portIp;
            }
        }
    } else if (toNodeType == 2) { // 三层到交换机
        linkType = 7;
        for (var i = 0; i < fromPortObjs_1.length; i++) {
            if (fromPortObjs_1[i].pt_id == $("#fromPort_1").val()) {
                fromIp = fromPortObjs_1[i].portIp;
            }
        }
    }
    $.ajax({
        url: '/NetworkSimulation/addLink',
        data: {
            linkName: $("#linkName_1").val(),
            linkType: linkType,
            fromNodeIP: fromIp,
            toNodeIP: toIp,
            fromNodeName: beginNode.text,
            toNodeName: $("#selectToNode_1").val(),
            logicalFromNodeName: beginNode.text,
            logicalToNodeName: endLastNode.text,
            txPort_id: $("#fromPort_1").val(),
            rxPort_id: $("#selectToPort_1").val(),
            linkNoise: $("#channelNoise_1").val(),
            channelModel: $("#channelType_1").val(),
            linkLength: $("#linkLength_1").val(),
            scenario_id: $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            $.alert(msg);
            if (msg == "创建成功") {
                if ((beginNode.fontColor == "0,0,0" || beginNode.fontColor == "255,0,0") && endLastNode.fontColor == "0,0,0" || endLastNode.fontColor == "255,0,0") { // 如果是星星之间的链路
                    newLink(beginNode, endLastNode, $("#linkName_1").val() + "(" + beginNode.text + "->" + $("#selectToNode_1").val() + ")", "0,0,255");
                } else { // 非星星之间的链路，星地链路
                    newLink(beginNode, endLastNode, $("#linkName_1").val() + "(" + beginNode.text + "->" + $("#selectToNode_1").val() + ")", "128,0,128"); // 紫色
                }
                beginNode = null;
                scene.remove(link1);
                $('#complexNodeLinkModal_1').modal('hide');
            }
        },
        error: function () {

        }
    });
});

/**
 * 复杂到简单链路模态框提交
 */
$("#addComplexLink_2").click(function () {
    // if ((beginNode.fontColor == "0,0,0" || beginNode.fontColor == "255,0,0") && endLastNode.fontColor == "0,0,0" || endLastNode.fontColor == "255,0,0") { // 如果是星星之间的链路
    //     newLink(beginNode, endLastNode, $("#linkName_2").val(), "0,0,255");
    // } else { // 非星星之间的链路，星地链路
    //     newLink(beginNode, endLastNode, $("#linkName_2").val(), "128,0,128"); // 紫色
    // }
    // beginNode = null;
    // scene.remove(link1);
    // $('#complexNodeLinkModal_2').modal('hide');
    var fromNodeType; // 要确定复杂节点里面的节点类型
    for (var i = 0; i < fromNodeObjs.length; i++) {
        if ($("#selectFromNode_2").val() == fromNodeObjs[i].nodeName) {
            fromNodeType = fromNodeObjs[i].nodeType;
        }
    }
    var linkType = 0;
    var fromIp;
    var toIp;
    if (fromNodeType == 2 && endLastNode.fontColor == "0,1,0") { // 交换机到交换机
        linkType = 5;
    } else if (fromNodeType == 2) { // 交换机到三层（简单）节点
        linkType = 6;
        for (var i = 0; i < toPortObjs_1.length; i++) {
            if (toPortObjs_1[i].pt_id == $("#selectToPort_2").val()) {
                toIp = toPortObjs_1[i].portIp;
            }
        }
    } else if (endLastNode.fontColor == "0,1,0") { // 三层（复杂）到交换机
        linkType = 7;
        for (var i = 0; i < fromPortObjs_0.length; i++) {
            if (fromPortObjs_0[i].pt_id == $("#toPort_2").val()) {
                fromIp = fromPortObjs_0[i].portIp;
            }
        }
    }
    $.ajax({
        url: '/NetworkSimulation/addLink',
        data: {
            linkName: $("#linkName_2").val(),
            linkType: linkType,
            fromNodeIP: fromIp,
            toNodeIP: toIp,
            fromNodeName: $("#selectFromNode_2").val(),
            toNodeName: endLastNode.text,
            logicalFromNodeName: beginNode.text,
            logicalToNodeName: endLastNode.text,
            txPort_id: $("#selectFromPort_2").val(),
            rxPort_id: $("#toPort_2").val(),
            linkNoise: $("#channelNoise_2").val(),
            channelModel: $("#channelType_2").val(),
            linkLength: $("#linkLength_2").val(),
            scenario_id: $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            $.alert(msg);
            if (msg == "创建成功") {
                if ((beginNode.fontColor == "0,0,0" || beginNode.fontColor == "255,0,0") && endLastNode.fontColor == "0,0,0" || endLastNode.fontColor == "255,0,0") { // 如果是星星之间的链路
                    newLink(beginNode, endLastNode, $("#linkName_2").val() + "(" + $("#selectFromNode_2").val() + "->" + endLastNode.text + ")", "0,0,255");
                } else { // 非星星之间的链路，星地链路
                    newLink(beginNode, endLastNode, $("#linkName_2").val() + "(" + $("#selectFromNode_2").val() + "->" + endLastNode.text + ")", "128,0,128"); // 紫色
                }
                beginNode = null;
                scene.remove(link1);
                $('#complexNodeLinkModal_2').modal('hide');
            }
        },
        error: function () {

        }
    });
});