/**
 * AmenityController
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

	index: function(request, respond, next){
		Amenity.find().exec(function (err, amenities){
			if(err) return next(err);
			
			//pass all amenities to view
			respond.view({
				amenities: amenities
			});
		});
	},

	studentnew: function(request, respond, next){
		Amenity.find().exec(function (err, amenities){
			if(err) return next(err);
			
			//pass all amenities to view
			respond.view({
				amenities: amenities
			});
		});
	},

	studentcreate : function(request, respond, next){
		// console.log(request.params.all());
		var selectedAmenities = request.param('idAmenities');
		for (var i = 0; i < selectedAmenities.length; i++) {
			Studentamenity.create(
				{Amenities_idAmenities : selectedAmenities[i], Students_User_idUser : request.session.User.idUser},
				function(err, studentamenity){
				if(err) return next(err);
			});
			// console.log("UserID : " + request.session.User.idUser + ", AmenityID : " + selectedAmenities[i]);
		};
		// console.log(selectedAmenities);
		respond.redirect("/student/profile/"+request.session.User.idUser);
	},

	studentshow : function(request, respond, next){
		//console.log(request.params.all());
		Studentamenity.query(
		 	"select Student_Amenity.Amenities_idAmenities, Student_Amenity.Students_User_idUser, Amenities.A_name"
		 	+ " from Student_Amenity"
		 	+ " JOIN Amenities ON Student_Amenity.Amenities_idAmenities = Amenities.idAmenities"
		 	+ " where Student_Amenity.Students_User_idUser = '"+request.param('id')+"';"
		 	, function(err, studentamenities){
			if(err) return next (err);
		 	//console.log(studentamenities);

			respond.json({
			 	studentamenities : studentamenities
			});
		});
	},

	institutenew: function(request, respond, next){
		Amenity.find().exec(function (err, amenities){
			if(err) return next(err);
			
			//pass all amenities to view
			respond.view({
				amenities: amenities
			});
		});
	},

	institutecreate : function(request, respond, next){
		// console.log(request.params.all());
		var cur_ins = request.session.User.idUser;
		var selectedAmenities = request.param('idAmenities');
		for (var i = 0; i < selectedAmenities.length; i++) {
			Instituteamenity.create(
				{Amenities_idAmenities : selectedAmenities[i], Institutes_idInstitutes : cur_ins},
				function(err, instituteamenity){
				if(err) return next(err);
			});
			// console.log("UserID : " + request.session.User.idUser + ", AmenityID : " + selectedAmenities[i]);
		};
		// console.log(selectedAmenities);
		respond.redirect("/county/new");
	},

	instituteshow : function(request, respond, next){
		console.log(request.params.all());
		Instituteamenity.query(
		 	"select Institute_Amenity.Amenities_idAmenities, Institute_Amenity.Institutes_idInstitutes, Amenities.A_name"
		 	+ " from Institute_Amenity"
		 	+ " JOIN Amenities ON Institute_Amenity.Amenities_idAmenities = Amenities.idAmenities"
		 	+ " where Institute_Amenity.Institutes_idInstitutes = '"+request.param('id')+"';"
		 	, function(err, instituteamenities){
			if(err) return next (err);
		 	console.log(instituteamenities);

			respond.json({
			 	instituteamenities : instituteamenities
			});
		});
	}
}