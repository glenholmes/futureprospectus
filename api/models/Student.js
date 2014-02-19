/**
 * Student
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	schema: true,
	tableName: 'Students',
	adapter:'myLocalMySQLDatabase',
	migrate: 'safe',
	autoPk: false,
	autoCreatedAt: false,
	autoUpdatedAt: false,

	attributes:{
		User_idUser: {
			type:'string',
			required: true,
			primaryKey: true,
			maxLength: 20
		},
		S_CAO: {
			type: 'integer'
		},
		S_Parent: {
			type: 'string',
			email: true
		}
	}
};
