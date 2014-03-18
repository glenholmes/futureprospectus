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

	create: function(request, respond, next){
		Amenity.query("insert into Amenities values (default, '" + request.param('A_name') + "')",
			function amenityCreated (err, amenity){
			//if an error occurs
			if (err) {
				// log error
				console.log(err);
				request.session.flash = {
					err: ["Cannot create amenity"]
				}
				// redirect back to page
				return respond.redirect('/amenity/amenityadmin');
			}
			
			//request.session.Amenity = amenity;
			respond.redirect('/amenity/amenityadmin');
		});
	},

	amenityadmin: function(request, respond, next){
		Amenity.find().sort('A_name').exec(function (err, amenities){
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
		var selectedAmenities = request.param('idAmenities');
		if(request.param('idAmenities') == undefined){
			respond.redirect("/amenity/studentnew/"+request.param('id'));
		} else {
			var selectedAmenities = request.param('idAmenities');
			// only one amenity exists
			if(selectedAmenities[0].length <=1 ){
				Studentamenity.create(
						{Amenities_idAmenities : selectedAmenities, Students_User_idUser : request.param('id')},
						function(err, studentamenity){
					if(err) return next(err);
				});
			// if more than one amenity exists
			} else {
				for (var i = 0; i < selectedAmenities.length; i++) {
					Studentamenity.create(
						{Amenities_idAmenities : selectedAmenities[i], Students_User_idUser : request.param('id')},
						function(err, studentamenity){
						if(err){
							console.log('Error' + err);
						}
					});
				}
			}
			respond.redirect("/county/new/"+request.param('id'));
		}
	},

	clear : function(request, respond, next){
		Studentsport.query("delete from Student_Amenity where "+
			"Students_User_idUser = '"+request.param('id')+"';", function(err){
				if(err){
					request.session.flash = {
						err: ["Cannot clear amenities values."]
					}
					// redirect back to page
					return respond.redirect('/error/index');
				}
				Student.update({User_idUser : request.param('id')},
					{S_Institute: null}, function(err){
					if(err){
						request.session.flash = {
							err: ["Amenities : Update: Error"]
						}
						// redirect back to page
						return respond.redirect('/error/index');
					}
					respond.redirect("/county/clear/"+request.param('id'));
				});
			});
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
		var cur_ins = request.param('id');
		Instituteamenity.destroy({Institutes_idInstitutes : cur_ins}, function(err){
			if(err){
				console.log("Error:" + err);
			};
		});
		var selectedAmenities = request.param('idAmenities');
		for (var i = 0; i < selectedAmenities.length; i++) {
			Instituteamenity.create(
				{Amenities_idAmenities : selectedAmenities[i], Institutes_idInstitutes : cur_ins},
				function(err, instituteamenity){
				if(err){
					console.log("Error:" + err);
				};
			});
		};

		respond.redirect("/institute/show/"+cur_ins);
	},

	instituteshow : function(request, respond, next){
		Instituteamenity.find({Institutes_idInstitutes : request.session.User.idUser},
			function(err, instituteamenities){
			if(err) return next (err);
			respond.json({
			 	instituteamenities : instituteamenities
			});
		});
	},

	destroy: function (request, respond, next){
		// find a amenity by idAmenities
		Amenity.findOne({idAmenities : request.param('id')}, function findAmenity(err, amenity){
			// if error return error
			if(err) return next(err);
			if(!amenity){
				// log error
				console.log(err);
				request.session.flash = {
					err: ["Destroy : Amenity does not exist"]
				}
				// redirect back to page
				return respond.redirect('/amenity/amenityadmin');
			}

			Amenity.destroy({idAmenities : request.param('id')},function deleteAmenity(err){
				if(err) return next(err);
			});
			//pass amenity to view
			respond.redirect("/amenity/amenityadmin");
		});
	}
}