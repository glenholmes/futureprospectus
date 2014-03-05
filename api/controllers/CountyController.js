/**
 * CountyController
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

	create : function(request, respond, next){
		// check to see if a county has been selected
		if(request.param('idCounties') === undefined || request.param('idCounties') == undefined){
			respond.redirect('/county/new');
		} else{
			// get user
			var uname = request.session.User.idUser;
			// get counties
			var selectedCounties = request.param('idCounties');
			// only one county exists
			if(selectedCounties[0].length <=1 ){
				County.create(
					{County_County_name: selectedCounties, Students_User_idUser : uname},
					function(err, studentcounty){
					if(err) return next(err);
				});
			}
			// if more than one county exists
			else {
				for (var i = 0; i < selectedCounties.length; i++) {
					County.create(
						{County_County_name: selectedCounties[i], Students_User_idUser : uname},
						function(err, studentcounty){
						if(err) return next(err);
					});
				};
			}
			respond.redirect("/student/profile/"+request.session.User.idUser);
		}
	},

	showjson : function(request, respond, next){
		var uname = request.session.User.idUser;
		County.find({Students_User_idUser : uname},function(err, counties){
			if(err) return next (err);
		 	// console.log(counties);
			respond.json({
			 	counties : counties
			});
		});
	},
};
