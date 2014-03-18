/**
 * CourseoccupationController
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
	create : function(request, respond, next){
		if(request.param('idOccupation') == undefined){
			respond.redirect('/occupation/index/' + request.param('id'));
		} else{
			var selectedOccupations = request.param('idOccupation');
			// only one course exists
			if(selectedOccupations[0].length <=1 ){
				Course_occupation.create(
					{Occupation_idOccupation : selectedOccupations, Course_idCourses : request.param('id')},
					function(err, occupations){
					if(err) return next(err);
				});
			}
			// if more than one course exists
			else {
				for (var i = 0; i < selectedOccupations.length; i++) {
					Course_occupation.create(
						{Occupation_idOccupation : selectedOccupations[i], Course_idCourses : request.param('id')},
						function(err, occupations){
						if(err) return next(err);
					});
				}
			}
			respond.redirect("/course/show/"+request.param('id'));
		}
	},

	index : function(request, respond, next){
		Course_occupation.query(
			"select Occupation.O_name from Course_Occupation "
			+ "join Occupation on Occupation.idOccupation = Course_Occupation.Occupation_idOccupation "
			+ "where Course_Occupation.Course_idCourses = '"+ request.param('id') +"';",
			function(err, occupations){
			if(err) return next(err);
			//console.log(occupations);
			respond.json({
				occupations : occupations
			});
		});
	},

	//clear all course occupation links
	destroy : function(request, respond, next){
		Course_occupation.find({Course_idCourses : request.param('id')}, function(err, courses_occupations){
			if(err) return next(err);
			if(!courses_occupations){
				respond.redirect("/course/show/"+request.param('id'));
			}
			Course_occupation.destroy({Course_idCourses : request.param('id')},function courseDelete(err){
				if(err) return next(err);
			});
			respond.redirect("/course/show/"+request.param('id'));
		});
	}
};
