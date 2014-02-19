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
		var riasecs = new Array();
		riasecs = request.param('riasec_letter');
		var riasecCount = [0,0,0,0,0,0];
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

		console.log(riasecCount[0]);

		var maxIndex = 0;
		var max = riasecCount[0];

		for (var j = 0; j < riasecCount.length; j++) {
		    if (riasecCount[j] > max) {
		        maxIndex = j;
		        max = riasecCount[j];
		    }
		}

		riasecCount[maxIndex] = Number.MIN_VALUE;
		console.log(riasecCount[maxIndex]);
		max = riasecCount[0];
		var secondMaxIndex = 0;
		for (var j = 0; j < riasecCount.length; j++) {
		    if (riasecCount[j] > max) {
		        secondMaxIndex = j;
		        max = riasecCount[j];
		    }
		}

		console.log("Second Max Position: " + secondMaxIndex + ", Value: " + max);

		respond.redirect("/studentriasec/new");
	}
};