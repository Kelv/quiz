var models = require('../models/models.js');

exports.load = function(req, res, next, quizId){
	// Precarga de las preguntas
	models.Quiz.find(
		{
			where: { id: Number(quizId)},
			include: [{ model: models.Comment}]
		}).then(
		function(quiz){
			if (quiz){
				req.quiz = quiz;
				next();
			} else { next(new Error('No existe quizId=' + quizId));}
		}
	).catch(function(error){next(error);});
};

exports.index = function(req, res){ 
	// Ir al indice de preguntas
	var search = (req.query.search || "");
	search = "%" + search + "%";
	search = search.replace(/ /g, '%');
	models.Quiz.findAll({ where: [ "pregunta like ?", search]}).then(function(quizes){
		res.render('quizes/index.ejs', { quizes: quizes, errors: []});
	});
};

exports.show = function(req, res){
	// Contestar la pregunta
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show', { quiz: req.quiz, errors: []});
	});
};

exports.answer = function(req, res){
	// Envio de respuesta
	models.Quiz.find(req.params.quizId).then(function(quiz){
		var resultado = 'Incorrecto';
		if (req.query.respuesta === req.quiz.respuesta){
			resultado = 'Correcto';
		}
		res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado,errors: []});
		
	});
};

exports.new = function(req, res){
	// Cargar formulario para nueva pregunta
	var quiz = models.Quiz.build(
		{ pregunta: "Pregunta", respuesta: "Respuesta"}
		);

	res.render('quizes/new', {quiz: quiz, errors: []});
};

exports.create = function(req, res){
	// Crear nueva pregunta
	var quiz = models.Quiz.build( req.body.quiz);

	var errors = quiz.validate();
	if (errors){
		var errs = new Array();
		var i = 0;
		for (var err in errors) {
			errs[i++] = {message: errors[err]};
		}
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
	// Editar la pregunta
	var quiz = req.quiz;

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

exports.update = function(req, res){
	// Actualizar pregunta y respuesta
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	var quiz = req.quiz;

	var errors = quiz.validate();
	if (errors){
		var errs = new Array();
		var i = 0;
		for (var err in errors) {
			errs[i++] = {message: errors[err]};
		}
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
	// Eliminar pregunta
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};

exports.credits = function(req, res){
	// Creditos
	res.render('author', { author: "Kelvin Rodriguez", errors: []});
};