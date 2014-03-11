/**
 * RecommendationsController
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

	recommendations : function(request, respond, next){
		var user = request.param('id');

		Course.query(
			"select theAlgorithm.*, "+
			"( "+
			"	cao_pers_weight + "+
			"	sports_weight + "+
			"	amenities_weight + "+
			"	county_weight "+
			") as total from "+
			"( "+
			"select Course.*, "+
			"	( "+
			"		case "+
			"			when cao_pers.totalOccs = 1 then 37.5 "+
			"			when cao_pers.totalOccs = 2 then 50 "+
			"			else -1 "+
			"		end "+
			"	) as cao_pers_weight, "+
			"	(sm.matches) as sports_weight, "+
			"	(am.matches) as amenities_weight, "+
			"	(cty.weight) as county_weight "+
			"	from Course "+
			"	join "+
			"	( "+
			"		select Course_ids, count(Course_ids) as totalOccs from "+
			"		( "+
			"		 select c.idCourses as Course_ids, ocr.RIASEC_idRIASEC, count(ocr.RIASEC_idRIASEC) as RiasecOccurrences "+
			"		 from Course as c "+
			"		 left join Course_Occupation as co on co.Course_idCourses = c.idCourses "+
			"		 left join Occupation_Riasec AS ocr on ocr.Occupation_idOccupation = co.Occupation_idOccupation "+
			"		 left join Student_Riasec as sr on sr.RIASEC_idRIASEC = ocr.RIASEC_idRIASEC "+
			"		 where sr.Students_User_idUser = '"+user+"' and c.C_cao < (select S_CAO from Students where User_idUser = '"+user+"') "+
			"		 group by c.idCourses, ocr.RIASEC_idRIASEC "+
			"		) as a group by Course_ids "+
			"	) as cao_pers on cao_pers.Course_ids = Course.idCourses "+
			"	join ( "+
			"		select Institutes_idInstitutes, ( "+
			"			(count(Institutes_idInstitutes)/ "+
			"			(select count(Sports_idSports) from Student_Sport "+
			"			where Students_User_idUser = '"+user+"')) * 20 "+
			"		) as matches "+
			"		from Institute_Sport "+
			"		where "+
			"		Sports_idSports in ( "+
			"			select Sports_idSports "+
			"			from Student_Sport "+
			"			where Students_User_idUser = '"+user+"' "+
			"		) "+
			"		group by Institutes_idInstitutes "+
			"	) as sm on sm.Institutes_idInstitutes = Course.Institutes_idInstitutes "+
			"	join ( "+
			"		select Institutes_idInstitutes, ( "+
			"			(count(Institutes_idInstitutes)/ "+ 
			"			(select count(Amenities_idAmenities) from Student_Amenity "+
			"			where Students_User_idUser = '"+user+"')) * 20) "+
			"		as matches "+
			"		from Institute_Amenity "+
			"		where "+
			"		Amenities_idAmenities in ( "+
			"			select Amenities_idAmenities "+
			"			from Student_Amenity "+
			"			where Students_User_idUser = '"+user+"' "+
			"		) "+
			"		group by Institutes_idInstitutes "+
			"	) as am on am.Institutes_idInstitutes = Course.Institutes_idInstitutes "+
			"	join ( "+
			"		select idInstitutes, (10) weight from Institutes "+
			"		where County_County_name in "+
			"		(select County_County_name from Student_County "+
			"			where Students_User_idUser = '"+user+"') "+
			"	) as cty on cty.idInstitutes = Course.Institutes_idInstitutes "+
			") as theAlgorithm order by total DESC, theAlgorithm.C_cao DESC "+
			"limit 10;", function algorithm(err, rCourses){
			if(err){
				console.log("Recommender - Error : " + err);
				// log error
				//console.log(err);
				request.session.flash = {
					err: ["Recommender - Error"]
				}
				// redirect back to page
				return respond.redirect('/error/index');
			}
			respond.json({
				rCourses : rCourses
			});
		});
	},

	yourcourses : function(request, respond){
		respond.view();
	},

	index : function(request, respond, next){
		respond.view();
	}
};
