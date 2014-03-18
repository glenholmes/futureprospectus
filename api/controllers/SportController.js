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

	//create a sport
	create: function(request, respond, next){
		Sport.query("insert into Sports values (default, '" + request.param('S_name') + "')",
			function sportCreated (err, sport){
			//if an error occurs
			if (err) {
				// log error
				console.log(err);
				request.session.flash = {
					err: ["Cannot create sport"]
				}
				// redirect back to page
				return respond.redirect('/sport/sportadmin');
			}
			//if sport is created sucessfully
			//respond.json(sport);
			//console.log(sport);
			
			//request.session.Sport = sport;
			respond.redirect('/sport/sportadmin');
		});
	},

	sportadmin: function(request, respond, next){
		Sport.find().sort('S_name').exec(function (err, sports){
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
		if(request.param('idSports') == undefined){
			respond.redirect('/sport/studentcreate/'+request.param('id'));
		} else {
			var selectedSports = request.param('idSports');
			//only one sport selected
			if(selectedSports[0].length <=1 ){
				Studentsport.create(
					{Sports_idSports : selectedSports,
						Students_User_idUser : request.session.User.idUser},
					function(err, studentsport){
					if(err) return next(err);
				});
			// more than one sport selected
			} else {
				for (var i = 0; i < selectedSports.length; i++) {
					Studentsport.create(
						{Sports_idSports : selectedSports[i],
							Students_User_idUser : request.session.User.idUser},
						function(err, studentsport){
						if(err) return next(err);
					});
					// console.log("UserID : " + request.session.User.idUser + ", SportID : " + selectedSports[i]);
				}
			}
		}

		Student.update({User_idUser : request.param('id')},
			{S_Interests: 'A'}, function(err){
			if(err){
				request.session.flash = {
					err: ["Sport : Update: Error"]
				}
				// redirect back to page
				return respond.redirect('/error/index');
			}
			respond.redirect("/student/profile/"+request.param('id'));
		});
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

	clear : function(request, respond, next){
		Studentsport.query("delete from Student_Sport where "+
			"Students_User_idUser = '"+request.param('id')+"';", function(err){
				if(err){
					request.session.flash = {
						err: ["Cannot clear sports values."]
					}
					// redirect back to page
					return respond.redirect('/error/index');
				}
				Student.update({User_idUser : request.param('id')},
					{S_Interests: null}, function(err){
					if(err){
						request.session.flash = {
							err: ["Sport : Update: Error"]
						}
						// redirect back to page
						return respond.redirect('/error/index');
					}
					respond.redirect("/student/profile/"+request.param('id'));
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
		var cur_ins = request.param('id');
		Institutesport.destroy({Institutes_idInstitutes : cur_ins}, function(err){
			if(err){
				console.log("Error:" + err);
			};
		});

		var selectedSports = request.param('idSports');
		for (var i = 0; i < selectedSports.length; i++) {
			Institutesport.create(
				{Sports_idSports : selectedSports[i], Institutes_idInstitutes :cur_ins},
				function(err, institutesport){
				if(err) return next(err);
			});
		};
		respond.redirect("/institute/show/"+cur_ins);
	},

	instituteshow : function(request, respond, next){
		Institutesport.find({Institutes_idInstitutes : request.session.User.idUser},
		 	function(err, institutesports){
			if(err) return next (err);
			respond.json({
			 	institutesports : institutesports
			});
		});
	},

	destroy: function (request, respond, next){
		// find a amenity by idSports
		Sport.findOne({idSports : request.param('id')}, function findSport(err, sport){
			// if error return error
			if(err) return next(err);
			if(!sport){
				// log error
				console.log(err);
				request.session.flash = {
					err: ["Destroy : Sport does not exist"]
				}
				// redirect back to page
				return respond.redirect('/error/index');
			}

			Sport.destroy({idSports : request.param('id')},function deleteSport(err){
				if(err) return next(err);
			});
			//pass amenity to view
			respond.redirect("/sport/sportadmin");
		});
	}
};
