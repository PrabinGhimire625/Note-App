const mongoose = require('mongoose');

// 1. Define the MongoDB connection URL
const mongoURL = "mongodb://localhost:27017/notesapp";

// 2. Set up MongoDB connection
mongoose.connect(mongoURL);


// 3. Get the default connection
const db = mongoose.connection;

// 4. Define event listeners
db.on('connected', () => {
    console.log("Connected to MongoDB server");
});

// Error event listener
db.on('error', (error) => {
    console.error("MongoDB connection error:", error);
});

// Disconnected event listener
db.on('disconnected', () => {
    console.log("MongoDB disconnected");
});

// 5. Export database connection
module.exports = db;
