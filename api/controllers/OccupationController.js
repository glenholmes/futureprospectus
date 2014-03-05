/**
 * OccupationController
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
	index : function(request, respond, next){
		Occupation.find().sort('O_name').exec(
			function allOccupations(err, occupations){
				if (err) return next (err);
				respond.view({
					occupations : occupations,
					id : request.param('id')
				});
		});
	},

	adminindex : function(request, respond, next){
		Occupation.find(function allOccupations(err, occupations){
			if (err) return next (err);
			respond.view({
				occupations : occupations,
				id : request.param('id')
			});
		});
	},

	destroy :  function(request, respond, next){
		Occupation.findOne({idOccupation : request.param('id')}, function findOccupation(err, occupation){
			// if error return error
			if(err) return next(err);
			if(!occupation) return next("No such occupation exists");

			Occupation.destroy({idOccupation : request.param('id')}, function occupationDelete(err){
				if(err) return next(err);
			});
			//pass occupation to view
			respond.redirect("/occupation/adminindex");
		});
	},

	occupationriasec : function(request, respond, next){
		Occupation.query(
			"select Occupation_Riasec.RIASEC_idRIASEC, Occupation.O_name, count(Occupation.O_name) as OccCount "
			+ "from Occupation_Riasec "
			+ "join Occupation "
			+ "ON Occupation_Riasec.Occupation_idOccupation = Occupation.idOccupation "
			+ "where RIASEC_idRIASEC "
			+ "in ( "
			+ "	select RIASEC_idRIASEC "
			+ "	from Student_Riasec "
			+ "	where Students_User_idUser = '"+ request.param('id') +"' "
			+ ") "
			+ "group by Occupation.O_name "
			+ "having count(Occupation.O_name) > 1;"
			, function(err, occupations){
				if(err) return next(err);
				//pass occupation to view
				// console.log(occupations);
				respond.view({
					occupations : occupations
				});
		});
	} 
}
