var fs = require("fs");

// 引入模块
var path = require('path');
var url = require('url');

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
            var id = parseInt(objData.heros[objData.heros.length - 1].id) + 1;
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

// 查看修改页面数据回显
module.exports.getEdit = function(req, res) {
    // 得到修改页面
    var editUrl = req.url;
    // 截取链接中的参数
    var id = url.parse(editUrl, true).query.id;
    // 读取数据库的信息
    fs.readFile("./data.json", function(err, objStr) {
        if (err) {
            return res.end('404 not found');
        }
        // 将数据库返回的字符串转换为json数据，获取数据中的数组
        var objArr = JSON.parse(objStr.toString()).heros;
        var obj = {};
        // 遍历数组获取数据
        for (var i = 0; i < objArr.length; i++) {
            // 找id相匹配的数据
            if (objArr[i].id == id) {
                obj = objArr[i];
                break;
            }
        }
        // 将数据从后台返回至前台渲染数据
        res.render("edit", obj, function(err, html) {
            if (err) {
                res.end("404 not found");
            }
            res.end(html);
        });
    });
}

// 保存修改数据页面
module.exports.postEdit = function(req, res) {
    // 接受参数
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        // 根据id找到原本的数据
        fs.readFile("./data.json", function(err, data) {
            // 获取数据数组
            var arr = JSON.parse(data.toString()).heros;
            // 获取图片名
            fields.img = path.basename(fields.img);
            // 遍历数组获取相同id的数据
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].id == fields.id) {
                    arr[i] = fields;
                    break;
                }
            }
            // 重新将数组转为一个对象
            var resObj = {
                    heros: arr
                }
                // 重新将数据提交至data.json中去
            var returnObj = {};

            fs.writeFile('./data.json', JSON.stringify(resObj, null, "  "), function(err) {
                if (err) {
                    returnObj.status = 1;
                    returnObj.msg = "修改失败";
                } else {
                    returnObj.status = 0;
                    returnObj.msg = "修改成功";
                }
                res.end(JSON.stringify(returnObj));
            });
        });
    });
}

// 删除数据
module.exports.getDel = function(req, res) {
    // 获取有id参数的链接
    var urlDel = req.url;
    //截取要删除的id
    var id = url.parse(urlDel, true).query.id;
    fs.readFile("./data.json", function(err, data) {
        var obj = JSON.parse(data.toString());
        var arr = obj.heros;
        for (var i = 0; i < arr.length; i++) {
            // 在数据库中找相匹配的id数据
            if (arr[i].id == id) {
                // 将数据从数据库中删除
                arr.splice(i, 1);
                break;
            }
        }
        var returnObj = {};
        // 重新将数据写进数据库中去
        fs.writeFile("./data.json", JSON.stringify(obj, null, "  "), function(err) {
            if (err) {
                returnObj.status = 1;
                returnObj.msg = "删除失败";
            } else {
                returnObj.status = 0;
                returnObj.msg = "删除成功";
            }
            res.end(JSON.stringify(returnObj));
        })
    })
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