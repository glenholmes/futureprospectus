/**
 * CaocalcController
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
	create: function(request, respond, next){
		console.log(request.params.all());
		var subjects = new Array();
		var grades = new Array();
		var levels = new Array();
		subjects = request.param('Subject');
		grades = request.param('Grade');
		levels = request.param('Level');
		var totalcao = 0;

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

				// console.log("Total : " + totalcao);
				Student.update({User_idUser : request.session.User.idUser }, {S_CAO : totalcao }, function updateCAO(err){
					if(err) return next(err);
				});
			});
		}
		respond.redirect("/student/profile/" + request.session.User.idUser);
	}
};
