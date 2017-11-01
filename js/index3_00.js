// var link_ips = [];
/**
 * 新建链路——打开模态框，鼠标点击后
 */
scene.mouseup(function (e) {
    if (e.target != null && e.target instanceof JTopo.Node && flag != 0) { // 点击了画布上的节点，且flag！=0
        if (beginNode == null) { // 还未设置起始节点的话
            beginNode = e.target; // 设置起始节点
            scene.add(link1);
            tempNodeA.setLocation(e.x, e.y);
            tempNodeZ.setLocation(e.x, e.y);
        } else if (beginNode !== e.target) { // 设置了起始节点，点击了其他节点的话
            endLastNode = e.target; // 此时设置终止节点，然后弹出链路模态框
            // getExitLinkIps();
            // 判断选择的节点中是否有复杂节点，弹出相应的模态框
            if (beginNode.fontColor == "255,0,0" && endLastNode.fontColor == "255,0,0") { // 复杂——复杂
                $("#complexNodeLinkModal_0").modal();
                // 发送ajax查询fromNode的内部节点对象列表的json
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
                // 发送ajax查询toNode的内部节点对象列表的json
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
            } else if (beginNode.fontColor == "255,0,0" && endLastNode.fontColor == "0,0,0") { // 复杂——简单
                $("#complexNodeLinkModal_2").modal();
                // 发送ajax查询fromNode的内部节点对象列表的json
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
                // 发送ajax查询to端口
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
            } else if (beginNode.fontColor == "0,0,0" && endLastNode.fontColor == "255,0,0") { // 简单——复杂
                $("#complexNodeLinkModal_1").modal();
                // 发送ajax查询from端口
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
                // 发送ajax查询toNode的内部节点对象列表的json
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
            } else { // 简单——简单
                $("#linkModal").modal(); // 弹出模态框
                $.ajax({ // 发送ajax查询from端口
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
                $.ajax({ // 发送ajax查询to端口
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
                $.ajax({ // 发送ajax查询链路模板，要返回链路list的json
                    url: '/NetworkSimulation/getLinkTemplate',
                    data: {

                    },
                    type: 'post',
                    dataType: 'json',
                    async: false,
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
 * 创建节点函数，用字体的颜色来区分节点类型（星际节点，地面节点）
 */
function createNode(name, X, Y, pic) {
    var node = new JTopo.Node(name);
    node.setLocation(X, Y);
    node.fontColor = "0,0,0";
    node.setImage(pic, true);
    scene.add(node);
}
function createNode1(name, X, Y, pic) {
    var node = new JTopo.Node(name);
    node.setLocation(X, Y);
    node.fontColor = "0,0,1";
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
function createComplexNode1(name, X, Y, pic) {
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
$("#weixing1").draggable({
    helper: "clone"
});
$("#weixing2").draggable({
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
            $("#myModal").modal(); // 首先弹出模态框
            // 查询已有节点的信息，确保输入的管理ip不会重复
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
        if (getId == "weixing2") { // 如果拖拽的是复杂节点，弹出复杂节点模态框
            $("#complexNodeModal").modal();
        }
    }
});

/**
 * 创建节点模态框的提交
 */
$("#addNode").click(function () {
    var iconUrl = $("input[name='optionsRadiosinline0']:checked").val(); // 选择的图标类型
    // if (iconUrl == "img/xinguanzhan.jpg" || iconUrl == "img/cheliang_01.jpg" || iconUrl == "img/shouchi_01.png") { // 如果是地面节点
    //     createNode1($("#nodeName").val(), uiOut.offset.left - document.getElementById("slider_1").offsetWidth, uiOut.offset.top - 102, iconUrl);
    // } else { // 如果是星际节点
    //     createNode($("#nodeName").val(), uiOut.offset.left - document.getElementById("slider_1").offsetWidth, uiOut.offset.top - 102, iconUrl);
    // }
    // $('#myModal').modal('hide');
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
                if (iconUrl == "img/xinguanzhan.jpg" || iconUrl == "img/cheliang_01.jpg" || iconUrl == "img/shouchi_01.png") { // 如果是地面节点
                    createNode1($("#nodeName").val(), uiOut.offset.left - document.getElementById("slider_1").offsetWidth, uiOut.offset.top - 102, iconUrl);
                } else { // 如果是星际节点
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
 * 新建复杂节点提交
 */
$("#addComplexNode").click(function () {
    var iconUrl = $("input[name='optionsRadiosinline1']:checked").val();
    // if (iconUrl == "img/xinguanzhan.jpg" || iconUrl == "img/cheliang_01.jpg" || iconUrl == "img/shouchi_01.png") { // 如果是地面节点
    //     createComplexNode1($("#complexNodeName").val(), uiOut.offset.left - document.getElementById("slider_1").offsetWidth, uiOut.offset.top - 102, iconUrl);
    // } else { // 如果是星际节点
    //     createComplexNode($("#complexNodeName").val(), uiOut.offset.left - document.getElementById("slider_1").offsetWidth, uiOut.offset.top - 102, iconUrl);
    // }
    // $('#complexNodeModal').modal('hide');
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
                if (iconUrl == "img/xinguanzhan.jpg" || iconUrl == "img/cheliang_01.jpg" || iconUrl == "img/shouchi_01.png") { // 如果是地面节点
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
    if ($("input[name='saveAsTemplateCheckbox']:checked").val() == 1) { // 链路保存为模板
        $.ajax({
            url: '/NetworkSimulation/addLinkAsTemplate',
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
                    if ($("#linkType").val() == 0) { // 有线链路
                        if ((beginNode.fontColor == "0,0,0" || beginNode.fontColor == "255,0,0") && endLastNode.fontColor == "0,0,0" || endLastNode.fontColor == "255,0,0") { // 如果是星星之间的链路
                            newLink(beginNode, endLastNode, $("#linkName").val(), "0,0,255"); // 蓝色
                        } else { // 非星星之间的链路，星地链路
                            newLink(beginNode, endLastNode, $("#linkName").val(), "128,0,128"); // 紫色
                        }
                    } else if ($("#linkType").val() == 1) {//无线链路
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
    } else { // 链路未保存未模板
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
                    if ($("#linkType").val() == 0) { // 有线链路
                        if ((beginNode.fontColor == "0,0,0" || beginNode.fontColor == "255,0,0") && endLastNode.fontColor == "0,0,0" || endLastNode.fontColor == "255,0,0") { // 如果是星星之间的链路
                            newLink(beginNode, endLastNode, $("#linkName").val(), "0,0,255"); // 蓝色
                        } else { // 非星星之间的链路，星地链路
                            newLink(beginNode, endLastNode, $("#linkName").val(), "128,0,128"); // 紫色
                        }
                    } else if ($("#linkType").val() == 1) {//无线链路
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
    }
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
                if ($("#linkType_0").val() == 0) {//有线链路
                    if ((beginNode.fontColor == "0,0,0" || beginNode.fontColor == "255,0,0") && endLastNode.fontColor == "0,0,0" || endLastNode.fontColor == "255,0,0") { // 如果是星星之间的链路
                        newLink(beginNode, endLastNode, $("#linkName_0").val(), "0,0,255");
                    } else { // 非星星之间的链路，星地链路
                        newLink(beginNode, endLastNode, $("#linkName_0").val(), "128,0,128"); // 紫色
                    }
                } else if ($("#linkType_0").val() == 1) {//无线链路
                    newLink(beginNode, endLastNode, $("#linkName_0").val(), "0,0,0");
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
                if ($("#linkType_1").val() == 0) {//有线链路
                    if ((beginNode.fontColor == "0,0,0" || beginNode.fontColor == "255,0,0") && endLastNode.fontColor == "0,0,0" || endLastNode.fontColor == "255,0,0") { // 如果是星星之间的链路
                        newLink(beginNode, endLastNode, $("#linkName_1").val(), "0,0,255");
                    } else { // 非星星之间的链路，星地链路
                        newLink(beginNode, endLastNode, $("#linkName_1").val(), "128,0,128"); // 紫色
                    }
                } else if ($("#linkType_1").val() == 1) {//无线链路
                    newLink(beginNode, endLastNode, $("#linkName_1").val(), "0,0,0");
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
                if ($("#linkType_2").val() == 0) {//有线链路
                    if ((beginNode.fontColor == "0,0,0" || beginNode.fontColor == "255,0,0") && endLastNode.fontColor == "0,0,0" || endLastNode.fontColor == "255,0,0") { // 如果是星星之间的链路
                        newLink(beginNode, endLastNode, $("#linkName_2").val(), "0,0,255");
                    } else { // 非星星之间的链路，星地链路
                        newLink(beginNode, endLastNode, $("#linkName_2").val(), "128,0,128"); // 紫色
                    }
                } else if ($("#linkType_2").val() == 1) {//无线链路
                    newLink(beginNode, endLastNode, $("#linkName_2").val(), "0,0,0");
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