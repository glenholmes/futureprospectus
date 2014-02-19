/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt');

module.exports = {

  schema: true,
  tableName: 'User',
  adapter:'myLocalMySQLDatabase',
  migrate: 'safe',
  autoPk: false,
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {
  	idUser: {
  		type: 'string',
  		required: true,
      primaryKey: true,
      maxLength: 20
  	},
  	U_password:{
  		type: 'string',
      required: true
  	},
  	U_email:{
  		type: 'string',
  		email: true,
  		required: true
  	},
  	U_type:{
  		type: 'string',
      required: true
  	},
    toJSON: function(){
      var obj = this.toObject();
      delete obj.id;
      delete obj.U_password;
      delete obj.Confirmation;
      delete obj._csrf;
      return obj;
    }
  },

  beforeCreate: function (values, next){
    if (!values.U_password || values.U_password != values.Confirmation){
      return next ({
        err: ["Password and confirmation password do not match!"]
      });
    }
    bcrypt.hash(values.U_password, 10, function pEncrypt(err, encryptedP){
      if(err) return next(err);
      values.U_password = encryptedP;
      next();
    });
  }
};
