/**
 * Created by sjm on 2017/6/23.
 */
//定义定时任务的对象
var t1 = undefined;
var t2 = undefined;

//点击开始动态变化
var flag = 0;
// $("#startMove").click(function () {
//     alert("开始变化");
//     //定时任务
//     t1 = setInterval(function () {
//         var elements = scene.getDisplayedElements();
//         for (var i = 0; i < elements.length; i++){
//             if (elements[i] instanceof JTopo.Link){
//                 if (flag++ %2 == 0){
//                     changeLink(elements[i]);
//                 } else {
//                     changeLink1(elements[i]);
//                 }
//             }
//         }
//     },1000);
// });

//修改链路的显示
function changeLinkToRed(link) {
    link.fontColor = "0,0,0";
    link.lineWidth = 3; // 线宽
    // link.dashedPattern = dashedPattern; // 虚线
    link.bundleOffset = 60; // 折线拐角处的长度
    link.bundleGap = 20; // 线条之间的间隔
    link.textOffsetY = 3; // 文本偏移量（向下3个像素）
    link.strokeColor = "255,0,0"; //红色
    link.arrowsRadius = 10;
}
function changeLinkToBlue(link) {
    link.fontColor = "0,0,0";
    link.lineWidth = 3; // 线宽
    // link.dashedPattern = dashedPattern; // 虚线
    link.bundleOffset = 60; // 折线拐角处的长度
    link.bundleGap = 20; // 线条之间的间隔
    link.textOffsetY = 3; // 文本偏移量（向下3个像素）
    link.strokeColor = "0,0,255"; //颜色
    link.arrowsRadius = 10;
}

//点击停止动态变化
$("#stopMove").click(function () {
   window.clearInterval(t1);
   window.clearInterval(t2);
   t1 = undefined;
   t2 = undefined;
   alert("停止变化");
});