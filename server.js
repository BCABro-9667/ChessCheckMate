

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://Avdhesh1:ya4XYnQUEtYhv5kr@cluster0.0uojesi.mongodb.net/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Define user schema and model
const userSchema = new mongoose.Schema({
  username: String,
  age: Number,
  course: String,
  college: String,
  phone: Number,
  email: String,
  chess_id: String,
  rating: Number,
  transaction_id: String,
  // password: String, // For storing hashed passwords
});

const User = mongoose.model('User', userSchema);

// Define chess results schema and model
const chessSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  results: {
    "1st": Number,
    "2nd": Number,
    "3rd": Number,
    "4th": Number,
    "5th": Number,
    "6th": Number,
  },
});

const ChessResult = mongoose.model('ChessResult', chessSchema, 'chess'); // Ensure it uses the 'chess_result' collection

// Endpoints
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Endpoint to handle form submissions with duplicate check
app.post('/register', async (req, res) => {
  try {
    const { username, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username, phone });
    if (existingUser) {
      return res.status(400).json({ message: 'You are already registered.' });
    }

    // Save the new user
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving user data');
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching users');
  }
});

// Endpoint for fetching chess results with search, sort, and total win points calculation
app.get('/chess-results', async (req, res) => {
  try {
    const { search = '', sort = 'name', order = 'asc' } = req.query;
    
    // Build the query and sort options
    const query = { name: { $regex: search, $options: 'i' } }; // Case-insensitive search
    
    // Sorting
    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;
    
    const chessResults = await ChessResult.find(query).sort(sortOptions);
    
    // Calculate total win points for each result
    const resultsWithTotalPoints = chessResults.map(result => {
      const totalPoints = Object.values(result.results).filter(val => val === 1).length;
      return { ...result._doc, totalPoints }; // Add totalPoints to each result
    });
    
    res.json(resultsWithTotalPoints);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching chess results');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
