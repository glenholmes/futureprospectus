/**
 * Studentamenity
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	tableName: 'Student_Amenity',
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
		Students_User_idUser:{
			type: 'string',
			required: true
		}
	}
};
