/**
 * Recommendations
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes:{
		c_id : 'string',
		c_name : 'string',
		c_cao : 'integer',
		c_level: 'string',
		i_id : 'string',
		i_name : 'string',
		i_location : 'string',
		i_email: 'email',
		p_match : 'integer',
		a_match : 'integer',
		s_match : 'integer',
		l_match : 'integer',
		overall : 'integer'
	}
};
