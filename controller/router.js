
var db = require("../model/db.js");
var md5 = require("../model/md5.js");
var gm = require("gm");
var fs = require("fs");
var formidable = require("formidable");
var path =require("path");
var ObjectId = require("mongodb").ObjectID;

//首页
exports.showIndex = function(req,res){
    var uname = req.session.username;
    db.find("shop",{},{"pageSize":"","page":"","sort":{"_id":-1}},function(err,result){
        if(err){
            console.log(err);
            return;
        };
        //console.log(result);
        if(uname){
            res.render("index_1", {"shops": result,"uname": uname});
        }else{
            res.render("index",{"shops": result});
        };
    });
};

//购物车页面
exports.shoppingIndex = function(req,res){
    var uname = req.session.username;
    db.find("shop",{},{"pageSize":"","page":"","sort":{"_id":-1}},function(err,result){
        if(err){
            console.log(err);
            return;
        };
        //console.log(result);
        if(uname){
            res.render("shopping_1", {"shops": result});
        }else{
            res.render("shopping",{"shops": result});
        };
    });
}

//我的页面
exports.myIndex = function(req,res){
    var uname = req.session.username;
        if(uname){
            res.render("my_1", {"uname": uname});
        }else{
            res.render("my", {"uname": uname});
        };
};

//登录注册页面
exports.LRindex = function(req,res){
    res.render("login_regist")
};

//注册请求
exports.doregist = function(req,res){
    var uname = req.query.uname;
    var pwd = req.query.password
    //console.log(uname,pwd)

    //    根据用户名查找用户是否已被用
    db.find("user",{"uname":uname},function(err,result){
        if(err){
            console.log(err);
            return;
        };
        if(result.length != 0){
            res.redirect("/lr")//已有用户名

        }else {
            //    将明文转密文
            pwd = md5(pwd);
            inserObj = {"uname": uname, "pwd": pwd};
            //插入数据库
            db.insertOne("user", inserObj, function (err, result) {
                if (err) {
                    console.log(err);
                    res.send("err");
                    return;
                }
                ;
                //记录登录
                req.session.username = uname;
                req.session.login = "1";
                res.redirect("/");
            });
            //    一注册创建默认头像在avactor
            gm("./public/avactor/jd.png").crop(150, 150, 0, 0).write("./public/avactor/" + uname + ".jpg", function (err) {
                if (err) {
                    console.log("剪切失败", err);
                    return;
                }
                //console.log("剪切成功");
            });
        };
    });
};

//处理登录请求
exports.dologin = function(req,res){
    var uname = req.query.uname;
    var pwd = req.query.password;
    //console.log(uname,pwd);

    db.find("user",{"uname":uname},function(err,result){
        if(err){
            console.log(err);
            return;
        };
        //console.log(result);
        if(result.length == 0){
            res.redirect("/lr");//用户名不存在
            return;
        };
        //    若用户存在
        var oldpwd = result[0].pwd;
        if(oldpwd == md5(pwd)){
            //    密码正确 登录成功 记录登录
            req.session.username = result[0].uname;
            req.session.login = "1";
            res.redirect("/")
        }else{
            res.redirect("/lr")//密码错误
        }
    });
};

//处理退出登录请求
exports.exist = function(req,res){
    req.session.username = "";
    req.session.login = 0;
    res.redirect("/")
}