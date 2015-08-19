//var models = require("../models/models.js");

exports.loginRequired = function(req, res, next){
	if (req.session.user){
		next();
	} else{
		res.redirect('/login');
	}
};


exports.new = function(req, res){
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors: errors});
};

exports.create = function(req, res){

	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user){
		if(error){
			req.session.error = [{"message": "Se ha producido un error: "+error}];
			res.redirect("/login");
			return;
		}

		req.session.user = { id:user.id, username: user.username};
		req.session.time = Date.now();
		res.redirect(req.session.redir.toString());
	})
};

exports.destroy = function(req, res){
	delete req.session.user;
	res.redirect(req.session.redir.toString());
}

exports.tw = function(req, res, next){
	if (req.session.user){
		var now = Date.now();
		if ((now - req.session.time) > 120000){
			delete req.session.user;
			delete req.session.time;
		}else{
			req.session.time = now
		}
	}
	next();
};