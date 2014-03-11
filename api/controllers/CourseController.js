/**
 * CourseController
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
		// request.session.page = request.session.page + 1;
		// console.log(request.session.page);
		Course.find().exec(function (err, courses){
			if(err) return next(err);
			
			//pass all courses to view
			respond.view({
				courses: courses
			});
		});
	},

	create : function (request, respond, next){
		console.log(request.params.all());
		var idToUpper = request.param('id');
		console.log(idToUpper);
		idToUpper = idToUpper.toUpperCase();
		console.log(idToUpper);
		Course.query(
			"insert into Course values ('"+request.param('idCourses')+"', '"
				+request.param('C_name')+"', '"+request.param('C_description')+"', '"
				+request.param('C_cao')+"', '"+request.param('C_level')+"', '"
				+idToUpper+"', '"+request.param('C_special_reqs')+"');"
			, function instituteCreated (err, course){
			//if an error occurs
			if (err) {
				// log error
				console.log(err);
				request.session.flash = {
					err: ["Cannot create course"]
				}
				// redirect back to page
				return respond.redirect('/course/new/'+request.param('id'));
			}			
			respond.redirect('/course/show/'+request.param('idCourses'));
		});
	},

	indexinstitute: function(request, respond, next){
		// request.session.page = request.session.page + 1;
		// console.log(request.session.page);
		Course.find({Institutes_idInstitutes : request.param('id')}).exec(function (err, courses){
			if(err) return next(err);
			
			//pass all courses to view
			respond.view({
				courses: courses
			});
		});
	},

	indexcao : function(request, respond, next){
		// find courses matching cao
		Course.find().where({C_cao: { '<=': request.param('S_CAO') }}).exec(function (err, courses){
			if(err) return next(err);
			
			//pass all courses to view
			respond.view({
				courses: courses
			});
		});
	},

	show: function(request, respond, next){
		// find a course by idCourse
		Course.findOne({idCourses : request.param('id')}, function findCourse (err, course){
			// if error return error
			if(err) return next(err);
			if(!course) return next("No such course exists");

			//pass course to view
			respond.view({
				course: course
			});
		});
	},

	edit: function(request, respond, next){
		// find a course by idCourse
		Course.findOne({idCourses : request.param('id')}, function findCourse(err, course){
			// if error return error
			if(err) return next(err);
			if(!course) return next("No such course exists");

			//pass course to view
			respond.view({
				course: course
			});
		});
	},

	update: function(request, respond, next){
		console.log(request.params.all());
		// find course and update email details
		Course.update({idCourses : request.param('id')}, request.params.all(), function courseUpdating(err){
			if(err){
				return respond.redirect("/course/edit/"+request.param('id'));
			}
			respond.redirect("/course/show/"+request.param('id'));
		});
	},

	destroy: function (request, respond, next){
		// find a course by idCourse
		Course.findOne({idCourses : request.param('id')}, function findCourse(err, course){
			// if error return error
			if(err) return next(err);
			if(!course) return next("No such course exists");

			Course.destroy({idCourses : request.param('id')},function courseDelete(err){
				if(err) return next(err);
			});
			//pass course to view
			respond.redirect("/course/indexinstitute/"+request.session.User.idUser);
		});
	},

	joincourse: function (request, respond, next){
		Course.query("select * from Course where idCourses in"+
			" (select Course_idCourses from Course_Occupation where Occupation_idOccupation in"+
			" (select Occupation_idOccupation from Occupation_Riasec where RIASEC_idRIASEC in"+
			" (select RIASEC_idRIASEC from Student_Riasec"+
			" where Students_User_idUser = '"+ request.param('id') +"')"+
			" group by Occupation_idOccupation having count(Occupation_idOccupation) > 1));"
		, function twoRiasecMatch(err, courses){
			if(err) return next(err);
			if(!courses){
				respond.redirect("/student/profile/"+ request.param('id'));
			}
			respond.view({
				courses : courses
			});
		});
	}
};