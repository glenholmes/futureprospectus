/**
 * Subject
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	schema: true,
	tableName: 'SubjectsLC',
	adapter:'myLocalMySQLDatabase',
	migrate: 'safe',
	autoPk: false,
	autoCreatedAt: false,
	autoUpdatedAt: false,

	attributes:{
		idSubjects:{
			type:'integer',
			required: true,
			unique: true,
			primaryKey: true
		},
		S_name:{
			type: 'string',
			required: true
		},
		S_cao:{
			type: 'string',
			required: true
		}
	}
};
