/**
 * InstituteController
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

	//create a institute from the form on new.ejs
	create: function(request, respond, next){
		Institute.create(request.params.all(), function instituteCreated (err, institute){
			//if an error occurs
			if (err) {
				// log error
				console.log(err);
				request.session.flash = {
					err: ["Cannot create institute"]
				}
				// redirect back to page
				return respond.redirect('/institute/new');
			}
			//if institute is created sucessfully
			//respond.json(institute);
			console.log(institute);
			
			//request.session.Institute = institute;
			respond.redirect('/institute/show/'+institute.idInstitutes);
		});
	},


	index: function(request, respond, next){
		Institute.find(function allInstitutes (err, institutes){
			if(err) return next(err);
			
			//pass all institutes to view
			respond.view({
				institutes: institutes
			});
		});
	},

	show: function(request, respond, next){
		// find a institute by idInstitute
		Institute.findOne({idInstitutes : request.param('id')}, function findInstitute (err, institute){
			// if error return error
			console.log(request.params.all());

			if(err) return next(err);
			if (!institute){
				respond.redirect("/institute/new");
			}
			else{
				//pass institute to view
				respond.view({
					institute: institute
				});
			}
		});
	},

	edit: function(request, respond, next){
		// find a institute by idInstitute
		Institute.findOne({idInstitutes : request.param('id')}, function findInstitute(err, institute){
			// if error return error
			if(err) return next(err);
			if(!institute) return next("No such institute exists");

			//pass institute to view
			respond.view({
				institute: institute
			});
		});
	},

	update: function(request, respond, next){
		// find institute and update email details
		Institute.update({idInstitutes : request.param('id')}, request.params.all(), function instituteUpdating(err){
			if(err){
				return respond.redirect("/institute/edit/"+request.param('id'));
			}
			respond.redirect("/institute/show/"+request.param('id'));
		});
	},

	destroy: function (request, respond, next){
		// find a institute by idInstitute
		Institute.findOne({idInstitutes : request.param('id')}, function findInstitute(err, institute){
			// if error return error
			if(err) return next(err);
			if(!institute) return next("No such institute exists");

			Institute.destroy({idInstitutes : request.param('id')},function instituteDelete(err){
				if(err) return next(err);
			});
			//pass institute to view
			respond.redirect("/institute");
		});
	}

};
