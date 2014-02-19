/**
 * Course
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	schema: true,
	tableName: 'Course',
	adapter:'myLocalMySQLDatabase',
	migrate: 'safe',
	autoPk: false,
	autoCreatedAt: false,
	autoUpdatedAt: false,

	attributes:{
		idCourses:{
			type: 'string',
			required: true,
			primaryKey: true
		},
		C_name:{
			type:'string'
		},
		C_description:{
			type:'string'
		},
		C_cao:{
			type:'integer'
		},
		C_level:{
			type:'string'
		},
		Institutes_idInstitutes:{
			type:'string',
			required: true
		},
		C_special_reqs:{
			type:'string'
		}
	}
};