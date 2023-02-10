const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, `Please enter your name`],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email!'],
      lowercase: true,
      unique: true,
    },
    phone: {
      type: String,
      length: 10,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Client', ClientSchema);
