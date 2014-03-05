/**
 * Institutesport
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	tableName: 'Institute_Sport',
	adapter:'myLocalMySQLDatabase',
	migrate: 'safe',
	autoPk: false,
	autoCreatedAt: false,
	autoUpdatedAt: false,

	attributes:{
		Sports_idSports: {
			type: 'integer',
			required: true
		},
		Institutes_idInstitutes:{
			type: 'string',
			required: true
		}
	}
};
