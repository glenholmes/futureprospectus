/**
 * Amenity
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	schema: true,
	tableName: 'Amenities',
	adapter:'myLocalMySQLDatabase',
	migrate: 'safe',
	autoPk: true,
	autoCreatedAt: false,
	autoUpdatedAt: false,

	attributes: {
		idAmenities: {
			type: 'integer',
			required: true,
			primaryKey: true
		},
		A_name:{
			type: 'string',
			required: true
		}
	}
};
