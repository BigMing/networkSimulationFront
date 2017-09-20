// var json1 = '[{"fromBigNodeName":"Maui_HI_AMOS","innerNodeName":["Maui_HI_AMOS"],"toBigNodeNames":["LEO"]},{"fromBigNodeName":"LEO","innerNodeName":["LEO16","LEO15","LEO26","LEO36","LEO25","LEO14","LEO46","LEO35","LEO24","LEO13","LEO45","LEO34","LEO12","LEO23","LEO44","LEO33","LEO11","LEO22","LEO43","LEO32","LEO21","LEO42","LEO31","LEO41"],"toBigNodeNames":["GEO","LEO"]},{"fromBigNodeName":"GEO","innerNodeName":["GEO2","GEO3"],"toBigNodeNames":["GEO","Maui_HI_AMOS","LEO"]},{"fromBigNodeName":"Berkeley","innerNodeName":["Berkeley"],"toBigNodeNames":["LEO"]}]';
// var json2 = '[{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO14"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO13"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO12"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO11"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO16"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO15"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"GEO3"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO21"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO25"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO24"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO23"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO22"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO26"},{"fromNodeName":"LEO41","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO41"},{"fromNodeName":"LEO42","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO42"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO41"},{"fromNodeName":"LEO43","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO43"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO42"},{"fromNodeName":"LEO44","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO44"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO43"},{"fromNodeName":"LEO45","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO45"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO44"},{"fromNodeName":"LEO46","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO46"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO45"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO46"},{"fromNodeName":"LEO31","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO31"},{"fromNodeName":"LEO32","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO32"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO31"},{"fromNodeName":"LEO33","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO33"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO32"},{"fromNodeName":"LEO34","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO34"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO33"},{"fromNodeName":"LEO35","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO35"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO34"},{"fromNodeName":"LEO36","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO36"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO35"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO36"},{"fromNodeName":"LEO45","linkStatus":0,"toNodeName":"LEO46"},{"fromNodeName":"LEO44","linkStatus":0,"toNodeName":"LEO45"},{"fromNodeName":"LEO41","linkStatus":0,"toNodeName":"LEO46"},{"fromNodeName":"LEO43","linkStatus":0,"toNodeName":"LEO44"},{"fromNodeName":"LEO42","linkStatus":0,"toNodeName":"LEO43"},{"fromNodeName":"LEO41","linkStatus":0,"toNodeName":"LEO42"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"Maui_HI_AMOS"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO32"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO31"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO36"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO35"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO34"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO33"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO43"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO42"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO41"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO46"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO45"},{"fromNodeName":"Maui_HI_AMOS","linkStatus":0,"toNodeName":"LEO44"},{"fromNodeName":"LEO16","linkStatus":0,"toNodeName":"LEO36"},{"fromNodeName":"LEO16","linkStatus":0,"toNodeName":"LEO35"},{"fromNodeName":"LEO25","linkStatus":0,"toNodeName":"LEO26"},{"fromNodeName":"LEO15","linkStatus":0,"toNodeName":"LEO35"},{"fromNodeName":"LEO16","linkStatus":0,"toNodeName":"LEO34"},{"fromNodeName":"LEO15","linkStatus":0,"toNodeName":"LEO34"},{"fromNodeName":"LEO24","linkStatus":0,"toNodeName":"LEO25"},{"fromNodeName":"LEO12","linkStatus":0,"toNodeName":"LEO36"},{"fromNodeName":"LEO14","linkStatus":0,"toNodeName":"LEO34"},{"fromNodeName":"LEO15","linkStatus":0,"toNodeName":"LEO33"},{"fromNodeName":"LEO11","linkStatus":0,"toNodeName":"LEO36"},{"fromNodeName":"LEO14","linkStatus":0,"toNodeName":"LEO33"},{"fromNodeName":"LEO21","linkStatus":0,"toNodeName":"LEO26"},{"fromNodeName":"LEO23","linkStatus":0,"toNodeName":"LEO24"},{"fromNodeName":"LEO11","linkStatus":0,"toNodeName":"LEO35"},{"fromNodeName":"LEO13","linkStatus":0,"toNodeName":"LEO33"},{"fromNodeName":"LEO14","linkStatus":0,"toNodeName":"LEO32"},{"fromNodeName":"LEO13","linkStatus":0,"toNodeName":"LEO32"},{"fromNodeName":"LEO22","linkStatus":0,"toNodeName":"LEO23"},{"fromNodeName":"LEO12","linkStatus":0,"toNodeName":"LEO32"},{"fromNodeName":"LEO13","linkStatus":0,"toNodeName":"LEO31"},{"fromNodeName":"LEO12","linkStatus":0,"toNodeName":"LEO31"},{"fromNodeName":"LEO21","linkStatus":0,"toNodeName":"LEO22"},{"fromNodeName":"LEO11","linkStatus":0,"toNodeName":"LEO31"},{"fromNodeName":"LEO16","linkStatus":0,"toNodeName":"LEO46"},{"fromNodeName":"LEO26","linkStatus":0,"toNodeName":"LEO36"},{"fromNodeName":"LEO15","linkStatus":0,"toNodeName":"LEO46"},{"fromNodeName":"LEO16","linkStatus":0,"toNodeName":"LEO45"},{"fromNodeName":"LEO26","linkStatus":0,"toNodeName":"LEO35"},{"fromNodeName":"LEO14","linkStatus":0,"toNodeName":"LEO46"},{"fromNodeName":"LEO15","linkStatus":0,"toNodeName":"LEO45"},{"fromNodeName":"LEO16","linkStatus":0,"toNodeName":"LEO44"},{"fromNodeName":"LEO25","linkStatus":0,"toNodeName":"LEO35"},{"fromNodeName":"LEO13","linkStatus":0,"toNodeName":"LEO46"},{"fromNodeName":"LEO14","linkStatus":0,"toNodeName":"LEO45"},{"fromNodeName":"LEO15","linkStatus":0,"toNodeName":"LEO44"},{"fromNodeName":"LEO16","linkStatus":0,"toNodeName":"LEO43"},{"fromNodeName":"LEO25","linkStatus":0,"toNodeName":"LEO34"},{"fromNodeName":"LEO12","linkStatus":0,"toNodeName":"LEO46"},{"fromNodeName":"LEO13","linkStatus":0,"toNodeName":"LEO45"},{"fromNodeName":"LEO14","linkStatus":0,"toNodeName":"LEO44"},{"fromNodeName":"LEO15","linkStatus":0,"toNodeName":"LEO43"},{"fromNodeName":"LEO16","linkStatus":0,"toNodeName":"LEO42"},{"fromNodeName":"LEO24","linkStatus":0,"toNodeName":"LEO34"},{"fromNodeName":"LEO11","linkStatus":0,"toNodeName":"LEO46"},{"fromNodeName":"LEO12","linkStatus":0,"toNodeName":"LEO45"},{"fromNodeName":"LEO13","linkStatus":0,"toNodeName":"LEO44"},{"fromNodeName":"LEO14","linkStatus":0,"toNodeName":"LEO43"},{"fromNodeName":"LEO15","linkStatus":0,"toNodeName":"LEO42"},{"fromNodeName":"LEO16","linkStatus":0,"toNodeName":"LEO41"},{"fromNodeName":"LEO21","linkStatus":0,"toNodeName":"LEO36"},{"fromNodeName":"LEO24","linkStatus":0,"toNodeName":"LEO33"},{"fromNodeName":"LEO11","linkStatus":0,"toNodeName":"LEO45"},{"fromNodeName":"LEO12","linkStatus":0,"toNodeName":"LEO44"},{"fromNodeName":"LEO13","linkStatus":0,"toNodeName":"LEO43"},{"fromNodeName":"LEO14","linkStatus":0,"toNodeName":"LEO42"},{"fromNodeName":"LEO15","linkStatus":0,"toNodeName":"LEO41"},{"fromNodeName":"LEO23","linkStatus":0,"toNodeName":"LEO33"},{"fromNodeName":"LEO11","linkStatus":0,"toNodeName":"LEO44"},{"fromNodeName":"LEO12","linkStatus":0,"toNodeName":"LEO43"},{"fromNodeName":"LEO13","linkStatus":0,"toNodeName":"LEO42"},{"fromNodeName":"LEO14","linkStatus":0,"toNodeName":"LEO41"},{"fromNodeName":"LEO23","linkStatus":0,"toNodeName":"LEO32"},{"fromNodeName":"LEO11","linkStatus":0,"toNodeName":"LEO43"},{"fromNodeName":"LEO12","linkStatus":0,"toNodeName":"LEO42"},{"fromNodeName":"LEO13","linkStatus":0,"toNodeName":"LEO41"},{"fromNodeName":"LEO22","linkStatus":0,"toNodeName":"LEO32"},{"fromNodeName":"LEO11","linkStatus":0,"toNodeName":"LEO42"},{"fromNodeName":"LEO12","linkStatus":0,"toNodeName":"LEO41"},{"fromNodeName":"LEO22","linkStatus":0,"toNodeName":"LEO31"},{"fromNodeName":"LEO11","linkStatus":0,"toNodeName":"LEO41"},{"fromNodeName":"LEO21","linkStatus":0,"toNodeName":"LEO31"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO46"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO44"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO45"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO42"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO43"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO41"},{"fromNodeName":"LEO26","linkStatus":0,"toNodeName":"LEO46"},{"fromNodeName":"LEO26","linkStatus":0,"toNodeName":"LEO45"},{"fromNodeName":"LEO35","linkStatus":0,"toNodeName":"LEO36"},{"fromNodeName":"LEO25","linkStatus":0,"toNodeName":"LEO45"},{"fromNodeName":"LEO26","linkStatus":0,"toNodeName":"LEO44"},{"fromNodeName":"LEO25","linkStatus":0,"toNodeName":"LEO44"},{"fromNodeName":"LEO34","linkStatus":0,"toNodeName":"LEO35"},{"fromNodeName":"LEO22","linkStatus":0,"toNodeName":"LEO46"},{"fromNodeName":"LEO24","linkStatus":0,"toNodeName":"LEO44"},{"fromNodeName":"LEO25","linkStatus":0,"toNodeName":"LEO43"},{"fromNodeName":"LEO21","linkStatus":0,"toNodeName":"LEO46"},{"fromNodeName":"LEO24","linkStatus":0,"toNodeName":"LEO43"},{"fromNodeName":"LEO31","linkStatus":0,"toNodeName":"LEO36"},{"fromNodeName":"LEO33","linkStatus":0,"toNodeName":"LEO34"},{"fromNodeName":"LEO21","linkStatus":0,"toNodeName":"LEO45"},{"fromNodeName":"LEO23","linkStatus":0,"toNodeName":"LEO43"},{"fromNodeName":"LEO24","linkStatus":0,"toNodeName":"LEO42"},{"fromNodeName":"LEO23","linkStatus":0,"toNodeName":"LEO42"},{"fromNodeName":"LEO32","linkStatus":0,"toNodeName":"LEO33"},{"fromNodeName":"LEO22","linkStatus":0,"toNodeName":"LEO42"},{"fromNodeName":"LEO23","linkStatus":0,"toNodeName":"LEO41"},{"fromNodeName":"LEO22","linkStatus":0,"toNodeName":"LEO41"},{"fromNodeName":"LEO31","linkStatus":0,"toNodeName":"LEO32"},{"fromNodeName":"LEO21","linkStatus":0,"toNodeName":"LEO41"},{"fromNodeName":"LEO36","linkStatus":0,"toNodeName":"LEO46"},{"fromNodeName":"LEO36","linkStatus":0,"toNodeName":"LEO45"},{"fromNodeName":"LEO35","linkStatus":0,"toNodeName":"LEO45"},{"fromNodeName":"LEO35","linkStatus":0,"toNodeName":"LEO44"},{"fromNodeName":"LEO34","linkStatus":0,"toNodeName":"LEO44"},{"fromNodeName":"LEO31","linkStatus":0,"toNodeName":"LEO46"},{"fromNodeName":"LEO34","linkStatus":0,"toNodeName":"LEO43"},{"fromNodeName":"LEO33","linkStatus":0,"toNodeName":"LEO43"},{"fromNodeName":"LEO33","linkStatus":0,"toNodeName":"LEO42"},{"fromNodeName":"LEO32","linkStatus":0,"toNodeName":"LEO42"},{"fromNodeName":"LEO32","linkStatus":0,"toNodeName":"LEO41"},{"fromNodeName":"LEO31","linkStatus":0,"toNodeName":"LEO41"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO24"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO25"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO22"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO23"},{"fromNodeName":"LEO21","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO21"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO21"},{"fromNodeName":"LEO22","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO22"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO21"},{"fromNodeName":"LEO23","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO23"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO22"},{"fromNodeName":"LEO24","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO24"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO23"},{"fromNodeName":"LEO25","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO25"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO24"},{"fromNodeName":"LEO26","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO26"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO25"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO26"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO26"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO35"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO36"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO33"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO34"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO31"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO32"},{"fromNodeName":"LEO11","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO11"},{"fromNodeName":"LEO12","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO12"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO11"},{"fromNodeName":"LEO13","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO13"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO12"},{"fromNodeName":"LEO14","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO14"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO13"},{"fromNodeName":"LEO15","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO15"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO14"},{"fromNodeName":"LEO16","linkStatus":0,"toNodeName":"GEO1"},{"fromNodeName":"GEO2","linkStatus":0,"toNodeName":"LEO16"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO15"},{"fromNodeName":"GEO3","linkStatus":0,"toNodeName":"LEO16"},{"fromNodeName":"LEO15","linkStatus":0,"toNodeName":"LEO16"},{"fromNodeName":"LEO14","linkStatus":0,"toNodeName":"LEO15"},{"fromNodeName":"LEO11","linkStatus":0,"toNodeName":"LEO16"},{"fromNodeName":"LEO13","linkStatus":0,"toNodeName":"LEO14"},{"fromNodeName":"LEO12","linkStatus":0,"toNodeName":"LEO13"},{"fromNodeName":"LEO11","linkStatus":0,"toNodeName":"LEO12"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO13"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO14"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO11"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO12"},{"fromNodeName":"LEO16","linkStatus":0,"toNodeName":"LEO26"},{"fromNodeName":"LEO16","linkStatus":0,"toNodeName":"LEO25"},{"fromNodeName":"LEO15","linkStatus":0,"toNodeName":"LEO25"},{"fromNodeName":"LEO15","linkStatus":0,"toNodeName":"LEO24"},{"fromNodeName":"LEO14","linkStatus":0,"toNodeName":"LEO24"},{"fromNodeName":"LEO11","linkStatus":0,"toNodeName":"LEO26"},{"fromNodeName":"LEO14","linkStatus":0,"toNodeName":"LEO23"},{"fromNodeName":"LEO13","linkStatus":0,"toNodeName":"LEO23"},{"fromNodeName":"LEO13","linkStatus":0,"toNodeName":"LEO22"},{"fromNodeName":"LEO12","linkStatus":0,"toNodeName":"LEO22"},{"fromNodeName":"LEO12","linkStatus":0,"toNodeName":"LEO21"},{"fromNodeName":"LEO11","linkStatus":0,"toNodeName":"LEO21"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO15"},{"fromNodeName":"Berkeley","linkStatus":0,"toNodeName":"LEO16"}]';

