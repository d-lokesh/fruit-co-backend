const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { getWhatsAppClient } = require('./whatsappClient'); // Import getClient function
const logger = require('../../logger');  // Import the logger



// Declare the client variable first
let whatsappClient; // Global client instance
let isClientReady = false; // Track if the client is ready


// Initialize WhatsApp Client
const initializeWhatsAppClient = async () => {
  if (whatsappClient) {
    logger.info('WhatsApp client already initialized.');
    whatsappClient.on('ready', () => {
      logger.info('WhatsApp client is ready!');
      isClientReady = true;
    });
    return;
  }

  logger.info("Initializing WhatsApp client...");

  // Initialize whatsappClient here, after declaring the variable
  whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true },
  });

  whatsappClient.on('qr', (qr) => {
    logger.info('QR Code received:');
    qrcode.generate(qr, { small: true });
  });

  whatsappClient.on('ready', () => {
    logger.info('WhatsApp client is ready!');
    isClientReady = true;
  });

  whatsappClient.on('authenticated', () => {
    logger.info('Client authenticated successfully!');
  });

  whatsappClient.on('auth_failure', (msg) => {
    console.error('Authentication failed:', msg);
  });

  await whatsappClient.initialize();
};

// Function to check if the client is ready
// const getWhatsAppClient = () => {
//   if (!whatsappClient || !isClientReady) {
//     throw new Error('WhatsApp client is not initialized or ready.');
//   }
//   return whatsappClient;
// };

// Function to send a WhatsApp message with text and image
const sendEnhancedWhatsAppMessage = async (orderId, phone, name, plan, deliveryDate, orderType) => {
  const client = getWhatsAppClient(); // Use the initialized client
  const formattedPhone = phone.startsWith('91') ? `${phone}@c.us` : `91${phone}@c.us`;

  const whatsappMessage = `Hello ${name},\n\nWe’re excited to have you as our valued customer! 🎉\nYour order(${orderId}) has been successfully placed and is currently under review. Here are your order details:\n\n🌟 Plan: ${plan}\n📅 Delivery Date: ${deliveryDate}\n📦 Order Type: ${orderType}\n\nThank you for choosing Daily Fruit Co. We’ll notify you once your order is confirmed and ready for delivery!\n\nBest regards,\nThe Daily Fruit Co Team 🍎`;

  try {
    const media = MessageMedia.fromFilePath('./oplaced.png'); // Path to your image
    await client.sendMessage(formattedPhone, media, { caption: whatsappMessage });
    logger.info('Image sent successfully');
  } catch (error) {
    console.error('Failed to send WhatsApp message or image:', error);
    throw new Error('Message sending failed');
  }
};

const sendOrderConfirmationWhatsAppMessage = async (orderId,dfcPaymentId, phone, name, plan, deliveryDate, orderType) => {
  const client = getWhatsAppClient(); // Use the initialized client
  const formattedPhone = phone.startsWith('91') ? `${phone}@c.us` : `91${phone}@c.us`;

  const whatsappMessage = `Hello ${name},\n\n✨ Exciting news! Your payment for Order ID: ${orderId} is confirmed! 🏦\n\n💳 Payment ID: ${dfcPaymentId}\n\nYour order is now fully confirmed and will be delivered on schedule. 🚛💨\n\nOrder details:\n🌟 Plan: ${plan}\n📅 Delivery Date: ${deliveryDate}\n📦 Order Type: ${orderType}\n\nWe're thrilled to bring you the freshest fruits from Daily Fruit Co. 🥝🍇🍎\nNeed help? We're always here for you!\n\nThank you for choosing Daily Fruit Co.!\nBest regards,\nThe Daily Fruit Co. Team `;

  try {
    const media = MessageMedia.fromFilePath('./acceptO.png'); // Path to your confirmation image
    await client.sendMessage(formattedPhone, media, { caption: whatsappMessage });
    logger.info('Order confirmation message sent successfully');
  } catch (error) {
    console.error('Failed to send WhatsApp message or image:', error);
    throw new Error('Message sending failed');
  }
};

const sendOrderRejectedWhatsAppMessage = async (orderId, phone, name, plan, orderType) => {
  const client = getWhatsAppClient(); // Use the initialized client
  const formattedPhone = phone.startsWith('91') ? `${phone}@c.us` : `91${phone}@c.us`;

  const whatsappMessage = `Hello ${name},\n\nWe regret to inform you that your order (Order ID: ${orderId}) for the ${plan} ${orderType} could not be processed at this time due to our delivery policies or service limitations in your area. 🚫\n\nWe sincerely apologize for this inconvenience and want to assure you that we are working to expand our service coverage. 🗺️\n\nWe truly value your interest in Daily Fruit Co, and we look forward to serving you as soon as we start operations in your location. 🌟\n\nThank you for your understanding and patience.\n\nWarm regards,\nThe Daily Fruit Co Team 🍎`;

  try {
    const media = MessageMedia.fromFilePath('./order_rejected.png'); // Path to your rejection-related image
    await client.sendMessage(formattedPhone, media, { caption: whatsappMessage });
    logger.info('Rejection message sent successfully');
  } catch (error) {
    console.error('Failed to send WhatsApp rejection message or image:', error);
    throw new Error('Message sending failed');
  }
};


const sendQrCodeWhatsAppMessage = async (orderId, phone, name, plan, deliveryDate, orderType) => {
  const client = getWhatsAppClient(); // Use the initialized client
  const formattedPhone = phone.startsWith('91') ? `${phone}@c.us` : `91${phone}@c.us`;

  const whatsappMessage = `Hello ${name},\n\nThanks for ordering from Daily Fruit Co.! 🎉\n\nYour order details:\n🌟 Plan: ${plan}\n📦 Type: ${orderType}\n📅 Delivery Date: ${deliveryDate}\n🆔 Order ID: ${orderId}\n\nPlease complete payment via the QR code to confirm. We'll process and deliver your order once payment is received.\n\nThanks for choosing us! 🍎`;

  try {
    const media = MessageMedia.fromFilePath('./finalQr.png'); // Path to your image
    await client.sendMessage(formattedPhone, media, { caption: whatsappMessage });
    logger.info('Image sent successfully');
  } catch (error) {
    console.error('Failed to send WhatsApp message or image:', error);
    throw new Error('Message sending failed');
  }
};

module.exports = {
  initializeWhatsAppClient,
  sendEnhancedWhatsAppMessage,
  sendQrCodeWhatsAppMessage,
  sendOrderConfirmationWhatsAppMessage,
  sendOrderRejectedWhatsAppMessage
};
