const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Define the image path for use in the message
const imagePath = './dfc.png'; // Path to the image to send

let whatsappClient;

// Initialize WhatsApp Client
const initializeWhatsAppClient = async () => {
  whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true },
  });

  // Listen for QR code generation
  whatsappClient.on('qr', (qr) => {
    console.log('Scan this QR code with your WhatsApp to log in:');
    qrcode.generate(qr, { small: true });
  });

  // Listen for when the client is ready
  whatsappClient.on('ready', () => {
    console.log('WhatsApp client is ready!');
  });

  // Start the WhatsApp client
  await whatsappClient.initialize();
};

// Function to send a WhatsApp message with text and image
const sendEnhancedWhatsAppMessage = async (phone, name, plan, deliveryDate, orderType, moreInfo) => {
  const formattedPhone = phone.startsWith('91') ? `${phone}@c.us` : `91${phone}@c.us`;

  const whatsappMessage = `
Hi ${name}, your order has been placed successfully!

Details:
Plan: ${plan}
Delivery Date: ${deliveryDate}
Order Type: ${orderType}
More Info: ${moreInfo}
`;

  try {
    // Send the text message
    // await whatsappClient.sendMessage(formattedPhone, whatsappMessage);
    console.log('Text message sent successfully');

    // If an image is provided, send it
    if (imagePath) {
      const media = MessageMedia.fromFilePath(imagePath); // Load the image from the given path
      await whatsappClient.sendMessage(formattedPhone, media, {
        caption: whatsappMessage,
      });
      console.log('Image sent successfully');
    }
  } catch (error) {
    console.error('Failed to send WhatsApp message or image:', error);
    throw new Error('Message sending failed');
  }
};

module.exports = {
  initializeWhatsAppClient,
  sendEnhancedWhatsAppMessage,
};
