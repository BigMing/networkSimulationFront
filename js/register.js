/**
 * Created by sjm on 2017/6/8.
 */
document.getElementById("login").onclick=function () {
    var passwd1 = document.getElementById("passwd1").value;
    var passwd2 = document.getElementById("passwd2").value;
    if (passwd1 == passwd2){
        //发请求
        alert("注册成功");
    } else {
        alert("密码输入有误，请重新输入");
    }
}

