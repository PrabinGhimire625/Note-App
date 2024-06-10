const express = require('express');
const bcrypt = require('bcrypt'); // Add this line
const app = express();

app.use(express.json());  //middleware
app.use(express.urlencoded({ extended: true }));

const db = require('./db');  //export db.js file here
const Note = require('./models/Note');
const User = require('./models/User');
const port = 4000;

// Serve static files from the 'images' directory
app.use(express.static('images'));

//endpoints to serve the html
app.get('/', (req, res) => {
  res.sendFile("pages/index.html", { root: __dirname });
});
app.get('/login', (req, res) => {
  res.sendFile("pages/login.html", { root: __dirname });
});
app.get('/signup', (req, res) => {
  res.sendFile("pages/signup.html", { root: __dirname });
});
// Serve the profile page
app.get('/profile', (req, res) => {
  res.sendFile("pages/profile.html", { root: __dirname });
});
// Serve the editNote page
app.get('/editNote', (req, res) => {
  res.sendFile("pages/editNote.html", { root: __dirname });
});


//display the existing title and description in new editNote 
// Get a single note by ID
app.get('/getnote/:noteId', async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.status(200).json({ success: true, note });
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

//endpoints to serve the APIs
app.post('/getnotes', async(req, res) => {
  let notes=await Note.find({email: req.body.email})
  res.status(200).json({success: true, notes })
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "No user found" });
    }
    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect password" });
    }
    // Return success response if passwords match
    res.status(200).json({ success: true, user: { email: user.email }, message: "User found" });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

//signup
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    // Create the user with hashed password
    const user = await User.create({ email, password: hashedPassword });
    // Return success response
    res.status(201).json({ success: true, user });
  } catch (error) {
    // Handle error
    console.error('Error during signup:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Logout API
app.post('/logout', (req, res) => {
  // Clear user data from local storage
  localStorage.removeItem("user");
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// Logout API
app.post('/profile', (req, res) => {
});

//add notes
app.post('/addnotes', async (req, res) => {
  const { userToken } = req.body;
  let note=await Note.create(req.body)
  res.status(200).json({success:true, note}) 
});

// Delete user profile
app.post('/deleteUserProfile', async (req, res) => {
  const { email } = req.body;
  try {
      // Delete user from MongoDB
      await User.findOneAndDelete({ email });
      res.status(200).json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
      console.error('Error deleting user profile:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

//edit the user profile
app.post('/updateUserProfile', async (req, res) => {
  const { oldEmail, email, password } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email: oldEmail },
      { email, password },
      { new: true }
    );
    if (user) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Delete a note
app.post('/deleteNote', async (req, res) => {
  const { noteId } = req.body;
  try {
    await Note.findByIdAndDelete(noteId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Updates the notes
app.post('/editNote', async (req, res) => {
  const { noteId, title, desc } = req.body;
  try {
    // Find the note by ID and update its title and description
    const updatedNote = await Note.findByIdAndUpdate(noteId, { title, desc }, { new: true });
    if (!updatedNote) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    res.status(200).json({ success: true, note: updatedNote });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update a note by ID
app.put('/editnote/:noteId', async (req, res) => {
  try {
    const { title, desc } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(req.params.noteId, { title, desc }, { new: true });
    if (!updatedNote) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.status(200).json({ success: true, note: updatedNote });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


//run in the port
app.listen(port, () => {
  console.log(`An app is listening on port http://localhost:${port}`);
});
