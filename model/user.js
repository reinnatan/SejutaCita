const mongose = require("mongoose");

const userSchema = new mongose.Schema({
    first_name: {type:String, default:null},
    last_name: {type:String, default:null},
    email: {type:String, unique:true},
    password: {type:String},
    token: {type:String},
    refresh_token: {type:String},
    user_type: {type:String},
});

module.exports = mongose.model("User", userSchema);