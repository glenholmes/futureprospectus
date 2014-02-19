module.exports = function (request, respond, next){
	//create a blank object
	respond.locals.flash = {};
	//if request doesn't exist return next
	if(!request.session.flash) return next();
	//if it does clone whats there
	respond.locals.flash = _.clone(request.session.flash);
	//clear the request
	request.session.flash = {};
	next();
}