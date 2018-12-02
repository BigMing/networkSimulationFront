/**
 * 设置链路定时断开
 */
var cutLink;
$("#cutLink").click(function () {
    var elements = scene.selectedElements;
    if (elements[0] instanceof JTopo.Link && (elements[0].strokeColor == "0,0,255" || elements[0].strokeColor == "128,0,128")) { // 三层链路
        cutLink = elements;
        $("#cutLinkModal").modal();
    } else if (elements[0] instanceof JTopo.Link && elements[0].strokeColor == "0,1,255") { // 二层链路
        $.ajax({
            url: '/NetworkSimulation/cutL2Link',
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
                    changeLinkToRed1(elements[0]); // 变化链路为红色虚线
                }
            },
            error: function () {

            }
        });
    } else {
        $.alert("请选中链路后在进行下一步操作！");
    }
});

/**
 * 设置链路定时断开提交
 */
$("#cutLinkSubmit").click(function () {
    setTimeout(function () {
        $.ajax({
            url: '/NetworkSimulation/cutLink',
            data: {
                linkName : cutLink[0].text,
                scenario_id : $.getUrlParam("scenarioId")
            },
            type: 'post',
            dataType: 'json',
            async: true,
            success: function (msg) {
                $.alert(msg);
                if (msg == "断开成功") {
                    changeLinkToRed(cutLink[0]); // 变化链路为红色虚线
                }
            },
            error: function () {

            }
        });
    }, $("#cutLinkTime").val() * 1000);
    $("#cutLinkModal").modal('hide');
});

/**
 * 接通链路
 */
$("#connectLink").click(function () {
    var elements = scene.selectedElements;
    if (elements[0] instanceof JTopo.Link && elements[0].strokeColor == "255,0,0") { // 三层链路
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
                    changeLinkToBlue(elements[0]); // 变化链路为蓝色
                }
            },
            error: function () {

            }
        });
    } else if (elements[0] instanceof JTopo.Link && elements[0].strokeColor == "255,1,0") { // 二层链路
        $.ajax({
            url: '/NetworkSimulation/connectL2Link',
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
                    changeLinkToBlue1(elements[0]); // 变化链路为蓝色
                }
            },
            error: function () {

            }
        });
    } else {
        $.alert("请选中链路后在进行下一步操作");
    }
});

//options
var linkListHtml ='';
//status
var statusMap = [];
/**
 * 设置链路通段时间
 */
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
});

/**
 * 初始化可选链路列表
 */
function initSelectLink(data) {
    var linkListHtml = '';
    var objs = jQuery.parseJSON(data);
    for (var i = 0; i < objs.length; i++) {
        linkListHtml += '<option value="' + objs[i].linkName + '" >' + objs[i].linkName + '</option>';
        statusMap[objs[i].linkName] = objs[i].linkStatus;
    }
    $("#selectLink_0").html(linkListHtml);
}

/**
 * 判断链路状态来决定是否能选择连通或断开
 * @param i 行数
 */
function selectConnction(i) {
    if (statusMap[$('[id = "selectLink_' + i + '"]').val()] == 1) { // 如果是断开的那一行
        $('[id = "switch_' + i + '"]').children().last().attr("disabled", "disabled");
        $('[id = "switch_' + i + '"]').children().first().removeAttr("disabled", "disabled");
    }
    if (statusMap[$('[id = "selectLink_' + i + '"]').val()] == 0) { // 如果是连通的一行
        $('[id = "switch_' + i + '"]').children().first().attr("disabled", "disabled");
        $('[id = "switch_' + i + '"]').children().last().removeAttr("disabled", "disabled");
    }
}

var flag_1 = 0; // 用于记录第几行的数据的标记,默认已经有第0行
/**
 * 点击增加一行
 */
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

/**
 * 点击删除一行
 */
$("#minusOneControl").click(function () {
    if (flag_1 > 0) { // flag最小回归为0
        --flag_1;
    }
    $("#setLinkTimeForm").children().last().remove();
});

/**
 * 设置链路通断时间点击提交
 */
$("#setLinkTimeSubmit").click(function () {
    console.log("链路名：" + $('[id = "selectLink_' + 0 + '"]').val());
    if ($("#totalTime").val() == '') {
        $.alert("请输入总仿真时间！");
        return false;
    }
    var elements = scene.getDisplayedElements();
    //遍历每行定时任务
    for (var i = 0; i <= flag_1; i++) { // i为行数
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
    $("#setLinkTimeModal").modal('hide');
});

/**
 * 点击上传stk文件
 */
$("#inputFileSubmit").click(function () {
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

/**
 * 打开控制台页面
 */
$("#openCli").click(function () {
    var elements = scene.selectedElements;
    if (elements[0] == undefined || elements[0] instanceof JTopo.Link || elements[0].fontColor == "255,0,0"){
        $.alert("请选中简单节点后在进行下一步操作");
    } else if (simpleNodeType[elements[0].text] == 0) { // 如果是docker节点
        window.open(encodeURI("dockerConsole.html?nodeId=" + simpleNodeId[elements[0].text]));
    } else if (simpleNodeType[elements[0].text] == 1) { // 如果是vm
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
                window.open(msg);
            },
            error: function () {

            }
        });
    } else if (simpleNodeType[elements[0].text] == null) { // 如果是新建的节点，未存id和type就刷新
        $.alert("即将自动刷新，2秒后请您再打开。");
        refreshCanvas();
    }
});

/**
 * 打开复杂节点编辑器
 */
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
    if (elements[0] instanceof JTopo.Node && elements[0].fontColor == "0,0,0") { // 选中的是简单三层节点
        window.open(encodeURI("nodeEdit.html?nodeName=" + elements[0].text + "&scenarioId=" + $.getUrlParam("scenarioId")));
    } else if (elements[0] instanceof JTopo.Node && elements[0].fontColor == "255,0,0") { // 选中的是复杂节点
        window.open(encodeURI("complexNodeEdit.html?complexNodeName=" + elements[0].text + "&scenarioId=" + $.getUrlParam("scenarioId")));
    } else if (elements[0] instanceof JTopo.Link) { // 选中的是链路
        window.open(encodeURI("linkEdit.html?linkName=" + elements[0].text + "&scenarioId=" + $.getUrlParam("scenarioId")));
    } else if (elements[0] instanceof JTopo.Node && (elements[0].fontColor == "0,1,0" || elements[0].fontColor == "1,0,0")) { // 选中的是二层节点
        window.open(encodeURI("nodeEdit.html?nodeName=" + elements[0].text + "&scenarioId=" + $.getUrlParam("scenarioId") + "&isL2node=1"));
    } else {
        $.alert("不支持的操作！");
    }
});