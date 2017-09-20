/**
 * Created by sjm on 2017/6/8.
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

var scenarioList = [];
var scenarioId = [];
var scenarioStatus = [];

//解析场景对象列表的json
function praseScenarioList(data) {
    scenarioList = [];
    scenarioId = [];
    scenarioStatus = [];
    var objs = jQuery.parseJSON(data);
    for (var i = 0; i < objs.length; i++){
        scenarioList[i] = objs[i].scenarioName;
        scenarioId[i] = objs[i].s_id;
        scenarioStatus[i] = objs[i].scenarioStatus;
    }
}

//新建场景
$("#add").click(function () {
   $("#myModal").modal();
});

//预读
$(document).ready(function(){
    initProject();
    $.ajax({
        url: '/NetworkSimulation/selectScenarioList',
        data: {
            p_id : $.getUrlParam("projectId")
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
          //  alert(msg);
            praseScenarioList(msg);
        },
        error: function () {

        }
    });
    initScenarioList();
});

//初始化工程属性
function initProject() {
    $("#projectName").val($.getUrlParam("projectName"));
    $("#projectId").val($.getUrlParam("projectId"));
}

//初始化场景列表
function initScenarioList() {
    areaCont = "";
    for (var i = 0; i < scenarioList.length; i++){
        areaCont += '<option onClick="selectP(' + i + ');">' + scenarioList[i] + '</option>';
    }
    $("#selectScenario").html(areaCont);
}

//选中场景后
function selectP(i) {
    if (scenarioStatus[i] == 0) {
        //如果是运行状态的场景
        $("#delScenatio").removeAttr("disabled");
        $("#editScenario").removeAttr("disabled");
        $("#suspendScenatio").removeAttr("disabled");
        $("#recoverScenatio").attr("disabled", "disabled");
    }
    if (scenarioStatus[i] == 1) {
        //挂起状态的
        $("#recoverScenatio").removeAttr("disabled");
        $("#delScenatio").attr("disabled", "disabled");
        $("#editScenario").attr("disabled", "disabled");
        $("#suspendScenatio").attr("disabled", "disabled");
    }
    //打开场景编辑器
    $("#editScenario").click(function () {
        window.open(encodeURI("index3.html?scenarioId=" + scenarioId[i] + "&scenarioName=" + scenarioList[i] + "&projectName=" + $("#projectName").val()));
    });
    //挂起场景
    $("#suspendScenatio").click(function () {
        $.ajax({
            url: '/NetworkSimulation/keepScenario',
            data: {
                s_id : scenarioId[i]
            },
            type: 'post',
            dataType: 'json',
            async: false,
            success: function (msg) {
                alert(msg);
                //刷新当前页面
                window.location.reload();
                opener.location.reload();
            },
            error: function () {

            }
        });
    });
    //恢复场景
    $("#recoverScenatio").click(function () {
        $.ajax({
            url: '/NetworkSimulation/recoverScenario',
            data: {
                s_id : scenarioId[i]
            },
            type: 'post',
            dataType: 'json',
            async: false,
            success: function (msg) {
                alert(msg);
                //刷新当前页面
                window.location.reload();
                opener.location.reload();
            },
            error: function () {

            }
        });
    });
    //删除场景
    $("#delScenatio").click(function () {
        $.confirm({
            title: '请确认！',
            content: '是否完全删除场景？',
            buttons: {
                yes: {
                    text: '是',
                    btnClass: 'btn-red',
                    action: function(){
                        $.alert('完全删除云平台中的场景及数据');
                        $.ajax({
                            url: '/NetworkSimulation/deleteScenario',
                            data: {
                                s_id : scenarioId[i]
                            },
                            type: 'post',
                            dataType: 'json',
                            async: false,
                            success: function (msg) {
                                alert(msg);
                                //刷新当前页面
                                window.location.reload();
                                opener.location.reload();
                            },
                            error: function () {

                            }
                        });
                    }
                },
                no: {
                    text: '否',
                    btnClass: 'btn-blue',
                    action: function(){
                        $.alert('保留数据库中场景数据');
                        $.ajax({
                            url: '/NetworkSimulation/keepScenario',
                            data: {
                                s_id : scenarioId[i]
                            },
                            type: 'post',
                            dataType: 'json',
                            async: false,
                            success: function (msg) {
                                alert(msg);
                                //刷新当前页面
                                window.location.reload();
                                opener.location.reload();
                            },
                            error: function () {

                            }
                        });
                    }
                }
            }
        });
    });
}

//编辑工程属性提交
$("#editProject").click(function () {
    $.ajax({
        url: '/NetworkSimulation/editProject',
        data: {
            p_id : $.getUrlParam("projectId"),
            projectName : $("#projectName").val()
        },
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (msg) {
            alert(msg);
            //刷新当前页面
            location.herf = encodeURI("projectEdit.html?projectId=" + $.getUrlParam("projectId") + "&projectName=" + $("#projectName").val());
        },
        error: function () {

        }
    });
});

//添加场景提交
$("#addScenario").click(function () {
    $.ajax({
        url: '/NetworkSimulation/createScenario',
        data: {
            scenarioName : $("#scenarioName").val(),
            scenarioType : $("#scenarioType").val(),
            p_id : $.getUrlParam("projectId")
        },
        type: 'get',
        dataType: 'json',
        async: false,
        success: function (msg) {
            alert(msg);
            //刷新当前页面
            $("#myModal").hide();
            window.location.reload();
            // opener.location.reload()刷新父窗口对象（用于单开窗口）
        },
        error: function () {

        }
    });
});