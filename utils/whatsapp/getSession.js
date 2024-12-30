const WhatsappSession = require('../../models/WhatsappSession');

const getSession = async (userId) => {
  try {
    const session = await WhatsappSession.findOne({ userId });
    if (session) {
      console.log('Session fetched successfully');
    }
    return session ? session.session : null;
  } catch (err) {
    console.error('Error fetching session from MongoDB:', err);
    return null;
  }
};

module.exports = getSession;
