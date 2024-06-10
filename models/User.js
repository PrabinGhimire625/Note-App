const mongoose = require('mongoose');

// Define the person schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
}, {timestamps:true}
);

// Create the Person model
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;
