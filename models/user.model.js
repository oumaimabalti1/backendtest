const mongoose = require('mongoose'); 


const userSchema = new mongoose.Schema({
    name: {type: String, required: true  },
    email: {type: String, required: {true,  "Email is required"}, unique: true },
    password: {type: String, required: true },
    role : {type: String, enum: ['admin', 'user'], default: 'user' }
},


{timestamps: true}); //ytalla createdat w updatedat
const User = mongoose.model('User', userSchema);

module.exports = User;
