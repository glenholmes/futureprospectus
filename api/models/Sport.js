
/**
 * Sport
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	schema: true,
	tableName: 'Sports',
	adapter:'myLocalMySQLDatabase',
	migrate: 'safe',
	autoPk: true,
	autoCreatedAt: false,
	autoUpdatedAt: false,

	attributes: {
		idSports: {
			type: 'integer',
			required: true,
			primaryKey: true
		},
		S_name:{
			type: 'string',
			required: true,
			maxLength: 45
		}
	}
};
