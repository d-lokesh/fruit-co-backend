const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

let whatsappClient; // Global client instance
let isClientReady = false; // Track if the client is ready

// Initialize WhatsApp Client
const initializeWhatsAppClient = async () => {
  if (whatsappClient) {
    console.log('WhatsApp client already initialized.');
    whatsappClient.on('ready', () => {
      console.log('WhatsApp client is ready!');
      isClientReady = true;
    });
  
    return;
  }
console.log("hitting");
  whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true },
  });

  whatsappClient.on('qr', (qr) => {
    console.log('QR Code received:');
    qrcode.generate(qr, { small: true });
  });

  whatsappClient.on('ready', () => {
    console.log('WhatsApp client is ready!');
    isClientReady = true;
  });

  whatsappClient.on('authenticated', () => {
    console.log('Client authenticated successfully!');
  });


  whatsappClient.on('auth_failure', (msg) => {
    console.error('Authentication failed:', msg);
  });

  await whatsappClient.initialize();
};

// Function to check if the client is ready
const getWhatsAppClient = () => {
  if (!whatsappClient || !isClientReady) {
    throw new Error('WhatsApp client is not initialized or ready.');
  }
  return whatsappClient;
};

// Function to send a WhatsApp message with text and image
const sendEnhancedWhatsAppMessage = async (orderId, phone, name, plan, deliveryDate, orderType) => {
  const client = getWhatsAppClient(); // Use the initialized client
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
    const media = MessageMedia.fromFilePath('./dfc.png'); // Path to your image
    await client.sendMessage(formattedPhone, media, { caption: whatsappMessage });
    console.log('Image sent successfully');
  } catch (error) {
    console.error('Failed to send WhatsApp message or image:', error);
    throw new Error('Message sending failed');
  }
};

module.exports = {
  initializeWhatsAppClient,
  sendEnhancedWhatsAppMessage,
};
