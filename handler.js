var fs = require("fs");

// 引入模块
var path = require('path');

//引用formidable(用来帮助我们进行上传文件的第三方包)
var formidable = require("formidable");

//用来处理具体的请求逻辑
module.exports.getIndex = function(req, res) {
    fs.readFile("./data.json", function(err, data) {
        if (err) {
            return res.end("404 not find");
        }
        res.render("index", JSON.parse(data.toString()), function(err1, html) {
            if (err1) {
                return res.end("404 not find");
            }
            res.end(html);
        });
    })
}
module.exports.getAdd = function(req, res) {
    res.render("add", null, function(err1, html) {
        if (err1) {
            return res.end("404 not find");
        }
        res.end(html);
    });
}
module.exports.postAdd = function(req, res) {
    //创建一个formideble对象
    var form = new formidable.IncomingForm();

    //由于formideble会自动将文件保存在一个临时目录下，所以我们需要将保存的路径进行修改：/img
    form.uploadDir = "./img/";
    //保留文件的扩展名
    form.keepExtensions = true;

    form.parse(req, function(err, fields, files) {
        //得到图片名称
        // console.log(fields);
        var obj = {
            img: path.basename(fields.img),
            name: fields.name,
            gender: fields.gender
        };
        //得到id，
        //1.0将data.json中的所有文件全部读取出来
        fs.readFile("./data.json", function(err, oobj) {
            if (err) {
                return res.end("404");
            }
            var objData = JSON.parse(oobj.toString());
            //2.0取出最后一条数据的id属性
            var id = objData.heros[objData.heros.length - 1].id + 1;
            obj.id = id;
            //3.0将新增的数据添加到objdata的heros中
            objData.heros.push(obj);
            //将对象转为字符串才能写入到data.json中
            var resStr = JSON.stringify(objData, null, "  ");
            //4.0重新将数据写入到data.json中
            fs.writeFile("./data.json", resStr, function(err1) {
                var returnObj = {};
                if (err1) {
                    // return res.end("新增失败");
                    returnObj.statu = 1;
                    returnObj.msg = "新增失败";
                } else {
                    returnObj.statu = 0;
                    returnObj.msg = "新增成功";
                }
                res.end(JSON.stringify(returnObj));
            });
        });
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
        // console.log(files);

        //将文件的名称返回到浏览器
        if (err) {
            obj.status = 1;
            obj.msg = "上传失败";
        } else {
            obj.status = 0;
            obj.msg = "上传成功";
            obj.src = path.basename(files.img.path); //获取图片名称
        }
        res.end(JSON.stringify(obj));
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