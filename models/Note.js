const mongoose = require('mongoose');

// Define the person schema
const noteSchema = new mongoose.Schema({
    email: { type: String, required: true},
    title: { type: String, required: true},
    desc: { type: String, required: true},
},{timestamps:true}
);

// Create the Person model
const Note = mongoose.model('Note', noteSchema);

// Export the model
module.exports = Note;
