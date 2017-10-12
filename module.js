// 引入核心模块
var fs = require("fs");
var filePath = "./data.json";
var mmodule = module.exports;
// 查询所有语句
mmodule.getAllData = function(callback) {
    fs.readFile(filePath, function(err, data) {
        if (err) {
            return callback(err);
        }
        callback(null, JSON.parse(data.toString()));
    });
}

// 根据id查询数据
mmodule.getDataById = function(id, callback) {
    this.getAllData(function(err, obj) {
        if (err) {
            return callback(err);
        }
        // 查出其id的数据
        for (var i = 0; i < obj.heros.length; i++) {
            if (id == obj.heros[i].id) {
                callback(null, obj.heros[i]);
                break;
            }
        }
    });
}

// 添加数据
mmodule.add = function(addObj, callback) {
    this.getAllData((err, obj) => {
        if (err) {
            return callback(err);
        }
        // 找到最后一条数据的id
        var id = obj.heros[obj.heros.length - 1] ? obj.heros[obj.heros.length - 1].id + 1 : 1;
        // 将id添加到要新增的对象中去
        addObj.id = id;
        // 将对象添加到data.json中去
        obj.heros.push(addObj);
        // 将对象重新写入到data.json中
        fs.writeFile(filePath, JSON.stringify(obj, null, "  "), function(err) {
            if (err) {
                return callback(err);
            }
            callback();
        });
    });
};

// 修改数据
mmodule.edit = function(editObj, callback) {
    // 得到所有数据
    this.getAllData(function(err, obj) {
        if (err) {
            return callback(err);
        }
        // 根据对应的id获取到要修改的数据
        for (var i = 0; i < obj.heros.length; i++) {
            if (editObj.id == obj.heros[i].id) {
                // 将新对象的值设置给老对象
                obj.heros[i] = editObj;
                break;
            }
        }
        // 将对象重新写入data.json中
        fs.writeFile(filePath, JSON.stringify(obj, null, "  "), function(err) {
            if (err) {
                return callback(err);
            }
            callback();
        });
    });
}


// 删除数据
mmodule.delData = function(id, callback) {
    // 得到所有数据
    this.getAllData(function(err, obj) {
        if (err) {
            return callback(err);
        }
        // 查出其id的数据
        for (var i = 0; i < obj.heros.length; i++) {
            if (id == obj.heros[i].id) {
                // 删除该数据
                obj.heros.splice(i, 1);
                break;
            }
        }
        // 将对象重新写入data.json中
        fs.writeFile(filePath, JSON.stringify(obj, null, "  "), function(err) {
            if (err) {
                return callback(err);
            }
            callback();
        });
    });

}