//用于右边树的勾选控制
var silentByChild = true;
var objs;
var links;
// var objs = jQuery.parseJSON(json1);
// var links = jQuery.parseJSON(json2);

/**
 * 解析url
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
 * 请求大类的json
 */
$.ajax({
    url: '/NetworkSimulation/getStkNode',
    data: {
        s_id : $.getUrlParam("scenarioId")
    },
    type: 'post',
    dataType: 'json',
    async: false,
    success: function (msg) {
        //初始化大类对象
        objs = jQuery.parseJSON(msg);
        console.log("初始化大类对象成功");
    },
    error: function () {

    }
});

/**
 * 请求链路的json文件
 */
$.ajax({
    url: '/NetworkSimulation/getStkLink',
    data: {
        s_id : $.getUrlParam("scenarioId")
    },
    type: 'post',
    dataType: 'json',
    async: false,
    success: function (msg) {
        //初始化链路对象
        links = jQuery.parseJSON(msg);
        console.log("初始化link对象成功");
    },
    error: function () {

    }
});

/**
 * 初始化左边树的数组对象
 * @returns {Array} 左边的树的数组对象
 */
function getLeftTree() {
    var leftTree = [];
    for (var i = 0; i < objs.length; i++) {
        //创建大类节点进行初始化
        var bigNode = {};
        bigNode["text"] = objs[i].fromBigNodeName;
        //初始化为未展开的状态
        bigNode["state"] = {};
        bigNode["state"]["expanded"] = false;
        //设置该节点是否可以被选择
        bigNode["selectable"] = false;
        //初始化大类下面的子节点
        bigNode["nodes"] = [];
        for (var j = 0; j < objs[i].innerNodeName.length; j++) {
            var smallNode = {};
            smallNode["text"] = objs[i].innerNodeName[j];
            //把子节点放入大类中
            bigNode["nodes"].push(smallNode);
        }
        //把大类放入树中
        leftTree.push(bigNode);
    }
    return leftTree;
}

