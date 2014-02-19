/**
 * Institute
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	schema: true,
	tableName: 'Institutes',
	adapter:'myLocalMySQLDatabase',
	migrate: 'safe',
	autoPk: false,
	autoCreatedAt: false,
	autoUpdatedAt: false,

	attributes:{
		idInstitutes:{
			type: 'string',
			required: true,
			primaryKey: true
		},
		I_name:{
			type: 'string'
		},
		I_url:{
			type: 'string'
		},
		I_email:{
			type: 'string',
			email: true
		},
		I_telephone:{
			type: 'string'
		},
		County_County_name:{
			type: 'string',
			required: true
		},
		User_idUser:{
			type: 'string',
			required: true
		}
	}
};