/**
 * Studentriasec
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {schema: true,

	tableName: 'Student_Riasec',
	adapter:'myLocalMySQLDatabase',
	migrate: 'safe',
	autoPk: false,
	autoCreatedAt: false,
	autoUpdatedAt: false,

	attributes:{
		RIASEC_idRIASEC: {
			type: 'text',
			required: true
		},
		Students_User_idUser:{
			type: 'string',
			required: true
		}
	}
};
