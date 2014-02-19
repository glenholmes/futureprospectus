/**
 * StudentController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	//create a student from the form on new.ejs
	create: function(request, respond, next){
		// console.log(request.session.User.idUser);
		// respond.redirect("/");
		Student.create({User_idUser : request.session.User.idUser}, function studentCreated (err, student){
			//if an error occurs
			if (err) {
				// log error
				console.log(err);
				request.session.flash = {
					err: ["Cannot create student"]
				}
				// redirect back to page
				return respond.redirect('/user/new');
			}
			//if student is created sucessfully
			//respond.json(student);
			console.log(student);
			respond.redirect('/student/profile/'+student.User_idUser);
		});
	},
	// show a student profile page
	profile: function(request, respond, next){
		// find a student by idStudent
		Student.findOne({User_idUser : request.param('id')}, function findStudent (err, student){
			// if error return error
			if(err) return next(err);
			if(!student) return next("No such student exists");

			//pass student to view
			respond.view({
				student: student
			});
		});
	},
	edit: function(request, respond, next){
		// find a student by idStudent
		Student.findOne({User_idUser : request.param('id')}, function findStudent (err, student){
			// if error return error
			if(err) return next(err);
			if(!student) return next("No such student exists");

			//pass student to view
			respond.view({
				student: student
			});
		});
	},

	update: function(request, respond, next){
		// find student and update email details
		Student.update({User_idUser : request.param('id')},
			{S_Parent : request.param('S_Parent')}, function studentUpdating(err){
			if(err){
				return respond.redirect("/student/edit/"+request.param('id'));
			}
			respond.redirect("/student/profile/"+request.param('id'));
		});
	},
};
