
var express = require("express");
var session = require("express-session");
var router = require("./controller/router.js")
var app  = express();
app.listen(4000);console.log("开启");

app.set("view engine","ejs");
app.use(express.static("./public"));

//设置session
app.use(session({
    secret:"keyboard cat",
    resave:false,
    saveUninitialized:true
}));

app.get("/",router.showIndex);

app.get("/shopping",router.shoppingIndex);

app.get("/my",router.myIndex);

//登录注册页面
app.get("/lr",router.LRindex);

//注册请求
app.get("/regist",router.doregist);

//处理登录请求
app.get("/login",router.dologin);

//处理退出登录页面
app.get("/exist",router.exist);
