let db = require('../db');
let CryptoJS = require("crypto-js");

// region index of permissions on database
permissions = {
  dashboard: 0,
  transaction: 1
};
// endregion

const secret = "cashF!ow5";

hash = (message) => {
    return CryptoJS.HmacSHA256(message, secret).toString();
};

exports.getIdFromToken = async (token) => {
    const user = await db.get('select', 'user', {}, {token});
    return user.id;
};


exports.authenticate = async (username, password) => {
    let user = await db.get('select', 'user', {}, {username, password});
    let response = {};
    if(user){
        let todayTimestamp = (new Date()).getTime();
        response.success = true;
        response.permissions = user.permissions;
        response.token = hash(user.username + user.password + todayTimestamp);
        db.set('update', 'user', {token: response.token}, {id: user.id});
    }else{
        response.success = false;
    }
    return response;
};

exports.checkTokenAndPermission = async (token, feature, level) => {
    let user = await db.get('select', 'user', {}, {token});
    let allowAccess = false;
    let validToken = !!user;
    if(validToken){
        let permission = await db.get('select', 'userType', {}, {id: user.userType});
        if(permission.permissions.charAt(permissions[feature])>=level){
            allowAccess = true;
        }

    }
    return allowAccess;
};
