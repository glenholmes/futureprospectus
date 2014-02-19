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
	'new': function(request, respond){
		// show new.ejs view
		respond.view();
	},

	//create a subject from the form on new.ejs
	create: function(request, respond, next){
		Subject.query("insert into SubjectsLC values (default, '" + request.param('S_name') + "', '"+ request.param('S_cao') +"')",
			function subjectCreated (err, subject){
			//if an error occurs
			if (err) {
				// log error
				console.log(err);
				request.session.flash = {
					err: ["Cannot create subject"]
				}
				// redirect back to page
				return respond.redirect('/subject/new');
			}
			//if subject is created sucessfully
			//respond.json(subject);
			console.log(subject);
			
			//request.session.Subject = subject;
			respond.redirect('/subject/');
		});
	},


	index: function(request, respond, next){
		Subject.find(function allsubjects (err, subjects){
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

	destroy: function (request, respond, next){
		// find a subject by idSubjects
		Subject.findOne({idSubjects : request.param('id')}, function findSubject(err, subject){
			// if error return error
			if(err) return next(err);
			if(!subject) return next("No such subject exists");

			Subject.destroy({idSubjects : request.param('id')},function deleteSubject(err){
				if(err) return next(err);
			});
			//pass subject to view
			respond.redirect("/subject");
		});
	}
};
