/**
 * Instituteamenity
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	tableName: 'Institute_Amenity',
	adapter:'myLocalMySQLDatabase',
	migrate: 'safe',
	autoPk: false,
	autoCreatedAt: false,
	autoUpdatedAt: false,

	attributes:{
		Amenities_idAmenities: {
			type: 'integer',
			required: true
		},
		Institutes_idInstitutes:{
			type: 'string',
			required: true
		}
	}
};
