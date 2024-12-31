const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');


// Define the image path for use in the message
const imagePath = './dfc.png'; // Path to the image to send

let whatsappClient;

// Initialize WhatsApp Client

const initializeWhatsAppClient = async () => {
  try {
    if (fs.existsSync('./.wwebjs_auth/session/Default/chrome_debug.log')) {
      fs.unlinkSync('./.wwebjs_auth/session/Default/chrome_debug.log'); // Delete file if possible
    }
    whatsappClient = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: { headless: true },
    });

    whatsappClient.on('ready', () => {
      console.log('WhatsApp client is ready!');
    });

    await whatsappClient.initialize();
  } catch (error) {
    console.error('Error initializing WhatsApp client:', error);
  }
};


// Function to send a WhatsApp message with text and image
const sendEnhancedWhatsAppMessage = async (orderId,phone, name, plan, deliveryDate, orderType) => {
  const formattedPhone = phone.startsWith('91') ? `${phone}@c.us` : `91${phone}@c.us`;

  const whatsappMessage = `
  Hello ${name},
  
  We’re excited to have you as our valued customer! 🎉
  
  Your order(Order ID: ${orderId}) has been successfully placed and is currently under review. Here are your order details:
  
  🌟 Plan: ${plan}  
  📅 Delivery Date: ${deliveryDate}  
  📦 Order Type: ${orderType}
  
  Thank you for choosing Daily Fruit Co. We’ll notify you once your order is confirmed and ready for delivery!
  
  Best regards,  
  The Daily Fruit Co Team 🍎
  `;
  

  try {
    // Send the text message
    // await whatsappClient.sendMessage(formattedPhone, whatsappMessage);
    // console.log('Text message sent successfully');

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