/**
 * 定义左边的树
 */
$("#tree").treeview({
    data: getLeftTree(),
    multiSelect : false
});

/**
 * 初始化右边的树是数组对象
 * @param node 左边的树种选中的节点
 * @returns {Array} 右边的树的数组对象
 */
function getRightTree(node) {
    var checkedNodeNames = [];
    for (var i = 0; i < links.length; i++) {
        if (node.text == links[i].fromNodeName && links[i].linkStatus == 0) {
            //记录下与左边节点关联的右边节点名字
            checkedNodeNames.push(links[i].toNodeName);
        }
    }
    console.log("需要勾选的右边节点是：" + checkedNodeNames);
    var rightTree = [];
    for (var i = 0; i < objs.length; i++) {
        //创建大类节点进行初始化
        var bigNode = {};
        bigNode["text"] = objs[i].fromBigNodeName;
        //初始化为未展开的状态
        bigNode["state"] = {};
        // bigNode["state"]["expanded"] = false;
        //初始化大类下面的子节点
        bigNode["nodes"] = [];
        //用于记录子节点勾选个数，进而对父节点状态进行初始化
        var checkedCount = 0;
        for (var j = 0; j < objs[i].innerNodeName.length; j++) {
            var smallNode = {};
            //要找到那些节点需要勾选
            for (var k = 0; k < checkedNodeNames.length; k++) {
                if (objs[i].innerNodeName[j] == checkedNodeNames[k]) {
                    //此时该子节点是被选中的，可以存在的
                    smallNode["text"] = objs[i].innerNodeName[j];
                    smallNode["state"] = {};
                    smallNode["state"]["checked"] = true;
                    //把子节点放入大类中
                    bigNode["nodes"].push(smallNode);
                    checkedCount++;
                }
            }
            // if (!smallNode["state"]["checked"]) {
            //     //没有被勾选的节点也要禁止其进行勾选，只能对已勾选的节点进行取消勾选的操作
            //     smallNode["state"]["disabled"] = true;
            // }
        }
        if (bigNode["nodes"].length == checkedCount && bigNode["nodes"].length != 0) {
            //此时父节点的子节点全被勾选了
            bigNode["state"]["checked"] = true;
            bigNode["state"]["selected"] = true;
        }
        // if (checkedCount > 0 && checkedCount < bigNode["nodes"].length) {
        //     //子节点部分勾选
        //     bigNode["state"]["selected"] = true;
        // }
        if (checkedCount == 0) {
            //无子节点被勾选
            bigNode["state"]["disabled"] = true;
        }
        //把大类放入树中
        rightTree.push(bigNode);
    }
    return rightTree;
}

