// check if user is an administrator
module.exports = function(request, respond, next) {
	if(request.session.User != undefined){
		var check = request.session.User.U_type;

		if (request.session.User && check.localeCompare('admin') == 0) {
			return next();
		} else {
			request.session.flash = {
				err : ["You do not have that sort of clearance!"]
			}			
			// User is not allowed
			return respond.redirect("/error/index");
		}
	} else {
		request.session.flash = {
			err : ["You must sign in to see your profile!"]
		}			
		// User is not allowed
		return respond.redirect("/error/index");
	}
};
