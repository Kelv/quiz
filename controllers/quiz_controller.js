var models = require('../models/models.js');

exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId).then(
		function(quiz){
			if (quiz){
				req.quiz = quiz;
				next();
			} else { next(new Error('No existe quizId=' + quizId));}
		}
	).catch(function(error){next(error);});
};

exports.index = function(req, res){ 
	var search = (req.query.search || "");
	search = "%" + search + "%";
	search = search.replace(/ /g, '%');
	models.Quiz.findAll({ where: [ "pregunta like ?", search]}).then(function(quizes){
		res.render('quizes/index.ejs', { quizes: quizes, errors: []});
	});
};

exports.show = function(req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show', { quiz: req.quiz, errors: []});
	});
};

exports.answer = function(req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		var resultado = 'Incorrecto';
		if (req.query.respuesta === req.quiz.respuesta){
			resultado = 'Correcto';
		}
		res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado,errors: []});
		
	});
};

exports.new = function(req, res){
	var quiz = models.Quiz.build(
		{ pregunta: "Pregunta", respuesta: "Respuesta"}
		);

	res.render('quizes/new', {quiz: quiz, errors: []});
};

exports.create = function(req, res){
	var quiz = models.Quiz.build( req.body.quiz);

	var errors = quiz.validate();
	if (errors){
		var errs = new Array();
		console.log(errors);
		var i = 0;
		for (var err in errors) {
			errs[i++] = {message: errors[err]};
			console.log(errors[err]);
		}
		console.log(errs);
		res.render('quizes/new', {quiz: quiz, errors: errs});
	}else{
		quiz
		.save({fields: ["pregunta", "respuesta", "tema"]})
		.then(function(){
			res.redirect('/quizes');
		});
	}	
};

exports.edit = function(req, res){
	var quiz = req.quiz;

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	var quiz = req.quiz;

	var errors = quiz.validate();
	if (errors){
		var errs = new Array();
		console.log(errors);
		var i = 0;
		for (var err in errors) {
			errs[i++] = {message: errors[err]};
			console.log(errors[err]);
		}
		console.log(errs);
		res.render('quizes/new', {quiz: quiz, errors: errs});
	}else{
		quiz
		.save({fields: ["pregunta", "respuesta", "tema"]})
		.then(function(){
			res.redirect('/quizes');
		});
	}	
};

exports.destroy = function(req, res){
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};

exports.credits = function(req, res){
	res.render('author', { author: "Kelvin Rodriguez", errors: []});
};