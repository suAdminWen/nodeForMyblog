var mongodb = require('./db');

function User(user){
	this.name = user.name;
	this.password = user.password;
}

module.exports = User;

User.prototype.save = function save(callback){

	var user = {
		name: this.name,
		password: this.password
	};

	mongodb.open(function(err, db){
		if (err){
			return callback(err);
		}
		db.collection('users', function(err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			// 将name属性添加为索引
			collection.ensureIndex('name', {unique: true});
			// 写入新用户到文档
			collection.insert(user, function(err, user){
				mongodb.close();
				callback(err, user);
			});
		});

	});

};


User.get = function get(username, callback){

	mongodb.open(function(err, db){
		if (err){
			return callback(err);
		}

		db.collection('users', function(err, collection){
		    if(err) {
                mongodb.close();
                return callback(err);
            }
			collection.findOne({name: username}, function(err, doc){

		        // 对数据库操作完成之后，及时关闭数据库
			    mongodb.close();

                // 如果同名的用户存在，那么就直接返回这个用户信息
				if(doc){
					return callback(err, doc);
				}else{
					return callback(err, null);
				}
			});

		});
	});
};