/**
 * 选择左边的节点触发事件
 */
$('#tree').on('nodeSelected', function(event, node) {
    console.log("已经点击了左边的节点：" + node.text);
    // var parentNode = $("#tree_1").treeview('getParent', node.nodeId);
    // if (parentNode.nodeId == undefined) {
    //     //如果选择的是大类节点
    //
    // } else {
    //     //如果选择是子节点
    //
    // }
     var selectNodeNames = node.text;
    //定义右边的树
    $("#tree_1").treeview({
        data: getRightTree(node),
        showCheckbox: true,
        highlightSelected: false,
        multiSelect : false,
        onNodeChecked : function (event, node) {
            if (node.nodes != null) {
                //如果勾选的是父节点，将其子节点全部勾选
                // $("#alertInfo").removeAttr("hidden");
                $.each(node.nodes, function(index, value) {
                    $("#tree_1").treeview('checkNode', value.nodeId, {
                        silent : true
                    });
                });
            } else {
                //如果勾选的是子节点
                for (var i = 0; i < links.length; i++) {
                    if (selectNodeNames == links[i].fromNodeName && node.text == links[i].toNodeName) {
                        links[i].linkStatus = 0;
                        console.log(links[i].fromNodeName + "和" + links[i].toNodeName + "之间的链路已经连接");
                    }
                }
                var parentNode = $("#tree_1").treeview('getParent', node.nodeId);
                if (parentNode.nodeId == undefined) {
                    //如果是无子节点的父节点，getParent函数有bug，无法返回undefined，需要自己判断
                    return;
                } else {
                    var isAllchecked = true; // 是否全部选中
                    //获取兄弟节点查看勾选状态
                    var siblings = $("#tree_1").treeview('getSiblings', node.nodeId);
                    for ( var i in siblings) {
                        // 有一个没选中，则不是全选
                        if (!siblings[i].state.checked) {
                            isAllchecked = false;
                            break;
                        }
                    }
                    // 全选，则打钩
                    if (isAllchecked) {
                        $("#tree_1").treeview('checkNode', parentNode.nodeId, {
                            silent : true
                        });
                    } else {
                        // 非全选，设置为红色
                        $("#tree_1").treeview('selectNode', parentNode.nodeId, {
                            silent : true
                        });
                    }
                }
            }
        },
        onNodeUnchecked : function (event, node) {
            // $("#alertInfo").attr("hidden", "hidden");
            // 选中的是父节点
            if (node.nodes != null) {
                // 这里需要控制，判断是否是因为子级节点引起的父节点被取消选中
                // 如果是，则只管取消父节点就行了
                // 如果不是，则子节点需要被取消选中
                if (silentByChild) {
                    $.each(node.nodes, function(index, value) {
                        $("#tree_1").treeview('uncheckNode', value.nodeId, {
                            silent : true
                        });
                    });
                }
            } else {
                // 子级节点被取消选中
                for (var i = 0; i < links.length; i++) {
                    if (selectNodeNames == links[i].fromNodeName && node.text == links[i].toNodeName) {
                        links[i].linkStatus = 1;
                        console.log(links[i].fromNodeName + "和" + links[i].toNodeName + "之间的链路已经断开");
                    }
                }
                var parentNode = $("#tree_1").treeview('getParent', node.nodeId);
                if (parentNode.nodeId == undefined) {
                    //如果是无子节点的父节点，getParent函数有bug，无法返回undefined，需要自己判断
                    return;
                } else {
                    var isAllUnchecked = true; // 是否全部取消选中
                    // 市级节点有一个选中，那么就不是全部取消选中
                    var siblings = $("#tree_1").treeview('getSiblings', node.nodeId);
                    for (var i in siblings) {
                        if (siblings[i].state.checked) {
                            isAllUnchecked = false;
                            break;
                        }
                    }
                    // 全部取消选中，那么省级节点恢复到默认状态
                    if (isAllUnchecked) {
                        silentByChild = true;
                        $("#tree_1").treeview('unselectNode', parentNode.nodeId, {
                            silent : true
                        });
                        $("#tree_1").treeview('uncheckNode', parentNode.nodeId, {
                            silent : true
                        });
                    } else {
                        silentByChild = false;
                        $("#tree_1").treeview('selectNode', parentNode.nodeId, {
                            silent : true
                        });
                        $("#tree_1").treeview('uncheckNode', parentNode.nodeId, {
                            silent : true
                        });
                    }
                }
            }
        }
    });
});

