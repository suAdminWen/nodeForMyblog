var express = require('express');
var router = express.Router();
var User = require('../modules/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/login', function (req, res) {
	res.render('login');
});

router.post('/login', function (req, res) {
    if (!(req.body['username']) || !(req.body['password'])){
        req.flash("error", '用户名或密码不能为空！');
        return res.redirect("/users/login");
    }
    User.get(req.body['username'], function (err, user) {
		if(!user){
            req.flash("error", '用户名不存在！');
            return res.redirect("/users/login");
		}
		if(user.password != req.body["password"]){
            req.flash("error", '输入密码不正确！');
            return res.redirect("/users/login");
		}else{
			req.session.user = user;
			req.flash("success", "登录成功！");
            return res.redirect("/");
		}
    });
});

router.get('/logout', function (req, res) {
	req.session.user = null;
	req.flash("success", "安全登出！");
	res.redirect("/")
});


router.get('/registered', function(req, res){
	res.render('registered');
});

router.post('/registered', function(req, res){
	if (!(req.body['username'])){
		req.flash("error", '用户名不能为空！');
        return res.redirect("/users/registered");
	}
	var user = new User({
		name: req.body['username'],
		password: req.body['password'],
	});

	// 检查用户是否存在
	User.get(user.name, function(err, has_user){
		if(has_user){
			err = { "errmsg": "用户已存在"};
		}
		if(err){
			req.flash("error", err.errmsg);
			return res.redirect("/users/registered");
		}

		// 保存新用户
		user.save(function(err){
			if(err){
				req.flash("error", err.errmsg);
				return res.redirect("/users/registered");
			}
			req.flash("success", "注册成功！");
			res.redirect("/users/login");
		});
	});
});

module.exports = router;
