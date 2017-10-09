//创建一个服务器
var http = require("http");
var fs = require("fs");
var template = require("art-template");
//引用定义好的render模块
var render = require("./render.js");
//引用定义好的router模块
var router = require("./router.js");
var server = http.createServer();
server.on("request", function(req, res) {
    //将render方法注册到res对象中
    render(res);
    //设置路由
    router(req, res);
});
server.listen(3000, function() {
    console.log("running");
});