/**
 * 初始化只有大类的树的数组对象
 * @returns {Array}
 */
function getSecondTree() {
    var leftTree = [];
    for (var i = 0; i < objs.length; i++) {
        //创建大类节点进行初始化
        var bigNode = {};
        bigNode["text"] = objs[i].fromBigNodeName;
        //把大类放入树中
        leftTree.push(bigNode);
    }
    return leftTree;
}

/**
 * 定义大类规则的左边树
 */
$("#tree_2").treeview({
    data: getSecondTree(),
    multiSelect : false
});

/**
 * 获得大类规则右边的树的对象数组
 * @param node 选中的左边节点对象
 * @returns {Array}
 */
function getThirdTree(node) {
    var checkedNames;
    for (var i = 0; i < objs.length; i++) {
        if (node.text == objs[i].fromBigNodeName) {
            //记录下大类与大类关联的关系
            checkedNames = objs[i].toBigNodeNames;
        }
    }
    console.log("右边可选的大类是：" + checkedNames);
    var rightTree = [];
    for (var i = 0; i < checkedNames.length; i++) {
        var bigNode = {};
        bigNode["text"] = checkedNames[i];
        rightTree.push(bigNode);
    }
    return rightTree;
}

/**
 * 用于返回的存储规则对象的数组
 * @type {Array}
 */
