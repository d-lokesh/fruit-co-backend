const mongoose = require('mongoose');

// Check if the model already exists
const WhatsappSession = mongoose.models.WhatsappSession || mongoose.model('WhatsappSession', new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  session: { type: mongoose.Schema.Types.Mixed, required: true }, // Allow any object
}));

module.exports = WhatsappSession;
