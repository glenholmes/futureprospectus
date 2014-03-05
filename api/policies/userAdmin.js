module.exports = function(request, respond, next) {
	if(request.session.User != undefined){		
		var matchId = request.session.User.idUser === request.param('id');
		var check = request.session.User.U_type;
		if (!matchId || check.localeCompare('admin') == 0) {
			request.session.flash = {
				err : ["You do not have that sort of clearance!"]
			}			
			// User is not allowed
			return respond.redirect("/error/index");
		}
		next();
	} else {
		request.session.flash = {
			err : ["You must sign in to see your profile!"]
		}			
		// User is not allowed
		return respond.redirect("/error/index");
	}
};