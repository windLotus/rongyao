var fs = require("fs");

// 引入模块
var path = require('path');
var url = require('url');

//引用formidable(用来帮助我们进行上传文件的第三方包)
var formidable = require("formidable");
var mmodule = require("./module.js");

//用来处理具体的请求逻辑
module.exports.getIndex = function(req, res) {
    mmodule.getAllData(function(err, obj) {
        if (err) {
            return res.end("404 not found");
        }
        res.render("index", obj, function(err, html) {
            res.end(html);
        });
    })
}
module.exports.getAdd = function(req, res) {
    res.render("add", null, function(err1, html) {
        if (err1) {
            return res.end("404 not found");
        }
        res.end(html);
    })
}
module.exports.postAdd = function(req, res) {
    //创建一个formideble对象
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) {
            return res.end(returnObj(1, "fail"));
        }
        // 去掉名称前面的img
        fields.img = path.basename(fields.img);
        var isTure = mmodule.add(fields, function(err) {
            if (err) {
                return res.end(returnObj(1, "fail"));
            }
            res.end(returnObj());
        })
    });
}
module.exports.postUpload = function(req, res) {
    //创建一个formideble对象
    var form = new formidable.IncomingForm();
    //由于formideble会自动将文件保存在一个临时目录下，所以我们需要将保存的路径进行修改：/img
    form.uploadDir = "./img/";
    //保留文件的扩展名
    form.keepExtensions = true;
    var obj = {};
    form.parse(req, function(err, fields, files) {
        if (err) {
            return res.end(returnObj(1, "fail"));
        } else {
            res.end(returnObj(0, "success", path.basename(files.img.path)));
        }
    });
}

// 查看修改页面数据回显
module.exports.getEdit = function(req, res) {
    // 得到修改页面
    var editUrl = req.url;
    // 截取链接中的参数
    var id = url.parse(editUrl, true).query.id;

    mmodule.getDataById(id, function(err, obj) {
        if (err) {
            return res.end("404");
        }
        res.render("edit", obj, function(err, html) {
            res.end(html);
        });
    });

}

// 保存修改数据页面
module.exports.postEdit = function(req, res) {
    // 接受参数
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (err) {
            return res.end(returnObj(1, "fail"));
        }
        fields.img = path.basename(fields.img);
        mmodule.edit(fields, function(err) {
            if (err) {
                return res.end(returnObj(1, "fail"));
            }
            res.end(returnObj());
        })
    });
}

// 删除数据
module.exports.getDel = function(req, res) {
    // 获取有id参数的链接
    var urlDel = req.url;
    //截取要删除的id
    var id = url.parse(urlDel, true).query.id;
    mmodule.delData(id, function(err, obj) {
        if (err) {
            return res.end("404");
        }
        res.end(returnObj());
    });
}

module.exports.getStatic = function(req, res) {
    //单独处理静态资源
    var url = "." + req.url;
    fs.readFile(url, function(err, data) {
        if (err) {
            return res.end("404 not found");
        }
        res.end(data);
    });
}
module.exports.get404 = function(req, res) {
    res.end("404 not found");
}

function returnObj(status, msg, src) {
    var obj = {
        status: status || 0,
        msg: msg || "success",
        src: src || ""
    }
    return JSON.stringify(obj);
}