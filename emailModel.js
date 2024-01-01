const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
  email: String,
  timestamp: Number, // Considerando que você deseja armazenar um timestamp
});

const Email = mongoose.model('Email', EmailSchema);

module.exports = Email;