var rules = new Array();
/**
 * 规则左边树的节点被选中后，需要初始化右边的树还有复选框
 */
$('#tree_2').on('nodeSelected', function(event, node) {
    console.log("已经点击了左边的节点：" + node.text);
    //初始化单个规则的对象
    var rule = new Object();
    var fromName = node.text;
    rule.fromBigNodeName = fromName;
    rule.options = [];
    //定义规则右边的树
    $("#tree_3").treeview({
        data: getThirdTree(node),
        multiSelect : false,
        onNodeSelected : function (event, node) {
            console.log("已经点击了右边的节点：" + node.text);
            var toName = node.text;
            rule.toBigNodeName = toName;
            if (fromName == toName) { // 如果左右选择的大类名称一致，则说明是在制定类内部规则
                $("#selectInfo").removeAttr("hidden");
            }
            rule.option = $("#rule").val();
            $("#rule").val(rule.option); // 初始化下拉框
            $("#rule").change(function () {
                rule.option = $("#rule").val();
            });
            // 还需要确保在rules数组中不重复
            for (var i = 0; i < rules.length; i++) {
                if (rule.fromBigNodeName == rules[i].fromBigNodeName && rule.toBigNodeName == rules[i].toBigNodeName) {
                    rules[i].option = $("#rule").val(); // 找到了rules中已经存在这条规则对象，直接更新其option
                } else { // 不存在规则条目直接加入数组
                    rules.push(rule);
                }
            }
            // //初始化复选框，先全部取消
            // $('input[name = "checkbox"]').each(function(){
            //     $(this).removeAttr("checked");
            // });
            // //再初始化已经勾选的
            // for (var i = 0; i < rules.length; i++) {
            //     if (fromName == rules[i].fromBigNodeName && toName == rules[i].toBigNodeName) {
            //         //找到对应的规则的对象rules[i]
            //         for (var j = 0; j < rules[i].options.length; j++) {
            //             $('[id = "' + rules[i].options[j] + '"]').attr("checked", "checked");
            //         }
            //     }
            // }
            // //点击勾选或者取消勾选某一项规则时
            // $('input[name = "checkbox"]').change(function () {
            //     var id_array = [];
            //     $('input[name = "checkbox"]:checked').each(function(){
            //         id_array.push($(this).val());
            //     });
            //     console.log("当前选中的规则是：" + id_array);
            //     //初始化完毕的当前规则对象
            //     for (var i = 0; i < id_array.length; i++) {
            //         rule.options[i] = id_array[i];
            //     }
            //     //还需要确保在rules数组中不重复
            //     for (var i = 0; i < rules.length; i++) {
            //         if (rule.fromBigNodeName == rules[i].fromBigNodeName && rule.toBigNodeName == rules[i].toBigNodeName) {
            //             rules[i].options = []; // 先初始化为空值
            //             //找到了rules中已经存在这条规则对象，直接更新其option
            //             for (var j = 0; j < id_array.length; j++) {
            //                 rules[i].options[j] = id_array[j];
            //             }
            //         } else {
            //             //不存在规则条目直接加入数组
            //             rules.push(rule);
            //         }
            //     }
            // });
        }
    });
});

