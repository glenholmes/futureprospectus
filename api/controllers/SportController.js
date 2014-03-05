/**
 * SportController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	'new': function(request, respond){
		// show new.ejs view
		respond.view();
	},

	index: function(request, respond, next){
		Sport.find().exec(function (err, sports){
			if(err) return next(err);
			
			//pass all sports to view
			respond.view({
				sports: sports
			});
		});
	},

	studentnew: function(request, respond, next){
		Sport.find().exec(function (err, sports){
			if(err) return next(err);
			
			//pass all sports to view
			respond.view({
				sports: sports
			});
		});
	},

	studentcreate : function(request, respond, next){
		// console.log(request.params.all());
		var selectedSports = request.param('idSports');
		for (var i = 0; i < selectedSports.length; i++) {
			Studentsport.create(
				{Sports_idSports : selectedSports[i], Students_User_idUser : request.session.User.idUser},
				function(err, studentsport){
				if(err) return next(err);
			});
			// console.log("UserID : " + request.session.User.idUser + ", SportID : " + selectedSports[i]);
		};
		// console.log(selectedSports);
		respond.redirect("/student/profile/"+request.session.User.idUser);
	},

	studentshow : function(request, respond, next){
		//console.log(request.params.all());
		Studentsport.query(
		 	"select Student_Sport.Sports_idSports, Student_Sport.Students_User_idUser, Sports.S_name"
		 	+ " from Student_Sport"
		 	+ " JOIN Sports ON Student_Sport.Sports_idSports = Sports.idSports"
		 	+ " where Student_Sport.Students_User_idUser = '"+request.param('id')+"';"
		 	, function(err, studentsports){
			if(err) return next (err);
		 	//console.log(studentsports);

			respond.json({
			 	studentsports : studentsports
			});
		});
	},

	institutenew: function(request, respond, next){
		Sport.find().exec(function (err, sports){
			if(err) return next(err);
			
			//pass all sports to view
			respond.view({
				sports: sports
			});
		});
	},

	institutecreate : function(request, respond, next){
		// console.log(request.params.all());
		var selectedSports = request.param('idSports');
		for (var i = 0; i < selectedSports.length; i++) {
			Institutesport.create(
				{Sports_idSports : selectedSports[i], Institutes_idInstitutes : request.session.User.idUser},
				function(err, institutesport){
				if(err) return next(err);
			});
			// console.log("UserID : " + request.session.User.idUser + ", SportID : " + selectedSports[i]);
		};
		// console.log(selectedSports);
		respond.redirect("/institute/show/"+request.session.User.idUser);
	},

	instituteshow : function(request, respond, next){
		console.log(request.params.all());
		Institutesport.query(
		 	"select Institute_Sport.Sports_idSports, Institute_Sport.Institutes_idInstitutes, Sports.S_name"
		 	+ " from Institute_Sport"
		 	+ " JOIN Sports ON Institute_Sport.Sports_idSports = Sports.idSports"
		 	+ " where Institute_Sport.Institutes_idInstitutes = '"+request.param('id')+"';"
		 	, function(err, institutesports){
			if(err) return next (err);
		 	//console.log(institutesports);

			respond.json({
			 	institutesports : institutesports
			});
		});
	}
};
