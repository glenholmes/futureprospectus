/**
 * Courseoccupation
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	schema: true,
	tableName: 'Course_Occupation',
	adapter:'myLocalMySQLDatabase',
	migrate: 'safe',
	autoPk: false,
	autoCreatedAt: false,
	autoUpdatedAt: false,

	attributes:{		
		Occupation_idOccupation:{
			type:'string',
			required: true
		},
		Course_idCourses:{
			type: 'string',
			required: true
		}
	}
};