/**
 * 用于存储几个大类的配置信息，最后一起发送
 * @type {Array}
 */
var bigNodeConfigArray = new Array();
/**
 * 初始化模态框的大类名称数据和大类配置的初始信息，并弹出模态框
 * @param data
 */
function initMyModal(data) {
    // data = 'a,b,c';
    var bigNodeNameArray = data.split(',');
    var html = '';
    for (var i = 0; i < bigNodeNameArray.length; i++) {
        html += '<option value="' + bigNodeNameArray[i] + '">' + bigNodeNameArray[i] + '</option>';
        //初始化配置对象，并加入数组
        var bigNodeConfig = new Object();
        bigNodeConfig.nodeName = bigNodeNameArray[i];
        bigNodeConfig.nodeType = null;
        bigNodeConfig.hardwareArchitecture = null;
        bigNodeConfig.operatingSystem = null;
        bigNodeConfig.flavorType = null;
        bigNodeConfig.imageName = null;
        bigNodeConfig.iconUrl = null;
        // bigNodeConfig.innerRules = [];
        bigNodeConfigArray.push(bigNodeConfig);
    }
    // console.log(bigNodeConfigArray);
    $("#bigNodeName").html(html);
    $("#bigNodeName").val('');
    $("#myModal").modal();
}

/**
 * 点击大类名字后，需要更新
 */
