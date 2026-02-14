const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true  },
    email: {type: String, required: [true, "Email is required"], unique: true },
    password: {type: String, required: true },
    role : {type: String, enum: ['admin', 'RH','employee','candidat']},
departement: { type: String, enum: ['IT','Finance','Marketing','Sales'] },
    // Champs pour Employee et RH
    entrepriseId: { type: mongoose.Schema.Types.ObjectId,ref: 'Entreprise'},
    



}, 


{timestamps: true}); //ytalla createdat w updatedat



userSchema.pre("save", async function () {
  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
