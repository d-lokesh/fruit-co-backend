const WhatsappSession = require('../../models/WhatsappSession');

const storeSession = async (userId, session) => {
  try {
    const existingSession = await WhatsappSession.findOne({ userId });

    if (existingSession) {
      // Update the session if it already exists
      existingSession.session = session;
      await existingSession.save();
    } else {
      // Create a new session document
      const newSession = new WhatsappSession({
        userId,
        session,
      });
      await newSession.save();
    }
    console.log('Session saved successfully');
  } catch (err) {
    console.error('Error saving session to MongoDB:', err);
    throw new Error('Failed to save session to database');
  }
};

module.exports = storeSession;
