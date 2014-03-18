// @name 	 : RecommenderController
// @author	 : Glen Holmes
// @date	 : 29 April 2014

// This controller contains the algorithm that recommends courses to the
// student.
// The algorithm can be filtered using session variables. As the algorithm
// is called it checks to see if each session variable is undefined. If
// the variable is not undefined then that section of sql is not added to
// the algorithm.

// The algorithm is a weigthed content filtering algorithm;
// ->First it selects courses for the student by Personality and filters by
// 	CAO. This is the cao_pers_weight.
// ->Second Courses are given a weight based on how many sports a Student would
// 	like matched to what the institute provides. This is the sports_weight.
// ->Third Courses are given a weight based on how many amenities Student would
// 	like matched to what the institute provides. This is the amenities_weight.
// ->Finally, Courses are given a weight based on the counties a Student would
// 	like to study in. This is the counties_weight.

module.exports = {

	recommendations : function(request, respond, next){
		var user = request.param('id');
		var user_cao;
		if(request.session.upcao == undefined){
			user_cao = "(select S_CAO from Students where User_idUser = '"+user+"')";
		} else {
			user_cao = "( 50 + (select S_CAO from Students where User_idUser = '"+user+"'))";
		}

		var theAlgorithm = "";
		theAlgorithm += "select theAlgorithm.*, ("+
			"	cao_pers_weight ";
		if(request.session.sport == undefined){
			theAlgorithm += "+ sports_weight";
		}
		if(request.session.amenity == undefined){
			theAlgorithm += "+ amenities_weight";
		}
		if(request.session.county == undefined){
			theAlgorithm += "+ county_weight";
		}
		theAlgorithm += ") as total from (select Course.*,"+
			"	("+
			"		case"+
			"			when cao_pers.totalOccs = 1 then 37.5"+
			"			when cao_pers.totalOccs = 2 then 50"+
			"			else -1"+
			"		end"+
			"	) as cao_pers_weight";
		if(request.session.sport == undefined){
			theAlgorithm += ",	(sm.matches) as sports_weight";
		}
		if(request.session.amenity == undefined){
			theAlgorithm += ",	(am.matches) as amenities_weight";
		}
		if(request.session.county == undefined){
			theAlgorithm += ",	(cty.weight) as county_weight";
		}
		theAlgorithm += "	from Course"+
			"	join"+
			"	("+
			"		select Course_ids, count(Course_ids) as totalOccs from"+
			"		("+
			"		 select c.idCourses as Course_ids, ocr.RIASEC_idRIASEC, count(ocr.RIASEC_idRIASEC) as RiasecOccurrences"+
			"		 from Course as c"+
			"		 left join Course_Occupation as co on co.Course_idCourses = c.idCourses"+
			"		 left join Occupation_Riasec AS ocr on ocr.Occupation_idOccupation = co.Occupation_idOccupation"+
			"		 left join Student_Riasec as sr on sr.RIASEC_idRIASEC = ocr.RIASEC_idRIASEC"+
			"		 where sr.Students_User_idUser = '"+user+"' and c.C_cao < "+user_cao+
			"		 group by c.idCourses, ocr.RIASEC_idRIASEC"+
			"		) as a group by Course_ids"+
			"	) as cao_pers on cao_pers.Course_ids = Course.idCourses";

		if(request.session.sport == undefined){
			theAlgorithm += "	join ("+
				"		select Institutes_idInstitutes, ("+
				"			(count(Institutes_idInstitutes)/"+
				"			(select count(Sports_idSports) from Student_Sport"+
				"			where Students_User_idUser = '"+user+"')) * 20"+
				"		) as matches"+
				"		from Institute_Sport"+
				"		where"+
				"		Sports_idSports in ("+
				"			select Sports_idSports"+
				"			from Student_Sport"+
				"			where Students_User_idUser = '"+user+"'"+
				"		)"+
				"		group by Institutes_idInstitutes"+
				"	) as sm on sm.Institutes_idInstitutes = Course.Institutes_idInstitutes";
		}
		if(request.session.amenity == undefined){
			theAlgorithm += "	join ("+
				"		select Institutes_idInstitutes, ("+
				"			(count(Institutes_idInstitutes)/"+ 
				"			(select count(Amenities_idAmenities) from Student_Amenity"+
				"			where Students_User_idUser = '"+user+"')) * 20)"+
				"		as matches"+
				"		from Institute_Amenity"+
				"		where"+
				"		Amenities_idAmenities in ("+
				"			select Amenities_idAmenities"+
				"			from Student_Amenity"+
				"			where Students_User_idUser = '"+user+"'"+
				"		)"+
				"		group by Institutes_idInstitutes"+
				"	) as am on am.Institutes_idInstitutes = Course.Institutes_idInstitutes";
		}
		if(request.session.county == undefined){
			theAlgorithm += "	join ("+
				"		select idInstitutes, (10) weight from Institutes"+
				"		where County_County_name in"+
				"		(select County_County_name from Student_County"+
				"			where Students_User_idUser = '"+user+"')"+
				"	) as cty on cty.idInstitutes = Course.Institutes_idInstitutes";
		}
		theAlgorithm += ") as theAlgorithm  order by total DESC, theAlgorithm.C_cao DESC " +
			"limit 10;";

		Course.query(theAlgorithm, function algorithm(err, rCourses){
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

	removesport : function(request, respond, next){
		request.session.sport = true;
		respond.redirect('/recommender/yourcourses/'+request.param('id'));
	},

	addsport : function(request, respond, next){
		request.session.sport = undefined;
		respond.redirect('/recommender/yourcourses/'+request.param('id'));
	},

	removeamenity : function(request, respond, next){
		request.session.amenity = true;
		respond.redirect('/recommender/yourcourses/'+request.param('id'));
	},

	addamenity : function(request, respond, next){
		request.session.amenity = undefined;
		respond.redirect('/recommender/yourcourses/'+request.param('id'));
	},

	removecounty : function(request, respond, next){
		request.session.county = true;
		respond.redirect('/recommender/yourcourses/'+request.param('id'));
	},

	addcounty : function(request, respond, next){
		request.session.county = undefined;
		respond.redirect('/recommender/yourcourses/'+request.param('id'));
	},

	addcao : function(request, respond, next){
		request.session.upcao = true;
		respond.redirect('/recommender/yourcourses/'+request.param('id'));
	},

	regcao : function(request, respond, next){
		request.session.upcao = undefined;
		respond.redirect('/recommender/yourcourses/'+request.param('id'));
	},

	yourcourses : function(request, respond){
		respond.view();
	}
};
