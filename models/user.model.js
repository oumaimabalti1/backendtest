const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true  },
    email: {type: String, required: [true, "Email is required"], unique: true },
    password: {type: String, required: true },
    role : {type: String, enum: ['admin', 'user'], default: 'user' }
},


{timestamps: true}); //ytalla createdat w updatedat
const User = mongoose.model('User', userSchema);


userSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) return next();
        const salt = await bcrypt.genSalt();
        const user = this;
        user.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});
module.exports = User;
