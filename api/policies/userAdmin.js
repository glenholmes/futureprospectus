module.exports = function(request, respond, next) {
	if(request.session.User != undefined){
		var s_id = request.session.User.idUser;
		s_id = s_id.toUpperCase();
		var r_id = request.param('id');
		r_id = r_id.toUpperCase();
		if (r_id == undefined){
			request.session.flash = {
				err : ["This is not part of your profile!"]
			}			
			// User is not allowed
			return respond.redirect("/error/index");
		}
		var matchId = r_id.localeCompare(s_id);
		var check = request.session.User.U_type;

		if (matchId == 0 || check.localeCompare('admin') == 0){
			return next();
		}
		else{
			request.session.flash = {
				err : ["This is not part of your profile!"]
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