/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your
 *				   controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(request, respond, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (request.session.authenticated) {
    return next();
  }
  // User is not allowed
  request.session.flash = {
	err : ["You must sign in to see your profile!"]
  }
  return respond.redirect("/error/index");
};
