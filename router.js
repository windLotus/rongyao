var fs = require("fs");
var handler = require("./handler.js");

//路由：分发请求（根据不同的请求，响应不同的内容到浏览器）
module.exports = function(req, res) {
    //如果将为用户请求的根目录，我们将首页返回到浏览器
    var url = req.url;
    //得到当的请求方式：
    var method = req.method;
    //判断请求
    //处理首页的请求
    if (method == "GET" && url == "/") {
        handler.getIndex(req, res);
    } else if (method == "GET" && url == "/add") {
        handler.getAdd(req, res);
    } else if (method == "POST" && url == "/add") {
        handler.postAdd(req, res);
    } else if (method == "POST" && url == "/upload") {
        handler.postUpload(req, res);
    } else if (method == "GET" && url.indexOf("/node_modules") != -1 || url.indexOf("/img") != -1) {
        handler.getStatic(req, res);
    } else {
        handler.get404(req, res);
    }
}