$("#bigNodeName").click(function () {
    //先找到数组中的对应对象
    for (var i = 0; i < bigNodeConfigArray.length; i++) {
        if (bigNodeConfigArray[i].nodeName == $("#bigNodeName").val()) {
            console.log("当前要操作的的大类是：" + $("#bigNodeName").val());
            //刷新当前大类下面的配置信息
            $("#nodeType").val(bigNodeConfigArray[i].nodeType);
            $("#hardwareArchitecture").val(bigNodeConfigArray[i].hardwareArchitecture);
            $("#operatingSystem").val(bigNodeConfigArray[i].operatingSystem);
            $("#nodeConfig").val(bigNodeConfigArray[i].flavorType);
            $("#nodeImage").val(bigNodeConfigArray[i].imageName);
            // // 初始化复选框，先全部取消
            // $('input[name = "inlineCheckbox"]').each(function(){
            //     $(this).removeAttr("checked");
            // });
            // //再初始化已经勾选的
            // for (var j = 0; j < bigNodeConfigArray[i].innerRules.length; j++) {
            //     $('[id = "' + bigNodeConfigArray[i].innerRules[j] + '"]').attr("checked", 'checked');
            // }
        }
    }
});

/**
 * 改变大类属性时要修改对应的数组中的对象的属性
 */
$("#bigNodeConfigOperation").change(function () {
    // console.log("当前操作的大类是：" + $("#bigNodeName").val());
    for (var i = 0; i < bigNodeConfigArray.length; i++) {
        if ($("#bigNodeName").val() == bigNodeConfigArray[i].nodeName) {
            //先找到数组中的对应对象，再对数组中的该对象进行修改
            bigNodeConfigArray[i].nodeType = $("#nodeType").val();
            bigNodeConfigArray[i].hardwareArchitecture = $("#hardwareArchitecture").val();
            bigNodeConfigArray[i].operatingSystem = $("#operatingSystem").val();
            bigNodeConfigArray[i].flavorType = $("#nodeConfig").val();
            bigNodeConfigArray[i].imageName = $("#nodeImage").val();
            // var id_array = [];
            // $('input[name = "inlineCheckbox"]:checked').each(function(){
            //     id_array.push($(this).val());
            // });
            // // console.log("当前选中的规则是：" + id_array);
            // for (var j = 0; j < id_array.length; j++) {
            //     bigNodeConfigArray[i].innerRules[j] = id_array[j];
            // }
            bigNodeConfigArray[i].iconUrl = "img/gaogui01.png";
            console.log("当前类的数据是：" + bigNodeConfigArray[i]);
        }
    }
});

/**
 * 点击主页提交
 */
$("#submit").click(function () {
    // initMyModal();
    //发送节点间链路的规则
    $.ajax({
        url: '/NetworkSimulation/submitRegulation',
        data: {
            // regulationOption : $("input[name='optionsRadiosinline']:checked").val(),//返回option1,option2,option3字符串
            linkJson : JSON.stringify(links),//返回改变过status的json
            s_id : $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {//返回'"A","B","C"'
            console.log("返回的大类名称是：" + msg);
            initMyModal(msg);
        },
        error: function () {

        }
    });
    //发送大类之间的规则
    $.ajax({
        url: '/NetworkSimulation/submitBigRules',
        data: {
            rulesJson : JSON.stringify(rules),//返回大类间的规则
            s_id : $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            console.log(msg);
        },
        error: function () {

        }
    });
});

/**
 * 点击模态框提交
 */
$("#addNode").click(function () {
    console.log(JSON.stringify(bigNodeConfigArray));
    $.ajax({
        url: '/NetworkSimulation/setBigNodeAttr',
        data: {
            bigNodeConfigArray : JSON.stringify(bigNodeConfigArray),
            s_id : $.getUrlParam("scenarioId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            $.alert(msg);
            $("#myModal").modal('hide');
        },
        error: function () {

        }
    });
});