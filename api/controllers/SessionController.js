/**
 * SessionController
 *
 * @module      :: Controller
 * @description	:: This file is the contoller associated with creating sessions for
 *				   users.
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var bcrypt = require('bcrypt');

module.exports = {
	'new' : function(request,respond){
		respond.view("session/new");
	},

	create: function(request, respond, next){
		if(!request.param('idUser') || !request.param('U_password')) {
			request.session.flash = {
				err: ["Username or password not present"]
			}
			// redirect back to page
			respond.redirect("/session/new");
			return;
		}
		User.findOne({idUser : request.param('idUser')}, function findUser (err, user){
			// if error return error
			if(err) return next(err);
			if(!user){
				request.session.flash = {
					err: ["User not found"]
				}
				// redirect back to page
				respond.redirect("/session/new");
				return;
			}

			bcrypt.compare(request.param('U_password'), user.U_password, function(err, validP){
				if(err) return (err);
				if(!validP){
					// log error
					console.log(err);
					request.session.flash = {
						err: ["Password does not match"]
					}
					// redirect back to page
					respond.redirect("/session/new");
					return;
				}
				request.session.authenticated = true;
				request.session.User = user;
				var check = user.U_type;

				// testing
				console.log("Check : " + check);
				console.log("Student : " + 'student');
				console.log("Comparison value : " + check.localeCompare('student'));

				//redirect user to appropriate page
				if(check.localeCompare('student') == 0){
					respond.redirect("/student/profile/"+ user.idUser);
				} else if(check.localeCompare('institute') == 0){
					respond.redirect("/institute/show/"+ user.idUser);				
				} else {
					respond.redirect("/user/show/" + user.idUser);
				}
			});
		});
	},

	destroy: function(request, respond, next){
		request.session.destroy();
		respond.redirect("/");
	}
};
