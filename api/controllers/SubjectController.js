/**
 * SubjectController
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
	// 'new': function(request, respond){
	// 	// show new.ejs view
	// 	respond.view();
	// },

	//create a subject from the form on new.ejs
	create: function(request, respond, next){
		Subject.query("insert into SubjectsLC values (default, '" + request.param('S_name') + "', '"+ request.param('S_cao') +"')",
			function subjectCreated (err, subject){
			//if an error occurs
			if (err) {
				// log error
				//console.log(err);
				request.session.flash = {
					err: ["Cannot create subject"]
				}
				// redirect back to page
				return respond.redirect('/error/index');
			}
			//if subject is created sucessfully
			//respond.json(subject);
			console.log(subject);
			
			//request.session.Subject = subject;
			respond.redirect('/subject/subjectadmin/'+request.param('id'));
		});
	},

	// index: function(request, respond, next){
	// 	Subject.find(function allsubjects (err, subjects){
	// 		if(err) return next(err);
			
	// 		//pass all subjects to view
	// 		respond.view({
	// 			subjects: subjects
	// 		});
	// 	});
	// },

	subjectadmin : function(request, respond, next){
		Subject.find().sort('S_name').exec(function allsubjects (err, subjects){
			if(err) return next(err);
			
			//pass all subjects to view
			respond.view({
				subjects: subjects
			});
		});
	},

	selector: function(request, respond, next){
		Subject.find(function allsubjects (err, subjects){
			if(err) return next(err);
			
			//pass all subjects to view
			respond.view({
				subjects: subjects
			});
		});
	},

	calculator: function(request, respond, next){
		//console.log(request.params.all());

		var subjects = new Array();
		var grades = new Array();
		var levels = new Array();
		subjects = request.param('Subject');
		grades = request.param('Grade');
		levels = request.param('Level');
		var totalcao = 0;

		//add selected subjects to the database these subjects can then be compared
		//against required subjects for individual course
		//eg.(Engineering -> Higher Maths)
		for (var i = 0; i < subjects.length; i++) {
			Subject.query("insert into Student_Subject values ("+
				"'"+subjects[i]+"','"+request.param('id')+"','"+grades[i]+"','"+levels[i]+"');"
			,function (err){
				if(err) return next(err);
			});
		}

		//calculate cao by grade and level
		for(var i = 0; i < subjects.length; i++){
			if(levels[i].localeCompare('ordinary') == 0){
				totalcao += parseInt(grades[i]);
				totalcao -= 40;
			} else {
				totalcao += parseInt(grades[i]);
			}
		}
		// add 25 if a bonus subject is there
		// currently math is the only bonus subject but possibilty for chemistry, physics
		// and applied mathematics in the future
		for(var i = 0; i < subjects.length; i++){
			Subject.findOne({idSubjects: subjects[i]},function(err, subject){
				console.log(subject);

				if(err) return next(err);
				var bonus = subject.S_cao;
				console.log(bonus);

				if(bonus.match("bonus")){
					totalcao += 25;
				}

				if( i == subjects.length){
					// console.log("Total : " + totalcao);
					Student.update({User_idUser : request.session.User.idUser }, {S_CAO : totalcao }, function updateCAO(err){
						if(err) return next(err);
					});
				}
			});
		}
		respond.redirect("/student/profile/" + request.session.User.idUser);
	},

	clear: function (request, respond, next){
		Subject.query(
			"Delete from Student_Subject where Students_User_idUser = '"+request.param('id')+"';"
			,function (err, subjectmatches){
				if(err) return next(err);
				if(!subjectmatches){
					request.session.flash = {
						err: ["Subject : Clear : Error"]
					}
					// redirect back to page
					return respond.redirect('/error/index');
				}
				Student.update({User_idUser : request.param('id')},
					{S_CAO : null}, function studentUpdating(err){
					if(err){
						request.session.flash = {
							err: ["Subject : Update: Error"]
						}
						// redirect back to page
						return respond.redirect('/error/index');
					}
					respond.redirect("/student/profile/"+request.param('id'));
				});
		});
	},

	destroy: function (request, respond, next){
		// find a subject by idSubjects
		Subject.findOne({idSubjects : request.param('id')}, function findSubject(err, subject){
			// if error return error
			if(err) return next(err);
			if(!subject){
				// log error
				console.log(err);
				request.session.flash = {
					err: ["Destroy : Subject does not exist"]
				}
				// redirect back to page
				return respond.redirect('/error/index');
			}

			Subject.destroy({idSubjects : request.param('id')},function deleteSubject(err){
				if(err) return next(err);
			});
			//pass subject to view
			respond.redirect("/subject/subjectadmin/"+request.param('id'));
		});
	}
};
