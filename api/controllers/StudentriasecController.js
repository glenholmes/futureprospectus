/**
 * StudentriasecController
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
	// display all riasecs
	index : function(request, respond, next){
		Riasec.find(function allRiasecs (err, riasecs){
			if(err) return next(err);
			
			//pass all riasecs to view
			respond.view({
				riasecs: riasecs
			});
		});
	},
	test : function(request, respond, next){
		// get riasec values from client
		var riasecs = new Array();
		riasecs = request.param('riasec_letter');
		// create an empty array for counting riasec values
		var riasecCount = [0,0,0,0,0,0];
		//count values
		for (var index = 0; index < riasecs.length; index++) {
			if(riasecs[index].match("R")){
				riasecCount[0] += 1;
			}
			if(riasecs[index].match("I")){
				riasecCount[1] += 1;
			}
			if(riasecs[index].match("A")){
				riasecCount[2] += 1;
			}
			if(riasecs[index].match("S")){
				riasecCount[3] += 1;
			}
			if(riasecs[index].match("E")){
				riasecCount[4] += 1;
			}
			if(riasecs[index].match("C")){
				riasecCount[5] += 1;
			}
		};
		// find position of maximum number i.e. first riasec
		var maxIndexes = [ 0, 0];
		var max = riasecCount[0];
		// comparison loop
		for (var j = 0; j < riasecCount.length; j++) {
		    if (riasecCount[j] > max) {
		        maxIndexes[0] = j;
		        max = riasecCount[j];
		    }
		}

		// set item at max position so it cannot be appear again
		riasecCount[maxIndexes[0]] = -10;
		max = riasecCount[0];

		// redo comparison to find second maximum nuber i.e. second riasec
		for (var j = 0; j < riasecCount.length; j++) {
		    if (riasecCount[j] > max) {
		        maxIndexes[1] = j;
		        max = riasecCount[j];
		    }
		}

		var currentRiasec = "";
		// write to database student id and riasec based on previous calculation
		for (var i = 0; i < maxIndexes.length; i++) {
			switch(maxIndexes[i]){
				case 0:
				currentRiasec = "R";
				break;
				case 1:
				currentRiasec = "I";
				break;
				case 2:
				currentRiasec = "A";
				break;
				case 3:
				currentRiasec = "S";
				break;
				case 4:
				currentRiasec = "E";
				break;
				case 5:
				currentRiasec = "C";
				break;
			}

			Studentriasec.create({Students_User_idUser : request.session.User.idUser, RIASEC_idRIASEC: currentRiasec},
				function srCreated (err, studentriasec){
				//if an error occurs
				if(err) return next(err);
			});
		};
		respond.redirect("/studentriasec/personality/" + request.session.User.idUser);
	},
	//match personality to riasec
	personality : function(request, respond){
		Riasec.query("select * from RIASEC"
			+" where idRIASEC IN"
			+ " (select RIASEC_idRIASEC from Student_Riasec"
			+" where Students_User_idUser = '"+ request.param('id') +"');",
		function (err, riasecs){
			if(err) return next(err);
			//console.log(riasecs);
			//pass all riasecs to view
			respond.view({
				riasecs: riasecs
			});
		});
	}
};
