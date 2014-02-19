/**
 * Riasec
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	schema: true,
	tableName: 'RIASEC',
	adapter:'myLocalMySQLDatabase',
	migrate: 'safe',
	autoPk: false,
	autoCreatedAt: false,
	autoUpdatedAt: false,

	attributes: {
		idRIASEC: {
			type: 'text',
			required: true,
			primaryKey: true
		},
		R_description:{
			type: 'string',
			required: true
		}
	}
};
