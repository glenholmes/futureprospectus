/**
 * UserController
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
	//loads sign up page
	'new': function(request, respond){
		// show new.ejs view
		respond.view();
	},

	//create a user from the form on new.ejs
	create: function(request, respond, next){
		User.create(request.params.all(), function userCreated (err, user){
			//if an error occurs
			if (err) {
				// log error
				console.log(err);
				request.session.flash = {
					err: ["Cannot create user"]
				}
				// redirect back to page
				return respond.redirect('/user/new');
			}
			//if user is created sucessfully
			//respond.json(user);
			console.log(user);
			
			request.session.authenticated = true;
			request.session.User = user;

			var check = user.U_type;
			if(check.localeCompare('student') == 0){
				respond.redirect("/student/create");
			} else {
				respond.redirect("/user/show/" + user.idUser);
			}
		});
	},



	// show all users
	index: function(request, respond, next){

		User.find(function allUsers (err, users){
			if(err) return next(err);
			
			//pass all users to view
			respond.view({
				users: users
			});
		});
	},

	// show a users profile page
	show: function(request, respond, next){
		// find a user by idUser
		User.findOne({idUser : request.param('id')}, function findUser (err, user){
			// if error return error
			if(err) return next(err);
			if(!user) return next("No such user exists");

			//pass user to view
			respond.view({
				user: user
			});
		});
	},

	//edit view
	edit: function (request, respond, next){
		// find a user by idUser
		User.findOne({idUser : request.param('id')}, function findUser(err, user){
			// if error return error
			if(err) return next(err);
			if(!user) return next("No such user exists");

			//pass user to view
			respond.view({
				user: user
			});
		});
	},

	// edittype view
	editadmin: function (request, respond, next){
		// find a user by idUser
		User.findOne({idUser : request.param('id')}, function findUser(err, user){
			// if error return error
			if(err) return next(err);
			if(!user) return next("No such user exists");

			//pass user to view
			respond.view({
				user: user
			});
		});
	},

	//update the email using the edit view
	update: function(request, respond, next){
		// find user and update email details
		User.update({idUser : request.param('idUser')}, {U_email : request.param('U_email')}, function userUpdating(err){
			if(err){
				return respond.redirect("/user/edit/"+request.param('id'));
			}
			respond.redirect("/user/show/"+request.param('id'));
		});
	},

	//update the type using the editadmin view
	updateadmin: function(request, respond, next){
		// find user and update email details
		User.update({idUser : request.param('idUser')}, {U_type : request.param('U_type')}, function userUpdatingAdmin(err){
			if(err){
				return respond.redirect("/user/editadmin/"+request.param('id'));
			}
			respond.redirect("/user/show/"+request.param('id'));
		});
	},

	destroy: function (request, respond, next){
		// find a student by User_idUser
		Student.findOne({User_idUser : request.param('id')}, function findStudent(err, student){
			// if error return error
			if(err) return next(err);
			if(!student) return next("No such student exists");

			Student.destroy({User_idUser : request.param('id')},function studentDelete(err){
				if(err) return next(err);
			});
		});
		// find a user by idUser
		User.findOne({idUser : request.param('id')}, function findUser(err, user){
			// if error return error
			if(err) return next(err);
			if(!user) return next("No such user exists");

			User.destroy({idUser : request.param('id')},function userDelete(err){
				if(err) return next(err);
			});
			//pass user to view
			respond.redirect("/user");
		});
	}
};
