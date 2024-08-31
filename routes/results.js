// models/Result.js
import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  results: {
    '1st': { type: Number, default: 0 },
    '2nd': { type: Number, default: 0 },
    '3rd': { type: Number, default: 0 },
    '4th': { type: Number, default: 0 },
    '5th': { type: Number, default: 0 },
    '6th': { type: Number, default: 0 }
  }
});

export default mongoose.model('Result', resultSchema);
