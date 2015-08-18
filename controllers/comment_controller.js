var models = require('../models/models.js');

exports.new = function(req, res){
	res.render('comments/new.ejs', { quizid: req.params.quizId, errors: []});
};

exports.create = function(req, res){
	var comment = models.Comment.build(
		{ texto: req.body.comment.texto,
			QuizId: req.params.quizId
		});

	var errors = comment.validate();
	if (errors) {
		var errs = new Array();
		var i = 0;
		for(var err in errors){
			errs[i++] = erros[err];
		}
		res.render('quizes/new', { quiz: quiz, errors: errs});
	} else {
		comment
		.save()
		.then( function(){ res.redirect('/quizes/'+req.params.quizId)});
	}
};